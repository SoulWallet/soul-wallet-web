import { useState, useCallback } from 'react';
import { Box, Image } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import DetailsIMG from '@/components/Icons/mobile/Details'
import TabIcon from '@/components/Icons/mobile/Tab'
import { useNavigate } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc_lg.png'

export default function Deposit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const onPrev = useCallback(() => {
    console.log('prev')

    if (step > 0) {
      setStep(step - 1)
    }else{
      navigate('/intro')
    }
  }, [step])

  return (
    <Box height="100%">
      <Box
        background="#F5F6FA"
        paddingTop="18px"
        width="100%"
      >
        <Header
          title=""
          showBackButton
          onBack={onPrev}
          background="#F5F6FA"
          marginTop="0"
        />
      </Box>
      <Box
        background="#F5F6FA"
      >
        <DetailsIMG />
      </Box>
      <Box
        padding="30px"
        paddingTop="19px"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box>
            <Image width="80px" src={USDCIcon} />
          </Box>
          <Box
            fontSize="36px"
            fontWeight="800"
            marginTop="10px"
          >
            USDC
          </Box>
          <Box
            display="flex"
            alignItems="center"
          >
            <Box
              fontFamily="Nunito"
              fontSize="14px"
              fontWeight="700"
              lineHeight="17.5px"
            >
              on AAVE |
            </Box>
            <Box
              fontSize="14px"
              fontWeight="400"
              marginLeft="4px"
              lineHeight="17.5px"
            >
              Arbitrum
            </Box>
          </Box>
          <Box
            marginTop="30px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="60px"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box display="flex" alignItems="center" marginTop="16px">
                <Box
                  fontFamily="Nunito"
                  fontSize="30px"
                  fontWeight="800"
                >
                  12.16
                </Box>
                <Box
                  fontFamily="Nunito"
                  fontSize="16px"
                  fontWeight="700"
                  marginTop="10px"
                  marginLeft="10px"
                >
                  %
                </Box>
              </Box>
              <Box fontFamily="Nunito" fontSize="12px" fontWeight="700">
                7D Average APY
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
            >
              <Box display="flex" alignItems="center" marginTop="16px">
                <Box
                  fontFamily="Nunito"
                  fontSize="30px"
                  fontWeight="800"
                >
                  $825.6
                </Box>
                <Box
                  fontFamily="Nunito"
                  fontSize="16px"
                  fontWeight="800"
                  marginTop="10px"
                  marginLeft="10px"
                >
                  M
                </Box>
              </Box>
              <Box fontFamily="Nunito" fontSize="12px" fontWeight="700">
                TVL
              </Box>
            </Box>
          </Box>
          <Box
            marginTop="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            width="100%"
          >
            <Box
              fontSize="20px"
              fontWeight="700"
              marginBottom="16px"
            >
              About AAVE
            </Box>
            <Box
              fontSize="14px"
            >
              Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. Aave Protocol has been audited and secured.
            </Box>
            <Box
              width="100%"
              marginTop="18px"
              fontSize="14px"
              display="flex"
            >
              <Box marginRight="4px">Website</Box>
              <TabIcon />
            </Box>
          </Box>

          <Box
            marginTop="40px"
            marginBottom="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            width="100%"
          >
            <Box
              fontSize="20px"
              fontWeight="700"
              marginBottom="16px"
            >
              FAQs
            </Box>
            <Box
              fontSize="16px"
              fontWeight="700"
              width="100%"
              marginBottom="18px"
            >
              Where does yield come from?
            </Box>
            <Box
              fontSize="14px"
            >
              One of the key features that an ERC4337-based project can offer is paying gas fees on behalf of users through Bundlers and letting Paymaster reimburse the consumed fees to Bundler when the transaction succeeds.
            </Box>
          </Box>

          <Box
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
            padding="30px 0"
            fontSize="16px"
            fontWeight="700"
            width="100%"
          >
            Does Soul Wallet charge?
          </Box>
          <Box
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
            padding="30px 0"
            fontSize="16px"
            fontWeight="700"
            width="100%"
          >
            Any waiting period for deposit and withdraw?
          </Box>
          <Box
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
            padding="30px 0"
            fontSize="16px"
            fontWeight="700"
            width="100%"
          >
            Does the APY data accurate?
          </Box>
          <Box
            marginTop="50px"
            marginBottom="10px"
            width="100%"
          >
            <Button size="xl" type="blue" width="100%">Deposit to save</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
