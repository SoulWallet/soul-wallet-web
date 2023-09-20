import { openWindow } from "@/lib/tools";
// import { useNavigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

export default function useBrowser() {
    const navigateTo = useNavigate();

    /**
     * add version prefix and do some check
     * @param route
     */
    const navigate = async (route: string) => {
        navigateTo(`/${route}`);
    };

    const navigateToSign = async ({ txns, sendTo }: any) => {
        navigate(`sign?action=approve&txns=${JSON.stringify(txns)}&sendTo=${sendTo}`);
    };

    const getConnectedDapp = async () => {
        // const tabs = await browser.tabs.query({
        //     active: true,
        //     currentWindow: true,
        // });
        // return tabs[0].url;
    };

    const closeCurrentTab = async () => {
        // browser.tabs.getCurrent().then((tab) => {
        //     tab.id && browser.tabs.remove(tab.id);
        // });
    };

    return {
        navigate,
        navigateToSign,
        closeCurrentTab,
        getConnectedDapp,
    };
}
