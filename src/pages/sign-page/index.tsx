import React, { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box } from "@chakra-ui/react";
import { getMessageType } from "@/lib/tools";
import useKeyring from "@/hooks/useKeyring";
import { useToast } from "@chakra-ui/react";
import { useParams }  from 'react-router-dom'
// import { useSearchParams } from "react-router-dom";
import SignModal from "@/components/SignModal";
import useWallet from "@/hooks/useWallet";
import useBrowser from "@/hooks/useBrowser";
import { useAddressStore } from "@/store/address";
import { useChainStore } from "@/store/chain";

export default function SignPage() {
  const params = useParams();
  const param = params.query;
  // const params = useSearchParams();
  const [searchParams, setSearchParams] = useState<any>({});
  const { selectedAddress, toggleAllowedOrigin } = useAddressStore();
  const { setSelectedChainId } = useChainStore();
  const toast = useToast();
  const { signAndSend } = useWallet();
  const { navigate } = useBrowser();
  const signModal = createRef<any>();
  const keyring = useKeyring();

  console.log("sign page triggered", searchParams);

  useEffect(() => {
    setSearchParams({
      actionType: param.action,
      tabId: param.tabId,
      origin: param.origin,
      txns: param.txns,
      data: param.data,
      sendTo: param.sendTo,
      id: param.id,
      targetChainId: param.targetChainId,
    });
  }, [param]);

  /**
   * Determine what data user want
   */
  const determineAction = async () => {
        const { actionType, origin, tabId, data, sendTo, id, targetChainId, } = searchParams;

        const currentSignModal = signModal.current;

        if (!currentSignModal) {
            console.log("no modal detected");
            return;
        }

        try {
            // TODO, 1. need to check if account is locked.
            if (actionType === "getAccounts") {
                await currentSignModal.show({ txns: "", actionType, origin, keepVisible: false });
                toggleAllowedOrigin(selectedAddress, origin, true);
                console.log("getAccounts params", { id, isResponse: true, data: selectedAddress, tabId });
                // await browser.tabs.sendMessage(Number(tabId), {
                //     id,
                //     isResponse: true,
                //     data: selectedAddress,
                //     tabId,
                // });
                window.close();
            }  if (actionType === "switchChain") {
                await currentSignModal.show({ txns: "", actionType, origin, keepVisible: false, targetChainId  });
                setSelectedChainId(targetChainId);
                // await browser.tabs.sendMessage(Number(tabId), {
                //     id,
                //     isResponse: true,
                //     data: targetChainId,
                //     tabId,
                // });
                window.close();
            }else if (actionType === "approve") {
                // IMPORTANT TODO, move to signModal
                // const userOp = formatOperation();
                const { txns } = searchParams;

                const { userOp, payToken } = await currentSignModal.show({
                    txns,
                    actionType,
                    origin,
                    keepVisible: tabId ? false : true,
                    sendTo,
                });

                // if from dapp, return trsanction result
                if (tabId) {
                    await signAndSend(userOp, payToken, tabId, false);
                    window.close();
                } else {
                    await signAndSend(userOp, payToken, tabId, false);
                    toast({
                        title: "Transaction sent.",
                        status: "info",
                    });
                    navigate("wallet");
                }
            } else if (actionType === "signMessage") {
                const msgToSign = getMessageType(data) === "hash" ? data : ethers.toUtf8String(data);

                await currentSignModal.show({
                    txns: "",
                    actionType,
                    origin,
                    keepVisible: tabId ? false : true,
                    msgToSign,
                });

                const signature = await keyring.signMessage(msgToSign);

                // await browser.tabs.sendMessage(Number(tabId), {
                //     id,
                //     isResponse: true,
                //     // action: "signMessage",
                //     data: signature,
                //     tabId,
                // });

                window.close();
            } else if (actionType === "signMessageV4") {
                const parsedData = JSON.parse(data);

                await currentSignModal.show({
                    txns: "",
                    actionType,
                    origin,
                    keepVisible: tabId ? false : true,
                    msgToSign: data,
                });

                const signature = await keyring.signMessageV4(parsedData);

                console.log("v4 signature", signature);

                // await browser.tabs.sendMessage(Number(tabId), {
                //     id,
                //     isResponse: true,
                //     // action: "signMessageV4",
                //     data: signature,
                //     tabId,
                // });

                window.close();
            }
        } catch (err) {
            console.log(err);
        } finally {
            // if (tabId) {
            //     window.close();
            // } else {
            //     navigate("wallet");
            // }
        }
    };

    useEffect(() => {
        const current = signModal.current;
        if (!searchParams.actionType || !current || !selectedAddress) {
            return;
        }
        console.log("changed", searchParams.actionType, current);
        determineAction();
    }, [searchParams.actionType, signModal.current, selectedAddress]);

    return (
        <Box>
            {/* <img src={LogoLoading} /> */}
            <SignModal ref={signModal} />
        </Box>
    );
}
