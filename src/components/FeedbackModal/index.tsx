import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import Modal from '../Modal';
import Feedback from './Feedback';

const FeedbackModal = (_: unknown, ref: Ref<any>) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});

  useImperativeHandle(ref, () => ({
    async show() {
      setVisible(true);
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
      <Modal title="Feedback" visible={visible} width={{ lg: '544px' }} onClose={onClose}>
        <Feedback onCancel={onClose} />
      </Modal>
    </div>
  );
};

export default forwardRef(FeedbackModal);
