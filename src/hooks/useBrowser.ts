import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function useBrowser() {
  const navigateTo = useNavigate();

  /*
   * add version prefix and do some check
   * @param route
   */
  const navigate = async (route: any, options?: any) => {
    navigateTo(route, options);
  };

  const navigateToSign = async ({ txns, sendTo }: any) => {
    navigate(`/sign?action=approve&txns=${JSON.stringify(txns)}&sendTo=${sendTo}`);
  };

  const getConnectedDapp = async () => {
    // const tabs = await browser.tabs.query({
    //     active: true,
    //     currentWindow: true,
    // });
    // return tabs[0].url;
  };


  return {
    navigate,
    navigateToSign,
    getConnectedDapp,
  };
}
