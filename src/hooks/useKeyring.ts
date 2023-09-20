import KeyStore from "@/lib/keystore";
const keyStore = KeyStore.getInstance();

export default function useKeyring() {
    return keyStore;
}
