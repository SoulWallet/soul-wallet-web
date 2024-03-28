import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Image,
  Checkbox,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import NextIcon from '@/components/Icons/mobile/Next';
import Header from '@/components/mobile/Header'
import { useNavigate } from 'react-router-dom';
import CheckDeposit from './CheckDeposit'
import MakeTransfer from './MakeTransfer'
import SelectNetwork from './SelectNetwork'
import SendToken from './SendToken'
import FadeSwitch from '@/components/FadeSwitch';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { useHistoryStore } from '@/store/history';
import 'swiper/css';
import 'swiper/css/pagination';
// import { Pagination } from 'swiper/modules';

const Pagination = ({ isActive, count, activeIndex, onNext, onFinish }: any) => {
  const navigate = useNavigate();
  return (
    <Box
      position="fixed"
      left="0"
      bottom="0"
      opacity={isActive ? 1 : 0}
      pointerEvents={isActive ? 'all' : 'none'}
      width="100%"
      paddingTop="20px"
      paddingBottom="36px"
      background="white"
      zIndex="1"
    >
      <Box display="flex" alignItems="center" justifyContent="center" marginBottom="24px">
        {Array(count || 0).fill(1).map((_: any, i: any) =>
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background={i === activeIndex ? 'black' : '#D9D9D9'} />
        )}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        {activeIndex !== 3 && (
          <Box fontWeight="700" fontSize="18px" cursor="pointer" onClick={onNext}>
            What’s next
          </Box>
        )}
        {activeIndex === 3 && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box onClick={() => navigate('/dashboard')} fontWeight="700" fontSize="18px" cursor="pointer">I’ve done with all these steps!</Box>
          </Box>
        )}
        <Box>
          <NextIcon />
        </Box>
      </Box>
    </Box>
  )
}

export default function Deposit() {
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState<any>(null)
  const [step, setStep] = useState(0)
  const [isPaginationActive, setIsPaginationActive] = useState(false)
  const { historyList } = useHistoryStore();
  const innerHeight = window.innerHeight

  const onFinish = () => {
    if(historyList.length){
      navigate('/dashboard')
    }else{
      navigate('/intro')
    }
  }

  const onPrev = useCallback(() => {
    console.log('prev')

    if (step > 0) {
      // setStep(step - 1)
      swiper.slidePrev()
    }else{
      // onFinish()
      navigate(-1)
    }
  }, [step, swiper])

  const onNext = useCallback(() => {
    console.log('next', swiper)
    // setStep(step + 1)
    swiper.slideNext()
  }, [swiper])

  const onSlideChange = useCallback((swiper: any) => {
    setStep(swiper.activeIndex)
  }, [])

  const onInit = useCallback((swiper: any) => {
    setSwiper(swiper)
  }, [])

  useEffect(() => {
    /* const swiper = new Swiper('.swiper', {
     *   // ...
     * });
     * swiper.on('slideChange', function () {
     *   console.log('slide changed');
     * }); */
  }, [])

  return (
    <Box width="100%" height={innerHeight} overflow="hidden">
      <Header
        title="Deposit"
        showBackButton
        onBack={onPrev}
      />
      <Swiper
        className="mySwiper"
        onSlideChange={onSlideChange}
        onInit={onInit}
      >
        <SwiperSlide>
          <CheckDeposit setIsPaginationActive={setIsPaginationActive} onPrev={onPrev} onNext={onNext} />
        </SwiperSlide>
        <SwiperSlide>
          <MakeTransfer onPrev={onPrev} onNext={onNext} />
        </SwiperSlide>
        <SwiperSlide>
          <SelectNetwork onPrev={onPrev} onNext={onNext} />
        </SwiperSlide>
        <SwiperSlide>
          <SendToken onFinish={onFinish} />
        </SwiperSlide>
      </Swiper>
      <Pagination isActive={isPaginationActive} activeIndex={step} count={4} onNext={onNext} onFinish={onFinish} />
    </Box>
  );
}
