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
    console.log(`Qx: 0x${Qx.toString(16)}`);
    console.log(`Qy: 0x${Qy.toString(16)}`);
    return {
      Qx,
      Qy,
    };
  };

  const register = async () => {
    // get total registered nums and generate name
    const randomChallenge = btoa('1234567890');
    const credentialName = `Passkey ${credentials.length + 1}`;
    const registration = await client.register(credentialName, randomChallenge);
    console.log('Registered: ', JSON.stringify(registration, null, 2));

    const credentialKey = {
      id: registration.credential.id,
      publicKey: registration.credential.publicKey,
      algorithm: 'ES256',
      name: credentialName,
    };

    addCredential(credentialKey);
    // verify locally
    // const registrationParsed = await server.verifyRegistration(registration, {
    //     challenge: randomChallenge,
    //     origin: window.origin,
    // });
    // console.log('Parsed Registration: ', JSON.stringify(registrationParsed, null, 2));

    const coords = await getCoordinates(credentialKey.publicKey);

    console.log('coords', coords);
  };

  const authenticate = async (credentialId: string, challenge: string) => {
    const authentication = await client.authenticate([credentialId], challenge);
    console.log('authentication: ', authentication);
  };

  return {
    decodeDER,
    register,
    authenticate,
  };
}
