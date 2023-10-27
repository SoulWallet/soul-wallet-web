import { base64ToBigInt, base64ToBuffer, uint8ArrayToHexString } from '@/lib/tools';
import { client, server } from '@passwordless-id/webauthn';
import { ECDSASigValue } from '@peculiar/asn1-ecc';
import { AsnParser } from '@peculiar/asn1-schema';
import { useCredentialStore } from '@/store/credential';

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

  const getCoordinates = async (credentialPublicKey: string) => {
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

    return {
      x: `0x${Qx.toString(16).padStart(64, '0')}`,
      y: `0x${Qy.toString(16).padStart(64, '0')}`,
    };
  };

  const register = async (credentialName: string) => {
    // get total registered nums and generate name
    const randomChallenge = btoa('1234567890');
    const registration = await client.register(credentialName, randomChallenge, {
      authenticatorType: 'both',
    });
    console.log('Registered: ', JSON.stringify(registration, null, 2));
    // verify locally
    // const registrationParsed = await server.verifyRegistration(registration, {
    //     challenge: randomChallenge,
    //     origin: window.origin,
    // });
    // console.log('Parsed Registration: ', JSON.stringify(registrationParsed, null, 2));

    const coords = await getCoordinates(registration.credential.publicKey);

    console.log('coords', coords);

    const credentialKey = {
      id: registration.credential.id,
      publicKey: registration.credential.publicKey,
      algorithm: 'ES256',
      name: credentialName,
      coords,
    };

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
    const { r, s } = decodeDER(signature);
    const { x, y } = credential.coords;

    return {
      messageHash: userOpHash,
      publicKey: {
        x,
        y,
      },
      r,
      s,
      authenticatorData,
      clientDataSuffix,
    };
  };

  const getKeyBySignature = (signature: string | undefined) => {
    if(!signature){
      return
    }
    const signatureBase64 = base64urlTobase64(signature);
    const { r, s } = decodeDER(signatureBase64);

    console.log('r s:', r, s);

    return {
      r,s
    }
  }

  const authenticate = async (challenge: string, credentialId?: string) => {
    try {
      return await client.authenticate(credentialId ? [credentialId] : [], challenge);
    } catch (err) {}
  };

  return {
    decodeDER,
    register,
    sign,
    authenticate,
    getCoordinates,
    getKeyBySignature,
  };
}
