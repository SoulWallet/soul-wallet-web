import { ethers } from 'ethers';
import storage from '@/lib/storage';

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
    return 'soul-wallet-keystore-key';
  }

  /**
   * get the EOA address
   * @returns EOA address, null is failed or no keystore
   */
  public async getAddress(): Promise<string> {
    const val = storage.getJson(this.keyStoreKey);
    if (val && val.address) {
      return ethers.getAddress(val.address);
    }
    return '';
  }

  /**
   * Get signer
   */
  public async getSigner(): Promise<ethers.Signer> {
    return new ethers.Wallet(storage.getItem('pk') || '');
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
      storage.setItem('pk', account.privateKey);

      // if (saveKey) {
      //     storage.setItem(this.keyStoreKey, Keystore);
      //     storage.setItem('password', password)
      // } else {
      //     storage.setItem("stagingAccount", account.address);
      //     storage.setItem("stagingKeystore", Keystore);
      //     storage.setItem("stagingPw", password);
      // }
      return account.address;
    } catch (error) {
      console.log('error', error);
      return '';
    }
  }

  public async replaceAddress(): Promise<void> {
    const stagingKeystore = storage.getItem('stagingKeystore');
    const stagingPw = storage.getItem('stagingPw');
    storage.removeItem('stagingAccount');
    storage.removeItem('recoverOpHash');
    storage.setItem(this.keyStoreKey, stagingKeystore || '');
  }

  public async delete(): Promise<void> {
    storage.clear();
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
