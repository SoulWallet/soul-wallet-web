import { useState } from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import { Link as Rlink } from 'react-router-dom';
import DetailsIMG from '@/components/Icons/mobile/Details'
import TabIcon from '@/components/Icons/mobile/Tab'
import { useNavigate } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc_lg.png'
import { aaveLink } from '@/config';
import useWallet from '@/hooks/useWallet';
import SettingIcon from '@/components/Icons/mobile/Setting'
import TelegramIcon from '@/components/Icons/mobile/Telegram'
import { headerHeight, tgLink } from '@/config';
import { useAddressStore } from '@/store/address';
import AddressIcon from '@/components/AddressIcon';
import LogoutIcon from '@/components/Icons/mobile/Logout'
import { useHistoryStore } from '@/store/history';
import HistoryIcon from '@/components/Icons/mobile/History'
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit'
import ActivityTransferIcon from '@/components/Icons/mobile/Activity/Transfer'

export default function Activity() {
  const { walletName, selectedAddress } = useAddressStore();
  const { historyList } = useHistoryStore();

  const finalHistoryList = historyList

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      paddingTop="34px"
      position="relative"
    >
      <Box
        fontSize="18px"
        fontWeight="700"
        lineHeight="24px"
        width="100%"
      >
        Activity
      </Box>
      {finalHistoryList && finalHistoryList.length > 0 && (
        <Box
          width="100%"
          background="white"
          marginTop="27px"
        >
          <Flex
            gap="36px"
            padding="0"
            flexDir="column"
            width="100%"
            overflow="auto"
            // maxHeight="calc(100% - 120px)"
          >
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
            {finalHistoryList.map(item => (
              <Box
                display="flex"
                alignItems="center"
                height="40px"
              >
                <Box marginRight="12px">
                  {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
                </Box>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    <Box fontSize="14px" fontWeight="800">{item.action}</Box>
                    {/* <Box
                        fontSize="12px"
                        background="#F1F1F1"
                        color="rgba(0, 0, 0, 0.60)"
                        padding="0 8px"
                        borderRadius="4px"
                        marginLeft="8px"
                        >
                        Pending
                        </Box> */}
                  </Box>
                  <Box fontSize="12px">{item.dateFormatted}</Box>
                </Box>
                <Box marginLeft="auto">
                  <Box fontSize="14px" fontWeight="700">{item.amountFormatted} USDC</Box>
                </Box>
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
