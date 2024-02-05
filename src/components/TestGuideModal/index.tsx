import React, { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { Text, Image, Flex, Divider } from '@chakra-ui/react';
import Modal from '../Modal';
import IconChecked from '@/assets/icons/checked-green.svg';
import api from '@/lib/api';
import useTools from '@/hooks/useTools';
import { useSlotStore } from '@/store/slot';
import { guideList } from '@/data';
import { useSettingStore } from '@/store/setting';
import Button from '../Button';

const TestGuideModal = (_: unknown, ref: Ref<any>) => {
  const { slotInfo } = useSlotStore();
  const [visible, setVisible] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const { goGuideAction } = useTools();
  const { setFinishedSteps, finishedSteps } = useSettingStore();

  const getStepInfo = async () => {
    if (!slotInfo.slot) return;
    const res = await api.operation.finishStep({
      slot: slotInfo.slot,
      steps: [],
    });

    setFinishedSteps(res.data.finishedSteps);
  };

  useImperativeHandle(ref, () => ({
    async show() {
      setVisible(true);
      getStepInfo();
      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));

  const onClose = async () => {
    setVisible(false);
    promiseInfo.reject('User close');
  };

  return (
    <div ref={ref}>
      <Modal title="Check list for your test" visible={visible} width={{ lg: '500px' }} onClose={onClose}>
        <Flex flexDir="column">
          {guideList.map((item, idx: number) => (
            <React.Fragment key={idx}>
              <Flex pb="4" pt={idx ? 4 : 0} justify={'space-between'}>
                <Text fontWeight={'600'} fontSize={'16px'}>
                  {idx + 1}. {item.statusText}
                </Text>
                {finishedSteps.includes(idx) ? (
                  <Image src={IconChecked} w="5" />
                ) : (
                  <Button
                    py="2px"
                    px="12px"
                    fontSize={'12px'}
                    fontWeight={800}
                    onClick={() => {
                      goGuideAction(item.id);
                      onClose();
                    }}
                  >
                    {item.buttonTextFull}
                  </Button>
                )}
              </Flex>
            </React.Fragment>
          ))}
        </Flex>
      </Modal>
    </div>
  );
};

export default forwardRef(TestGuideModal);
