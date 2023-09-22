import { base64ToBigInt } from '@/lib/tools';
import { client, server } from '@passwordless-id/webauthn';
import { ECDSASigValue } from '@peculiar/asn1-ecc';
import { AsnParser } from '@peculiar/asn1-schema';
import { useCredentialStore } from '@/store/credential';

export default function usePasskey() {
  const { addCredential, credentials } = useCredentialStore();
  const decodeDER = (signature: string) => {
    const derSignature = Buffer.from(signature, 'base64');
    const parsedSignature = AsnParser.parse(derSignature, ECDSASigValue);
    let rBytes = new Uint8Array(parsedSignature.r);
    let sBytes = new Uint8Array(parsedSignature.s);
    if (rBytes.length === 33 && rBytes[0] === 0) {
      rBytes = rBytes.slice(1);
    }
    if (sBytes.length === 33 && sBytes[0] === 0) {
      sBytes = sBytes.slice(1);
    }
    const r = BigInt('0x' + Buffer.from(rBytes).toString('hex')).toString(16);
    const s = BigInt('0x' + Buffer.from(sBytes).toString('hex')).toString(16);

    return {
      r,
      s,
    };
  };

  const getCoordinates = async (credentialPublicKey: string) => {
    const publicKeyBinary = Uint8Array.from(atob(credentialPublicKey.replace(/\-/g, '+').replace(/_/g, '/')), (c) =>
      c.charCodeAt(0),
    );
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
    const Qx = base64ToBigInt(jwk.x.replace(/\-/g, '+').replace(/_/g, '/'));
    const Qy = base64ToBigInt(jwk.y.replace(/\-/g, '+').replace(/_/g, '/'));
    return {
      x: `0x${Qx.toString(16)}`,
      y: `0x${Qy.toString(16)}`,
    };
  };

  const register = async () => {
    // get total registered nums and generate name
    const randomChallenge = btoa('1234567890');
    const credentialName = `Passkey ${credentials.length + 1}`;
    const registration = await client.register(credentialName, randomChallenge);
    console.log('Registered: ', JSON.stringify(registration, null, 2));

    // verify locally
    // const registrationParsed = await server.verifyRegistration(registration, {
    //     challenge: randomChallenge,
    //     origin: window.origin,
    // });
    // console.log('Parsed Registration: ', JSON.stringify(registrationParsed, null, 2));

    const coords = await getCoordinates(registration.credential.publicKey);

    const credentialKey = {
      id: registration.credential.id,
      publicKey: registration.credential.publicKey,
      algorithm: 'ES256',
      name: credentialName,
      coords,
    };

    addCredential(credentialKey);
  };

  const sign = async (credential: any, challenge: string) => {
    console.log('Authenticating...');
    let authentication = await client.authenticate([credential.id], challenge, {
      userVerification: 'required',
    });
    const authenticatorData = `0x${base64ToBigInt(
      authentication.authenticatorData.replace(/\-/g, '+').replace(/_/g, '/'),
    ).toString(16)}`;
    const clientData = JSON.parse(atob(authentication.clientData.replace(/\-/g, '+').replace(/_/g, '/')));
      console.log('decoded clientData',  clientData);
      const clientDataSuffix = JSON.stringify({
        origin: clientData.origin,
        crossOrigin: false,
      })
    const signature = authentication.signature.replace(/\-/g, '+').replace(/_/g, '/');
    console.log(`signature: ${signature}`);
    const { r, s } = decodeDER(signature);
    const { x, y } = credential.coords;

    /*
        authenticatorData
        clientData
        credentialId
        signature
    */
    // const authenticationParsed = await server.verifyAuthentication(authentication, credentialKey, expected);
    // console.log(JSON.stringify(authenticationParsed, null, 2));

    return {
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

  return {
    decodeDER,
    register,
    sign,
  };
}
