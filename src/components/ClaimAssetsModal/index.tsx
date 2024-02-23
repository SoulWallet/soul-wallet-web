import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { useToast, Text, Image, Box } from '@chakra-ui/react';
import Button from '../Button';
import TxModal from '../TxModal';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { useSlotStore } from '@/store/slot';
import IconClaimable from '@/assets/icons/claimable.svg';
import IconUnclaimable from '@/assets/icons/unclaimable.svg';
import { useSettingStore } from '@/store/setting';

const ClaimAssetsModal = (_: unknown, ref: Ref<any>) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [claimableCount, setClaimableCount] = useState(0);
  const [checkedClaimable, setCheckedClaimable] = useState(false);
  const { slotInfo } = useSlotStore();
  const [visible, setVisible] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const { selectedAddress } = useAddressStore();
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
    } finally {
      setCheckedClaimable(true);
    }
  };

  const doClaim = async () => {
    setLoading(true);
    try {
      const res: any = await api.operation.requestTestToken({
        address: selectedAddress,
        chainID: selectedChainId,
      });
      console.log('claim result', res);
      if (res.code === 200) {
        toast({
          title: 'Test token claimed successfully',
          status: 'success',
        });

        try {
          if (slotInfo.slot) {
            const res = await api.operation.finishStep({
              slot: slotInfo.slot,
              steps: [0],
            });

            setFinishedSteps(res.data.finishedSteps);
          }
        } catch (err) {
          console.log('finish step error', err);
        }
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
        title: 'Claim limit has been reached',
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
        width={{ base: '90%', lg: '404px' }}
        onClose={onClose}
        bodyStyle={{ py: '9', px: '42px' }}
      >
        <Box textAlign="center">
          <Image src={claimableCount || !checkedClaimable ? IconClaimable : IconUnclaimable} mx="auto" mb="18px" />
          {/* <Box mx={'auto'} bg="#efefef" h="64px" w="64px" mb="18px" rounded="full" /> */}
          <Text fontSize={'20px'} mb="2" fontWeight={'800'} lineHeight={'1.6'} letterSpacing={'-0.4px'}>
            {claimableCount || !checkedClaimable ? 'Claim test tokens' : 'Claim limit has been reached'}
          </Text>
          <Text fontSize={'14px'} fontWeight={'600'} mb="18px">
            Each wallet address can claim test tokens
            <br /> (0.002 ETH) twice per day.
          </Text>
          <Button
            loading={loading}
            disabled={!claimableCount}
            py="16px"
            onClick={doClaim}
            fontSize={'18px'}
            lineHeight={'1'}
            fontWeight={'700'}
            color="#fff"
            gap="2"
            mb="6"
            w="100%"
          >
            Claim
          </Button>
          <Text fontSize={'18px'} onClick={onClose} cursor={'pointer'} fontWeight={'700'}>
            Cancel
          </Text>
        </Box>
      </TxModal>
    </div>
  );
};

export default forwardRef(ClaimAssetsModal);
