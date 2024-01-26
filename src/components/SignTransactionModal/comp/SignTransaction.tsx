import { Flex, Box, Text, useToast, Image, Divider, Tooltip } from '@chakra-ui/react';
import GasSelect from '../../SendAssets/comp/GasSelect';
import IconCopy from '@/assets/copy.svg';
import Button from '../../Button';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import BN from 'bignumber.js';
import { toShortAddress } from '@/lib/tools';
import useConfig from '@/hooks/useConfig';
import { useState, useEffect } from 'react';
import IconArrowDown from '@/assets/icons/arrow-down.svg';
import IconChevronDown from '@/assets/icons/chevron-down-gray.svg';
import IconQuestion from '@/assets/icons/question.svg';
import useQuery from '@/hooks/useQuery';
import { decodeCalldata } from '@/lib/tools';
import { useChainStore } from '@/store/chain';
import IconLoading from '@/assets/loading.svg';
import api from '@/lib/api';
import { ethers } from 'ethers';
import { useBalanceStore } from '@/store/balance';
import { UserOpUtils, UserOperation } from '@soulwallet_test/sdk';
import useTransaction from '@/hooks/useTransaction';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';
import { useAddressStore, getIndexByAddress } from '@/store/address';
import IconChecked from '@/assets/icons/checked-green.svg';
import { useSettingStore } from '@/store/setting';
import useTools from '@/hooks/useTools';
import { useSlotStore } from '@/store/slot';
import { bundlerErrMapping } from '@/config';

export default function SignTransaction({ onSuccess, txns, sendToAddress }: any) {
  const toast = useToast();
  const [loadingFee, setLoadingFee] = useState(true);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [decodedData, setDecodedData] = useState<any>({});
  const [signing, setSigning] = useState<boolean>(false);
  const { checkActivated, ethersProvider } = useWalletContext();
  const { getTokenBalance } = useBalanceStore();
  const { getAddressName } = useSettingStore();
  const [prechecked, setPrechecked] = useState(false);
  const [totalMsgValue, setTotalMsgValue] = useState('');
  // const [prefundCalculated, setPrefundCalculated] = useState(false);
  // TODO, remember user's last select
  const [payToken, setPayToken] = useState(ethers.ZeroAddress);
  const [payTokenSymbol, setPayTokenSymbol] = useState('');
  // const [feeCost, setFeeCost] = useState('');
  const [balanceEnough, setBalanceEnough] = useState(true);
  const [requiredAmount, setRequiredAmount] = useState('');
  const [activeOperation, setActiveOperation] = useState<UserOperation>();
  const [sponsor, setSponsor] = useState<any>(null);
  const { selectedChainId } = useChainStore();
  const { toggleActivatedChain, addressList, selectedAddress } = useAddressStore();
  const { setFinishedSteps } = useSettingStore();
  const { slotInfo } = useSlotStore();
  // todo, set false as default
  const [useSponsor, setUseSponsor] = useState(true);
  const { getPrefund } = useQuery();
  const { chainConfig, selectedAddressItem, selectedChainItem } = useConfig();
  const { signAndSend, getActivateOp } = useWallet();
  const { getUserOp } = useTransaction();
  const selectedToken = getTokenBalance(payToken);
  const [hintText, setHintText] = useState('');
  const selectedTokenBalance = BN(selectedToken.tokenBalance).shiftedBy(-selectedToken.decimals).toFixed();
  const origin = document.referrer;
  const [showMore, setShowMore] = useState(false);

  const checkSponser = async (userOp: UserOperation) => {
    try {
      const res = await api.sponsor.check(
        selectedChainId,
        chainConfig.contracts.entryPoint,
        UserOpUtils.userOperationFromJSON(UserOpUtils.userOperationToJSON(userOp)),
      );
      if (res.data.sponsorInfos && res.data.sponsorInfos.length > 0) {
        // TODO, check >1 sponsor
        setSponsor(res.data.sponsorInfos[0]);
      }
    } catch (err) {
      setUseSponsor(false);
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
    // setFeeCost('');
    setRequiredAmount('');
    setActiveOperation(undefined);
    setSponsor(null);
    setUseSponsor(true);
    // setSendToAddress('');
  };

  const onConfirm = async () => {
    try {
      setSigning(true);

      let userOp: any;
      if (sponsor && useSponsor && sponsor.paymasterAndData) {
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

  const getFinalPrefund = async (userOp: any, payTokenAddress: string) => {
    setLoadingFee(true);
    console.log('get final prefund payToken', payTokenAddress);
    // TODO, extract this for other functions
    const { requiredAmount } = await getPrefund(userOp, payTokenAddress);

    setRequiredAmount(requiredAmount);

    // if (ethers.ZeroAddress === payTokenAddress) {
    //   setFeeCost(`${requiredAmount} ${chainConfig.chainToken}`);
    // } else {
    //   setFeeCost(`${requiredAmount} USDC`);
    // }
    setLoadingFee(false);
  };

  const getFinalUserOp = async (txns: any, payTokenAddress: string) => {
    try {
      const isActivated = await checkActivated();
      console.log('is Activated?', isActivated);
      if (isActivated) {
        // if activated, get userOp directly
        return await getUserOp(txns, payTokenAddress);
      } else {
        // const activateIndex = getIndexByAddress(addressList, selectedAddress);
        // if not activated, prepend activate txns
        return await getActivateOp(0, payToken, txns);
      }
    } catch (err: any) {
      console.log('Get final userOp err:', err.message);
      throw new Error(err.message);
    }
  };

  const doPrecheck = async (payTokenAddress: string) => {
    if (prechecked) {
      return;
    }
    console.log('trigger pre check', payTokenAddress);
    try {
      setPrechecked(true);
      setLoadingFee(true);
      setRequiredAmount('');
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
      checkSponser(userOp);
      getFinalPrefund(userOp, payTokenAddress);
      if (payTokenAddress === ethers.ZeroAddress) {
        // ETH is not enough
        if (BN(totalMsgValue).isGreaterThanOrEqualTo(selectedTokenBalance)) {
          console.log('Not enough balance!');
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

  const onPayTokenChange = (val: string, isSponsor: boolean) => {
    setPrechecked(false);
    setPayToken(val);
    doPrecheck(val);
    setUseSponsor(isSponsor);
  };

  // IMPORTANT IMPORTANT TODO, rendered twice
  useEffect(() => {
    if (!txns || !txns.length || !payToken) {
      return;
    }
    console.log('do pre check', txns, payToken);
    doPrecheck(payToken);
  }, [txns, payToken]);

  useEffect(() => {
    if (!requiredAmount || !payToken) {
      return;
    }

    const token = getTokenBalance(payToken);

    if (payToken === ethers.ZeroAddress) {
      setBalanceEnough(BN(token.tokenBalanceFormatted).minus(totalMsgValue).isGreaterThanOrEqualTo(requiredAmount));
    } else {
      // todo, should minus sendErc20 token balance as well
      setBalanceEnough(BN(token.tokenBalanceFormatted).isGreaterThanOrEqualTo(requiredAmount));
    }
  }, [requiredAmount, payToken]);

  const LabelItem = ({ label, tooltip, chainVisible }: { label: string; tooltip?: string; chainVisible?: boolean }) => {
    return (
      <Flex gap="1">
        <Text>{label}</Text>
        {tooltip && (
          <Tooltip label={tooltip}>
            <Image src={IconQuestion} w="18px" h="18px" />
          </Tooltip>
        )}
        {chainVisible && (
          <>
            <Text>·</Text>
            <Box py="1" px="2" color="brand.black" rounded="full" lineHeight={'1'} bg="#f9f9f9">
              {selectedChainItem.chainName}
            </Box>
          </>
        )}
      </Flex>
    );
  };

  return (
    <>
      <Flex flexDir={'column'}>
        <Flex flexDir={'column'} align={'center'} lineHeight={'1'}>
          {decodedData && (
            <Flex flexDir={'column'} align={'center'} fontSize={'20px'} fontWeight={'800'}>
              {decodedData.length > 0
                ? decodedData.map((item: any, index: number) => (
                    <Tooltip label={item.to ? `To: ${item.to}` : null}>
                      <Text my="1" textTransform="capitalize" key={index}>
                        {item.functionName ? item.functionName : item.method ? item.method.name : 'Unknown'}
                        {item.sendErc20Amount && ` ${item.sendErc20Amount}`}
                      </Text>
                    </Tooltip>
                  ))
                : 'Send transaction'}
            </Flex>
          )}
          {totalMsgValue && Number(totalMsgValue) > 0 && (
            <>
              <Text mt="7" fontSize={{ base: '20px', md: '24px', lg: '30px' }} mb="3" fontWeight={'700'}>
                {totalMsgValue} ETH
              </Text>
              <Text fontWeight={'600'} mb="6">
                ≈${BN(totalMsgValue).times(1900).toFormat()}
              </Text>
            </>
          )}
        </Flex>
        <Image src={IconArrowDown} mb="1" w="8" mx="auto" />
        <Box mb="1" w="300px" mx="auto" textAlign={'center'}>
          <Box py="3" mb="2px" bg="#F9F9F9" roundedTop="20px" fontWeight={'700'}>
            {toShortAddress(sendToAddress)}
          </Box>
          <Box py="1" bg="#F9F9F9" color="#818181" fontSize={'14px'} roundedBottom={'20px'}>
            From {selectedChainItem.addressPrefix}
            {getAddressName(selectedAddress)}({toShortAddress(selectedAddress)})
          </Box>
        </Box>
        <Box textAlign={'center'} mb="9">
          <Tooltip
            color="brand.green"
            bg="#EFFFEE"
            label={
              <Flex gap="2" align={'center'}>
                <Image src={IconChecked} w="8" />
                <Text color="brand.green" fontSize={'14px'} fontWeight={'600'}>
                  Low risk: This dapp is listed by 3 and more communities.
                </Text>
              </Flex>
            }
          >
            <Flex
              cursor={'default'}
              gap="6px"
              align={'center'}
              bg="#EFFFEE"
              py="1"
              px="2"
              rounded="full"
              display={'inline-flex'}
            >
              <Image src={IconChecked} w="4" />
              <Text color="brand.green" fontSize={'14px'} fontWeight={'600'}>
                Low risk
              </Text>
            </Flex>
          </Tooltip>
        </Box>

        <Flex flexDir={'column'} gap="3">
          <Box>
            <Flex gap="6" align={'center'}>
              <Box w="100%" h="1px" bg="rgba(0, 0, 0, 0.10)" />
              <Flex
                gap="1"
                align={'center'}
                onClick={() => setShowMore((prev) => !prev)}
                cursor={'pointer'}
                whiteSpace={'nowrap'}
              >
                <Text userSelect={'none'} color="#818181" fontSize={'14px'}>
                  Show more
                </Text>
                <Image src={IconChevronDown} transform={showMore ? 'rotate(180deg)' : ''} />
              </Flex>
              <Box w="100%" h="1px" bg="rgba(0, 0, 0, 0.10)" />
            </Flex>
          </Box>

          {showMore && (
            <InfoWrap color="#818181" fontSize="14px">
              <InfoItem>
                <LabelItem label="Gas" tooltip={'123'} chainVisible={true} />

                <Flex gap="2" fontWeight={'500'}>
                  {requiredAmount ? (
                    <>
                      <Text>{requiredAmount}</Text>
                      <GasSelect
                        gasToken={payToken}
                        sponsor={sponsor}
                        useSponsor={useSponsor}
                        onChange={(val: string, isSponsor: boolean) => onPayTokenChange(val, isSponsor)}
                      />
                    </>
                  ) : (
                    <Image src={IconLoading} />
                  )}
                </Flex>
              </InfoItem>
              {useSponsor && requiredAmount && (
                <InfoItem>
                  <LabelItem label="Sponsor" tooltip={'123'} />
                  <Text color="brand.red">-{requiredAmount} ETH</Text>
                </InfoItem>
              )}

              <InfoItem color="#000" fontWeight="600">
                <Text>Total</Text>
                {totalMsgValue && Number(totalMsgValue) ? `${totalMsgValue} ETH` : ''}
                {totalMsgValue && Number(totalMsgValue) && !useSponsor && requiredAmount ? ' + ' : ''}
                {!useSponsor && requiredAmount ? `${BN(requiredAmount).toFixed(6) || '0'} ${payTokenSymbol}` : ''}
                {!useSponsor &&
                requiredAmount &&
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
              {!balanceEnough && !useSponsor && (
                <InfoItem>
                  <Text color="#f00">Not enough balance</Text>
                </InfoItem>
              )}
            </InfoWrap>
          )}
        </Flex>

        {/* {decodedData && decodedData.length > 1 && (
          <>
            <InfoWrap color="#646464" fontSize="12px" gap="3">
              {decodedData.map((item: any, idx: number) => (
                <InfoItem key={idx}>
                  <Text>
                    {item.functionName ? item.functionName : item.method ? item.method.name : 'Unknown'}{' '}
                    {item.sendErc20Amount && ` ${item.sendErc20Amount}`}
                  </Text>
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
        )} */}
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
        disabled={(loadingFee || !balanceEnough) && (!sponsor || !useSponsor)}
        checkCanSign
      >
        Confirm
      </Button>
    </>
  );
}
