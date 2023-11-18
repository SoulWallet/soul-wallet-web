import React, { useState } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import {
  Box,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import useBrowser from '@/hooks/useBrowser';
import CheckedIcon from '@/components/Icons/Checked';
import api from '@/lib/api';


function DisclaminerModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={'800px'}>
        <ModalHeader
          display={'flex'}
          justifyContent={'center'}
          gap="5"
          fontWeight={'800'}
          textAlign={'center'}
          borderBottom={'1px solid #d7d7d7'}
        >
          Soul Wallet Public Alpha Testing Disclaimer
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody px="20px" overflow="scroll">
          <Box
            h="100%"
            roundedBottom="20px"
            p="6"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box width="100%">
              <Heading1>Introduction</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                This Public Alpha Testing Disclaimer ("Disclaimer") pertains to the use of Soul Wallet in its alpha version. The purpose of this Disclaimer is to inform users ("Participants") that the current version of Soul Wallet is an alpha release, and as such, it should be used with the understanding that it is a preliminary product undergoing rigorous testing and refinement. Participants acknowledge that they engage with the product at their own risk.
              </TextBody>
              <Heading1 marginTop="20px">Product Overview</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                Soul Wallet epitomizes the forefront of smart contract wallet technology, providing enhanced security, a user-friendly interface, and integrated decentralized application (dApp) interaction. Its distinct features aim to streamline user transactions and interactions within the Ethereum network, emphasizing ease of access and robust security protocols.
              </TextBody>
              <Heading1 marginTop="20px">Acknowledgment of Alpha Status</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                Participants acknowledge that they are engaging with Soul Wallet in its alpha stage—a preliminary phase of development provided expressly for testing and feedback purposes. This early release may not be free of imperfections and by participating, users accept the inherent risks of using software that is still in its formative stages. The alpha testing phase is conducted solely on a designated testnet, allowing participants to simulate transactions with test tokens. This crucial stage is aimed at gathering extensive user feedback, which is vital for refining the wallet prior to the anticipated mainnet launch.
              </TextBody>
              <Heading1 marginTop="20px">Disclaimer of Liability</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                While the Soul Wallet team is committed to ensuring the highest quality and security standards, we cannot guarantee that the alpha version will be free from defects or errors. By agreeing to participate in this testing phase, Participants assume all risks related to the use of the alpha version, and our company shall not be liable for any harm, loss, or damage of any kind arising from its use.
              </TextBody>
              <Heading1 marginTop="20px">Acknowledgment of Risks</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                Participants should be aware that as Soul Wallet undergoes development and continuous updates, temporary lapses in functionality may occur. These interruptions are expected during the software iteration process and should only raise concerns if they last longer than three days, at which point they should be reported as a potential bug. Additionally, it's important to note that wallet balances could be reset during updates, and it is prudent to avoid transferring significant value into the wallet during the test phase.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                Users must recognize that the use of Soul Wallet is at their own risk. Any actions taken within the alpha version, whether transacting, inputting data, or other forms of use, fall under the participant's responsibility. To mitigate risk, it is advised against moving any considerable assets or sensitive personal information into the wallet for the duration of this alpha testing period.
              </TextBody>
              <Heading1 marginTop="20px">User Engagement</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                Test participants will be required to evaluate a suite of functionalities, including but not limited to:
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                1. Wallet creation and multi-device passkey integration.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                2. Token transactions augmented by gas sponsorship.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                3. dApp interface interaction.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                4. Guardians set up function.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                5. Social recovery function.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                6. Integration and usage of Uniswap through an iframe and web SDK engagement.
              </TextBody>
              <Heading1 marginTop="20px">Data Utilization and Confidentiality</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                The confidentiality and integrity of user data remain paramount throughout the testing process. All data will be handled carefully, subject to prevailing data protection legislation. Participants' contribution is pivotal to achieving the highest echelons of privacy and data security standards for Soul Wallet.
              </TextBody>
              <Heading1 marginTop="20px">Feedback Mechanism and Issue Reporting</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                Constructive criticism, bug reports, and enhancement suggestions are solicited through the designated feedback portal provided on our official webpage. Additionally, real-time engagement with our team is facilitated via our dedicated Telegram group, with supplemental channels available through Twitter and GitHub.
              </TextBody>
              <Heading1 marginTop="20px">Limitations of Liability</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                Soul Wallet is currently in a testing phase and, as such, may contain unknown errors or defects. While we endeavor to provide a stable and functional product, we cannot assume liability for any adverse events arising from its use. Users are advised to exercise caution and discretion when interacting with the wallet.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                Accordingly, the developers, administrators, or affiliates will not be held liable for any incidental, indirect, special, punitive, exemplary, or consequential damages that may arise from the Participant's use of the Soul Wallet alpha version. Our liability is expressly limited to the maximum extent allowed by law, underscoring the importance of user awareness and cautious engagement with the wallet during this early testing stage.
              </TextBody>
              <Heading1 marginTop="20px">Your Acceptance of These Terms</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                By using the Soul Wallet alpha version, Participants express their understanding of and agreement with this Disclaimer. If Participants do not agree to the terms herein, they are advised not to proceed with using the product.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                Participants' active contribution to the public testing of Soul Wallet is greatly appreciated. Your feedback is essential to the development of a secure and robust final product. Thank you for your support and understanding.
              </TextBody>
              <Heading1 marginTop="20px">Contact Us</Heading1>
              <TextBody fontSize="16px" fontWeight="500">
                Inquiries and support requisites should be directed to our customer service channels via Telegram, Twitter, and GitHub. Alternatively, our support team can be reached at <a href="mailto:support@soulwallet.io">support@soulwallet.io</a>.
              </TextBody>
              <TextBody fontSize="16px" fontWeight="500">
                Your participation in the public testing of Soul Wallet signifies your understanding of and agreement to the conditions enumerated herein. We express our sincerest gratitude for your indispensable role in the evolution of Soul Wallet.
              </TextBody>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default function SetWalletName({ changeStep }: any) {
  const { navigate } = useBrowser();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toast = useToast();

  const handleNext = async () => {
    navigate('/wallet');
  };

  return (
    <FullscreenContainer>
      <Box width="480px" maxWidth="calc(100vw - 20px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1 marginTop="20px">🎉 Wallet is ready!</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="40px">
          <TextBody color="#1E1E1E" textAlign="center" fontSize="16px">
            Navigate Ethereum with security and simplicity.
          </TextBody>
        </Box>
        <Box background="white" borderRadius="20px" padding="16px 32px" marginBottom="40px">
          <Box marginBottom="16px" display="flex">
            <Box width="20px" marginRight="10px"><CheckedIcon /></Box>
            <TextBody fontWeight="600">
              Soul Wallet is in <TextBody fontWeight="800" display="inline">public alpha test on testnet</TextBody> and still under development. Participate at your own risk.
            </TextBody>
          </Box>
          <Box marginBottom="16px" display="flex">
            <Box width="20px" marginRight="10px"><CheckedIcon /></Box>
            <TextBody fontWeight="600">
              Our early version might not be perfect and we can't cover any losses. But together we are heading west!
            </TextBody>
          </Box>
          <Box display="flex">
            <Box width="20px" marginRight="10px"><CheckedIcon /></Box>
            <TextBody fontWeight="600">
              Join us in exploring new features! We'd love to hear your thoughts and feedback.
            </TextBody>
          </Box>
        </Box>
        <Button
          onClick={handleNext}
          _styles={{ width: '320px', marginTop: '12px' }}
          loading={loading}
          disabled={loading}
        >
          See my wallet
        </Button>
        <Box>
          <TextBody width="320px" textAlign="center" marginTop="10px" fontSize="12px" fontWeight="600">
            By continuing, you agree to accept our <Text onClick={() => setIsModalOpen(true)} fontWeight="800" as="a" cursor="pointer">Public Alpha Testing Disclaimer</Text>
          </TextBody>
        </Box>
      </Box>
      <DisclaminerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </FullscreenContainer>
  )
}
