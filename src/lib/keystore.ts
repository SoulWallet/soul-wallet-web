import { ethers } from "ethers";

export default class KeyStore {
    private static instance: KeyStore;

    private constructor() {}

    public static getInstance() {
        if (!KeyStore.instance) {
            KeyStore.instance = new KeyStore();
        }
        return KeyStore.instance;
    }

    private get keyStoreKey(): string {
        return "soul-wallet-keystore-key";
    }

    /**
     * get the EOA address
     * @returns EOA address, null is failed or no keystore
     */
    public async getAddress(): Promise<string> {
        const val = JSON.parse(localStorage.getItem(this.keyStoreKey) || '{}');
        if (val && val.address) {
            return ethers.getAddress(val.address);
        }
        return "";
    }

    /**
     * Get signer
     */
    public async getSigner(): Promise<ethers.Signer> {
        return new ethers.Wallet(localStorage.getItem('pk') || '')
    }

    /**
     * create a new keystore and delete the old
     * @param password
     * @returns EOA address, null is failed
     */
    public async createNewAddress(saveKey: boolean): Promise<string> {
        try {
            const account = ethers.Wallet.createRandom();
            // const Keystore = await account.encrypt(password);
            // IMPORTANT TODO, save to passkey later
            localStorage.setItem('pk', account.privateKey)

            // if (saveKey) {
            //     localStorage.setItem(this.keyStoreKey, Keystore);
            //     localStorage.setItem('password', password)
            // } else {
            //     localStorage.setItem("stagingAccount", account.address);
            //     localStorage.setItem("stagingKeystore", Keystore);
            //     localStorage.setItem("stagingPw", password);
            // }
            return account.address;
        } catch (error) {
            console.log("error", error);
            return "";
        }
    }

    public async replaceAddress(): Promise<void> {
        const stagingKeystore = localStorage.getItem("stagingKeystore");
        const stagingPw = localStorage.getItem("stagingPw");
        localStorage.removeItem("stagingAccount");
        localStorage.removeItem("recoverOpHash");
        localStorage.setItem(this.keyStoreKey, stagingKeystore || '');
    }

    public async delete(): Promise<void> {
        localStorage.clear();
    }

    /**
     * sign a hash
     * @param message
     * @returns signature, null is failed or keystore not unlocked
     */
    public async sign(hash: string): Promise<string | null> {
        // const messageHex = Buffer.from(ethers.utils.arrayify(message)).toString('hex');
        // const personalMessage = ethUtil.hashPersonalMessage(ethUtil.toBuffer(ethUtil.addHexPrefix(messageHex)));
        // var privateKey = Buffer.from(this._privateKey.substring(2), "hex");
        // const signature1 = ethUtil.ecsign(personalMessage, privateKey);
        // const sigHex = ethUtil.toRpcSig(signature1.v, signature1.r, signature1.s);
        const signer = await this.getSigner();

        return await signer.signMessage(ethers.getBytes(hash));
    }

    /**
     * sign a typed data
     * @param typedData
     * @returns signature, null is failed or keystore not unlocked
     */
    public async signMessageV4(typedData: any): Promise<string | null | undefined> {
    

        // IMPORTANT TODO, get from rpc provider
        const signer = await this.getSigner();

        const { domain, types, message } = typedData;

        return await signer.signTypedData(domain, types, message);

        // const typedMessageHash = ethers.TypedDataEncoder.hash(domain, types, message);

        // const signBuffer = TypedDataUtils.eip712Hash(typedData as any, "V4" as any);

        // console.log("sign buf", signBuffer);

        // return `0x${Buffer.from(signBuffer).toString("hex")}`;
    }
}
