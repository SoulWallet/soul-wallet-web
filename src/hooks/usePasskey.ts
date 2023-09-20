import { client, server } from '@passwordless-id/webauthn';
import { ECDSASigValue } from "@peculiar/asn1-ecc";
import { AsnParser } from "@peculiar/asn1-schema";

export default function usePasskey() {
  const decodeDER = (signature: string) => {
    const derSignature = Buffer.from(signature, "base64");
    const parsedSignature = AsnParser.parse(derSignature, ECDSASigValue);
    let rBytes = new Uint8Array(parsedSignature.r);
    let sBytes = new Uint8Array(parsedSignature.s);
    if (rBytes.length === 33 && rBytes[0] === 0) {
      rBytes = rBytes.slice(1);
    }
    if (sBytes.length === 33 && sBytes[0] === 0) {
      sBytes = sBytes.slice(1);
    }
    const r = BigInt("0x" + Buffer.from(rBytes).toString("hex")).toString(16);
    const s = BigInt("0x" + Buffer.from(sBytes).toString("hex")).toString(16);

    return {
      r,
      s,
    };
  };
  const register = async() => {
    // get total registered nums and generate name
    const randomChallenge = 'randomChallenge';
    const registration = await client.register('Passkey', randomChallenge);
    console.log('Registered: ', JSON.stringify(registration, null, 2));

    const credentialKey = {
        id: registration.credential.id,
        publicKey: registration.credential.publicKey,
        algorithm: 'ES256'
    }

    // verify locally
    const registrationParsed = await server.verifyRegistration(registration, {
        challenge: randomChallenge,
        origin: window.origin,
    });
    console.log('Parsed Registration: ', JSON.stringify(registrationParsed, null, 2));
  };

  const sign = () => {};

  return {
    decodeDER,
    register,
    sign,
  };
}
