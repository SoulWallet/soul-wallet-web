import api from '@/lib/api';
import {
  base64ToBigInt,
  base64ToBuffer,
  getCurrentTimeFormatted,
  uint8ArrayToHexString,
  parseBase64url,
  arrayBufferToHex,
  hexToUint8Array,
  stringToUint8Array,
} from '@/lib/tools';
import { client, server } from '@passwordless-id/webauthn';
import { ECDSASigValue } from '@peculiar/asn1-ecc';
import { AsnParser } from '@peculiar/asn1-schema';
import { WebAuthN } from '@soulwallet/sdk';
import { ethers } from 'ethers';

const base64urlTobase64 = (base64url: string) => {
  const paddedUrl = base64url.padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), '=');
  return paddedUrl.replace(/\-/g, '+').replace(/_/g, '/');
};

const base64Tobase64url = (base64: string) => {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export default function usePasskey() {
  const decodeDER = (signature: string) => {
    const derSignature = base64ToBuffer(signature);
    const parsedSignature = AsnParser.parse(derSignature, ECDSASigValue);
    let rBytes = new Uint8Array(parsedSignature.r);
    let sBytes = new Uint8Array(parsedSignature.s);
    if (rBytes.length === 33 && rBytes[0] === 0) {
      rBytes = rBytes.slice(1);
    }
    if (sBytes.length === 33 && sBytes[0] === 0) {
      sBytes = sBytes.slice(1);
    }
    const r = `0x${uint8ArrayToHexString(rBytes).padStart(64, '0')}`;
    const s = `0x${uint8ArrayToHexString(sBytes).padStart(64, '0')}`;

    return {
      r,
      s,
    };
  };

  const getES256Coordinates = async (credentialPublicKey: string) => {
    const publicKeyBinary = Uint8Array.from(atob(base64urlTobase64(credentialPublicKey)), (c) => c.charCodeAt(0));

    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBinary,
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['verify'],
    );

    const jwk: any = await crypto.subtle.exportKey('jwk', publicKey);

    const Qx = base64ToBigInt(base64urlTobase64(jwk.x));

    const Qy = base64ToBigInt(base64urlTobase64(jwk.y));

    return WebAuthN.publicKeyToKeyhash({
      x: `0x${Qx.toString(16).padStart(64, '0')}`,
      y: `0x${Qy.toString(16).padStart(64, '0')}`,
    })
  };

  const getRS256Coordinates = async (credentialPublicKey: string) => {
    const algoParams = {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    };
    const buffer = parseBase64url(credentialPublicKey);
    const cryptoKey = await crypto.subtle.importKey('spki', buffer, algoParams, true, ['verify']);
    // publick key
    const jwk: any = await crypto.subtle.exportKey('jwk', cryptoKey);
    console.log('======== public key ========');
    console.log('alg:', jwk.alg);
    console.log('kty:', jwk.kty);
    console.log('e:', parseBase64url(jwk.e));
    console.log('n:', parseBase64url(jwk.n));
    console.log('======== Hex e ========');
    console.log(arrayBufferToHex(parseBase64url(jwk.e)));
    console.log('======== Hex n ========');
    console.log(arrayBufferToHex(parseBase64url(jwk.n)));

    return WebAuthN.publicKeyToKeyhash({
      e: arrayBufferToHex(parseBase64url(jwk.e)),
      n: arrayBufferToHex(parseBase64url(jwk.n)),
    })
  };

  const getPublicKey = async (credential: any) => {
    if (credential.algorithm === 'ES256') {
      return await getES256Coordinates(credential.publicKey);
    } else if (credential.algorithm === 'RS256') {
      return await getRS256Coordinates(credential.publicKey);
    }
  };

  const register = async (credentialName: string) => {
    const randomChallenge = btoa('1234567890');
    const finalCredentialName = `${credentialName}_${getCurrentTimeFormatted()}`;
    const registration = await client.register(finalCredentialName, randomChallenge, {
      authenticatorType: 'both',
    });

    console.log('Registered: ', JSON.stringify(registration, null, 2));

    const publicKey = await getPublicKey(registration.credential);

    const credentialKey = {
      id: registration.credential.id,
      publicKey,
      algorithm: registration.credential.algorithm,
      name: finalCredentialName,
    };

    // backup credential info
    await api.backup.publicBackupCredentialId({
      credentialID: credentialKey.id,
      data: JSON.stringify({
        publicKey: credentialKey.publicKey,
        algorithm: credentialKey.algorithm,
      }),
    });

    return credentialKey;
  };

  const sign = async (credential: any, userOpHash: string) => {
    const userOpHashForBytes = userOpHash.startsWith('0x') ? userOpHash.substr(2) : userOpHash;

    var byteArray = new Uint8Array(32);
    for (var i = 0; i < 64; i += 2) {
      byteArray[i / 2] = parseInt(userOpHashForBytes.substr(i, 2), 16);
    }
    let challenge = base64Tobase64url(btoa(String.fromCharCode(...byteArray)));

    console.log('Authenticating...');
    let authentication = await client.authenticate([credential.id], challenge, {
      userVerification: 'required',
    });
    const authenticatorData = `0x${base64ToBigInt(base64urlTobase64(authentication.authenticatorData)).toString(16)}`;
    const clientData = atob(base64urlTobase64(authentication.clientData));

    const sliceIndex = clientData.indexOf(`","origin"`);
    const clientDataSuffix = clientData.slice(sliceIndex);
    console.log('decoded clientData', clientData, clientDataSuffix);
    const signature = base64urlTobase64(authentication.signature);
    console.log(`signature: ${signature}`);

    if (credential.algorithm === 'ES256') {
      const { r, s } = decodeDER(signature);

      return {
        messageHash: userOpHash,
        publicKey: credential.publicKey,
        r,
        s,
        authenticatorData,
        clientDataSuffix,
      };
    } else if (credential.algorithm === 'RS256') {
      return {
        messageHash: userOpHash,
        publicKey: credential.publicKey,
        signature,
        authenticatorData,
        clientDataSuffix,
      };
    }
  };

  const authenticate = async () => {
    const userOpHash = ethers.ZeroHash;
    const userOpHashForBytes = userOpHash.startsWith('0x') ? userOpHash.substr(2) : userOpHash;

    var byteArray = new Uint8Array(32);
    for (var i = 0; i < 64; i += 2) {
      byteArray[i / 2] = parseInt(userOpHashForBytes.substr(i, 2), 16);
    }
    let challenge = base64Tobase64url(btoa(String.fromCharCode(...byteArray)));

    console.log('Authenticating...');
    let authentication = await client.authenticate([], challenge, {
      userVerification: 'required',
    });
    console.log('Authenticated', authentication);
    // const authenticatorData = `0x${base64ToBigInt(base64urlTobase64(authentication.authenticatorData)).toString(16)}`;
    const clientData = atob(base64urlTobase64(authentication.clientData));

    const sliceIndex = clientData.indexOf(`","origin"`);
    const clientDataSuffix = clientData.slice(sliceIndex);
    console.log('decoded clientData', clientData, clientDataSuffix);
    const signature = base64urlTobase64(authentication.signature);
    console.log(`signature: ${signature}`);

    const credentialInfo = JSON.parse(
      (
        await api.backup.credential({
          credentialID: authentication.credentialId,
        })
      ).data.data,
    );

    console.log('credential info', credentialInfo);

    return {
      publicKey: credentialInfo.publicKey,
      credential: {
        ...authentication,
        algorithm: credentialInfo.algorithm,
      },
    };
  };

  return {
    decodeDER,
    register,
    sign,
    authenticate,
  };
}
