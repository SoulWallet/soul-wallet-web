import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { useToast, Text, Image, Box } from '@chakra-ui/react';
import Button from '../Button';
import TxModal from '../TxModal';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import IconDollar from '@/assets/icons/dollar-white.svg';
import { useSlotStore } from '@/store/slot';
import { useSettingStore } from '@/store/setting';

const ClaimAssetsModal = (_: unknown, ref: Ref<any>) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [claimableCount, setClaimableCount] = useState(0);
  const { slotInfo } = useSlotStore();
  const [visible, setVisible] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const { selectedAddress} = useAddressStore();
  const { setFinishedSteps } = useSettingStore();
  const { selectedChainId } = useChainStore();

  useImperativeHandle(ref, () => ({
    async show() {
      setVisible(true);
      checkClaimable();
      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));

  const checkClaimable = async () => {
    try {
      const res: any = await api.operation.requestTestToken({
        address: selectedAddress,
        chainID: selectedChainId,
        dryRun: true,
      });
      if (res.code === 200) {
        setClaimableCount(res.data.remaining);
      }
    } catch (err) {
      setClaimableCount(0);
    }
  };

  const doClaim = async () => {
    setLoading(true);
    try {
      const res: any = await api.operation.requestTestToken({
        address: selectedAddress,
        chainID: selectedChainId,
      });
      if (res.code === 200) {
        toast({
          title: 'Claimed',
          status: 'success',
        });
        const res = await api.operation.finishStep({
          slot: slotInfo.slot,
          steps: [0],
        });

        setFinishedSteps(res.data.finishedSteps);
        setVisible(false);
      } else {
        toast({
          title: res.msg,
          status: 'error',
        });
      }
      console.log('claim result', res);
    } catch (err) {
      toast({
        title: 'Reached claim limit',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const onClose = async () => {
    setVisible(false);
    setLoading(false);
    promiseInfo.reject('User close');
  };

  return (
    <div ref={ref}>
      <TxModal
        visible={visible}
        width={{ base: '90%', lg: '360px' }}
        onClose={onClose}
        bodyStyle={{ py: '9', px: '6' }}
        title="Claim test token"
      >
        <Box textAlign="center">
          <Text fontSize={'16px'} fontWeight={'600'} color="#000">
            Each wallet address can claim test tokens
            <br /> (0.002 ETH and 10 USDC) twice per day.
          </Text>
          <Button
            loading={loading}
            disabled={!claimableCount}
            mt="6"
            mx="auto"
            py="3"
            px="4"
            onClick={doClaim}
            gap="2"
            display={'flex'}
          >
            <Image src={IconDollar} />
            <Text fontSize={'18px'} fontWeight={'800'} color="#fff">
              Claim
            </Text>
          </Button>
        </Box>
      </TxModal>
    </div>
  );
};

export default forwardRef(ClaimAssetsModal);
