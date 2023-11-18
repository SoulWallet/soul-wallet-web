import { Flex, Box, Text, useToast, Image, Divider } from '@chakra-ui/react';
import GasSelect from '../../SendAssets/comp/GasSelect';
import IconCopy from '@/assets/copy.svg';
import Button from '../../Button';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import BN from 'bignumber.js';
import { toShortAddress } from '@/lib/tools';
import useConfig from '@/hooks/useConfig';
import { useState, useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import { decodeCalldata } from '@/lib/tools';
import { useChainStore } from '@/store/chain';
import IconLoading from '@/assets/loading.svg';
import api from '@/lib/api';
import { ethers } from 'ethers';
import { useBalanceStore } from '@/store/balance';
import { UserOpUtils, UserOperation } from '@soulwallet/sdk';
import useTransaction from '@/hooks/useTransaction';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';
import { useAddressStore, getIndexByAddress } from '@/store/address';
import useTools from '@/hooks/useTools';
import { useGuardianStore } from '@/store/guardian';
import { bundlerErrMapping } from '@/config';

export default function SignTransaction({ onSuccess, txns, sendToAddress }: any) {
  const toast = useToast();
  const [loadingFee, setLoadingFee] = useState(true);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [decodedData, setDecodedData] = useState<any>({});
  const [signing, setSigning] = useState<boolean>(false);
  const { checkActivated, ethersProvider } = useWalletContext();
  const { getTokenBalance } = useBalanceStore();
  const [prechecked, setPrechecked] = useState(false);
  const [totalMsgValue, setTotalMsgValue] = useState('');
  // const [prefundCalculated, setPrefundCalculated] = useState(false);
  // TODO, remember user's last select
  const [payToken, setPayToken] = useState(ethers.ZeroAddress);
  const [payTokenSymbol, setPayTokenSymbol] = useState('');
  const [feeCost, setFeeCost] = useState('');
  const [activeOperation, setActiveOperation] = useState<UserOperation>();
  const [sponsor, setSponsor] = useState<any>(null);
  const { selectedChainId } = useChainStore();
  const { toggleActivatedChain, addressList, selectedAddress, setFinishedSteps } = useAddressStore();
  const { slotInfo } = useGuardianStore();
  // const [targetChainId, setTargetChainId] = useState('');
  const { getPrefund } = useQuery();
  const { chainConfig, selectedAddressItem, selectedChainItem } = useConfig();
  const { signAndSend, getActivateOp } = useWallet();
  const { getUserOp } = useTransaction();
  const { doCopy } = useTools();
  const selectedToken = getTokenBalance(payToken);
  const [hintText, setHintText] = useState('');
  const selectedTokenBalance = BN(selectedToken.tokenBalance).shiftedBy(-selectedToken.decimals).toFixed();
  const origin = document.referrer;

  const checkSponser = async (userOp: UserOperation) => {
    const res = await api.sponsor.check(
      selectedChainId,
      chainConfig.contracts.entryPoint,
      UserOpUtils.userOperationFromJSON(UserOpUtils.userOperationToJSON(userOp)),
    );
    if (res.data.sponsorInfos && res.data.sponsorInfos.length > 0) {
      // TODO, check >1 sponsor
      setSponsor(res.data.sponsorInfos[0]);
    }
  };

  const clearState = () => {
    // setOrigin('');
    setPromiseInfo({});
    setDecodedData({});
    setLoadingFee(true);
    setSigning(false);
    // setPrefundCalculated(false);
    setPayToken(ethers.ZeroAddress);
    setPayTokenSymbol('');
    setFeeCost('');
    setActiveOperation(undefined);
    setSponsor(null);
    // setSendToAddress('');
  };

  const onConfirm = async () => {
    try {
      setSigning(true);

      let userOp: any;
      if (sponsor && sponsor.paymasterAndData) {
        userOp = { ...activeOperation, paymasterAndData: sponsor.paymasterAndData };
      } else {
        userOp = activeOperation;
      }

      const receipt = await signAndSend(userOp, payToken);

      // IMPORTANT TODO, get these params from receipt
      // if first tx is completed, then it's activated
      if (!checkActivated()) {
        toggleActivatedChain(userOp.sender, selectedChainId);
      }

      toast({
        title: 'Transaction success.',
        status: 'success',
      });

      onSuccess(receipt);

      markupStep();

      clearState();
    } catch (err) {
      console.log('sign page failed', err);
      toast({
        title: 'Transaction failed.',
        status: 'error',
      });
    } finally {
      setSigning(false);
    }
  };

  const markupStep = async () => {
    const safeUrl = location.href;

    let steps: number[] = [];

    if (safeUrl.includes('app.uniswap.org')) {
      steps = [3];
    }
    if (safeUrl.includes('staging.aave.com')) {
      steps = [4];
    }

    if (steps.length > 0) {
      const res = await api.operation.finishStep({
        slot: slotInfo.slot,
        steps,
      });

      setFinishedSteps(res.data.finishedSteps);
    }
  };

  const getFinalPrefund = async (userOp: any, payTokenAddress:string) => {
    setLoadingFee(true);
    console.log('get final prefund payToken', payTokenAddress);
    // TODO, extract this for other functions
    const { requiredAmount } = await getPrefund(userOp, payTokenAddress);

    if (ethers.ZeroAddress === payTokenAddress) {
      setFeeCost(`${requiredAmount} ${chainConfig.chainToken}`);
    } else {
      setFeeCost(`${requiredAmount} USDC`);
    }
    setLoadingFee(false);
  };

  const getFinalUserOp = async (txns: any, payTokenAddress: string) => {
    const isActivated = await checkActivated();
    if (isActivated) {
      // if activated, get userOp directly
      return await getUserOp(txns, payTokenAddress);
    } else {
      const activateIndex = getIndexByAddress(addressList, selectedAddress);
      console.log('activate index', activateIndex, addressList, selectedAddress, txns);
      // if not activated, prepend activate txns
      return await getActivateOp(activateIndex, payToken, txns);
    }
  };

  const doPrecheck = async (payTokenAddress: string) => {
    if (prechecked) {
      return;
    }
    console.log('trigger pre check', payTokenAddress)
    try {
      setPrechecked(true);
      setLoadingFee(true);
      setFeeCost('...');
      setTotalMsgValue(
        txns
          .reduce((total: any, current: any) => total.plus(current.value || 0), BN(0))
          .shiftedBy(-18)
          .toFixed(),
      );
      setPayTokenSymbol(getTokenBalance(payTokenAddress).symbol || 'Unknown');

      let userOp = await getFinalUserOp(txns, payTokenAddress);
      setActiveOperation(userOp);
      const callDataDecodes = await decodeCalldata(
        selectedChainId,
        chainConfig.contracts.entryPoint,
        userOp,
        ethersProvider,
      );
      console.log('decoded data', callDataDecodes);
      setDecodedData(callDataDecodes);
      // checkSponser(userOp);
      getFinalPrefund(userOp, payTokenAddress);
      if (payTokenAddress === ethers.ZeroAddress) {
        // ETH is not enough
        if (BN(totalMsgValue).isGreaterThanOrEqualTo(selectedTokenBalance)) {
          console.log('Balance not enough!');
        }
      } else {
        // ERC20 is not enough
        // TODO, check erc20 send amount in user op
      }
    } catch (err: any) {
      const errMessage: any = err.message;
      const descMessage = bundlerErrMapping[errMessage];
      setHintText(`${errMessage}${descMessage ? ', ' + descMessage : ''}`);
      toast({
        title: errMessage,
        description: descMessage,
        status: 'error',
        duration: 5000,
      });
      // setHintText(err);
    } finally {
      // setLoadingFee(false);
    }
  };

  // useEffect(() => {
  //   setPrechecked(false);
  // }, [payToken]);

  const onPayTokenChange = (val:string) => {
    console.log('onPayTokenChange', val);
    setPrechecked(false);
    setPayToken(val);
    doPrecheck(val);
  }

  // IMPORTANT IMPORTANT TODO, rendered twice
  useEffect(() => {
    if (!txns || !txns.length || !payToken) {
      return;
    }
    console.log('do pre check', txns, payToken);
    doPrecheck(payToken);
  }, [txns, payToken]);

  return (
    <>
      <Flex flexDir={'column'} gap="5" mt="8">
        <Flex flexDir={'column'} align={'center'} fontWeight={'800'} lineHeight={'1'}>
          {decodedData && (
            <Box mb="18px" fontSize={'12px'} fontFamily={'Martian'}>
              {decodedData.length === 1
                ? decodedData.map((item: any, index: number) => (
                    <Text my="2" textTransform="capitalize" key={index}>
                      {item.functionName ? item.functionName : item.method ? item.method.name : 'Unknown'}
                      {item.sendErc20Amount && ` ${item.sendErc20Amount}`}
                    </Text>
                  ))
                : decodedData.length > 1
                ? 'Batch transaction'
                : 'Send transaction'}
            </Box>
          )}
          {totalMsgValue && Number(totalMsgValue) > 0 && (
            <>
              <Text fontSize={'32px'} mb="3" color="#000">
                {totalMsgValue} ETH
              </Text>
              {/** TODO, change to real price */}
              <Text color="brand.gray">${BN(totalMsgValue).times(1900).toFormat()}</Text>
            </>
          )}
        </Flex>

        <Divider borderColor={'#d7d7d7'} />

        {decodedData && decodedData.length > 1 && (
          <>
            <InfoWrap color="#646464" fontSize="12px" gap="3">
              {decodedData.map((item: any, idx: number) => (
                <InfoItem key={idx}>
                  <Text>
                    {item.functionName ? item.functionName : item.method ? item.method.name : 'Unknown'}{' '}
                    {item.sendErc20Amount && ` ${item.sendErc20Amount}`}
                  </Text>
                  {/** todo, change to send address **/}
                  {item.to && (
                    <Flex align={'center'} gap="1">
                      <Text>{toShortAddress(item.to)}</Text>
                      <Image src={IconCopy} onClick={() => doCopy(item.to)} cursor={'pointer'} opacity={0.5} />
                    </Flex>
                  )}
                </InfoItem>
              ))}
            </InfoWrap>
            <Divider borderColor={'#d7d7d7'} mb="3" />
          </>
        )}

        <>
          <InfoWrap color="#646464" fontSize="12px">
            {sendToAddress && (
              <InfoItem>
                <Text>Send to</Text>
                <Text>{sendToAddress}</Text>
              </InfoItem>
            )}
            <InfoItem>
              <Text>From</Text>
              <Text>
                {selectedAddressItem.title}({toShortAddress(selectedAddress)})
              </Text>
            </InfoItem>
            <InfoItem>
              <Text>Network</Text>
              <Text>{selectedChainItem.chainName}</Text>
            </InfoItem>
            <InfoItem align={sponsor && 'flex-start'}>
              <Text>Gas fee</Text>
              {sponsor ? (
                <Box textAlign={'right'}>
                  <Flex mb="1" gap="4" justify={'flex-end'}>
                    {feeCost && feeCost !== '...' && (
                      <Text textDecoration={'line-through'}>
                        {BN(feeCost.split(' ')[0]).toFixed(6) || '0'} {payTokenSymbol}
                      </Text>
                    )}
                    <Text>0 ETH</Text>
                  </Flex>
                  <Text color="#898989">Sponsored by {sponsor.sponsorParty || 'Soul Wallet'}</Text>
                </Box>
              ) : (
                <Flex gap="2">
                  {feeCost === '...' ? <Image src={IconLoading} /> : <Text>{feeCost.split(' ')[0]}</Text>}
                  <GasSelect gasToken={payToken} onChange={(val:string) => onPayTokenChange(val)} />
                </Flex>
              )}
            </InfoItem>
            <InfoItem color="#000" fontWeight="600">
              <Text>Total</Text>
              {totalMsgValue && Number(totalMsgValue) ? `${totalMsgValue} ETH` : ''}
              {totalMsgValue && Number(totalMsgValue) && !sponsor && feeCost !== '...' ? ' + ' : ''}
              {!sponsor && feeCost !== '...' ? `${BN(feeCost.split(' ')[0]).toFixed(6) || '0'} ${payTokenSymbol}` : ''}
              {!sponsor &&
              feeCost !== '...' &&
              decodedData &&
              decodedData.length > 0 &&
              decodedData.filter((item: any) => item.sendErc20Amount).length > 0
                ? ' + '
                : ''}
              {decodedData &&
                decodedData.length > 0 &&
                decodedData
                  .filter((item: any) => item.sendErc20Amount)
                  .map((item: any) => item.sendErc20Amount)
                  .join(' + ')}
            </InfoItem>
            {hintText && (
              <InfoItem>
                <Text color="#f00">{hintText}</Text>
              </InfoItem>
            )}
          </InfoWrap>
        </>
      </Flex>
      <Button
        w="320px"
        display={'flex'}
        gap="2"
        fontSize={'20px'}
        py="4"
        fontWeight={'800'}
        mt="12"
        mx="auto"
        onClick={onConfirm}
        loading={signing}
        disabled={loadingFee && !sponsor}
        bg="#6A52EF"
        color="white"
        _hover={{ bg: '#6A52EF', color: 'white' }}
        checkCanSign
      >
        Confirm
      </Button>
    </>
  );
}
