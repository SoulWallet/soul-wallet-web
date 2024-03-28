import { useEffect, useState, useRef } from 'react'
import { Box, Image, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { ethers } from 'ethers';
import IconLoading from '@/assets/loading.svg';
import { toShortAddress } from '@/lib/tools';
import config, { ensContractAddress } from '@/config'

function stringToSeed(str: any) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function SeededRandom(seed: any) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generateSeededColor(strSeed: any, offset: any = 0) {
  const seed = stringToSeed(strSeed) + offset;
  const random = SeededRandom(seed);
  const min = 150;  // Adjusted minimum RGB value
  const max = 255; // Adjusted maximum RGB value
  const range = max - min;
  const red = Math.floor(random() * range + min);
  const green = Math.floor(random() * range + min);
  const blue = Math.floor(random() * range + min);
  return "rgb(" + red + "," + green + "," + blue + ")";
}

async function isENSExpiration(name: any, provider: any) {
  try {
    const ensRegistry = new ethers.Contract(
      ensContractAddress,
      ['function nameExpires(uint256 id) external view returns(uint)'],
      provider
    );

    // Compute the namehash for the ENS name
    const resolver = await provider.getResolver(name);

    if (resolver) {
      const nameLabel = name.endsWith('.eth') ? name.split('.')[0] : name
      const nameId = ethers.id(nameLabel);
      const expiresTimestamp = await ensRegistry.nameExpires(nameId);
      console.log('expiresTimestamp', expiresTimestamp, nameLabel, nameId)

      if (expiresTimestamp !== 0n) {
        const expiresDate = new Date(Number(expiresTimestamp) * 1000);
        const now = new Date();
        return now > expiresDate;
      }
    }

    return false
  } catch (error: any) {
    console.log('error', error);
    return false
  }
}

export const isENSAddress = (address: string) => {
  const ensRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
  return ensRegex.test(address);
};

export const extractENSAddress = (address: any) => {
  if (!address) return

  if (ethers.isAddress(address)) {
    return null
  } else if (isENSAddress(address)) {
    return address
  } else if (address.indexOf('.') === -1) {
    return `${address}.eth`
  } else {
    return address
  }
}

function debounce(func: any, wait: any) {
  let timeout: any;

  return function executedFunction(...args: any) {
    const later = () => {
      clearTimeout(timeout);
      console.log('later')
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const ENSResolver = ({
  isENSOpen,
  setIsENSOpen,
  isENSLoading,
  setIsENSLoading,
  searchText,
  searchAddress,
  setSearchAddress,
  resolvedAddress,
  setResolvedAddress,
  setMenuRef,
  submitENSName,
  setActiveENSNameRef,
  getActiveENSNameRef,
  _styles,
}: any) => {
  const resolveName = async (ensName: any) => {
    const resolveNameMainnet = async (ensName: any) => {
      setActiveENSNameRef(ensName)
      setIsENSLoading(true)
      setResolvedAddress('')
      const ethersProvider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`);
      const address = await ethersProvider.resolveName(ensName);
      let isSuccess = false
      const isExpired = await isENSExpiration(ensName, ethersProvider);
      console.log('address', address, isExpired)

      if (getActiveENSNameRef() === ensName) {
        if (address && !isExpired) {
          setResolvedAddress(address)
          isSuccess = true
        } else {
          setResolvedAddress('')
          setSearchAddress('')
          isSuccess = false
        }

        setIsENSLoading(false)
      }

      return isSuccess ? address : null
    }

    try {
      await resolveNameMainnet(ensName)
    } catch (error: any) {
      if (getActiveENSNameRef() === ensName) {
        setResolvedAddress('')
        setSearchAddress('')
        setIsENSLoading(false)
      }

      console.log('error', error.message)
    }
  }

  useEffect(() => {
    if (searchAddress) {
      setIsENSLoading(true)

      debounce(() => {
        resolveName(searchAddress)
      }, 1000)()
    }
  }, [searchAddress])

  useEffect(() => {
    if (searchText) {
      const searchAddress = extractENSAddress(searchText)

      if (searchAddress) {
        setSearchAddress(searchAddress)
      } else {
        setIsENSOpen(false)
      }
    }
  }, [searchText])

  return (
    <Box
      position="absolute"
      {...(_styles)}
      ref={setMenuRef}
      sx={{
        div: {
          width: '100%',
          maxWidth: '100%',
          minWidth: 'auto'
        }
      }}
    >
      <Menu
        isOpen={isENSOpen}
        isLazy
      >
        {() => (
          <Box maxWidth="100%" overflow="auto">
            <MenuList background="white" maxWidth="100%" boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.2)">
              <MenuItem maxWidth="100%" position="relative" onClick={(!isENSLoading && searchAddress) ? (() => submitENSName(searchAddress)) : (() => {})} cursor={(!isENSLoading && searchAddress) ? 'pointer' : 'not-allowed'}>
                {!!searchAddress && (
                  <Box
                    as="span"
                    background={`linear-gradient(to right, ${generateSeededColor(searchAddress)}, ${generateSeededColor(searchAddress, 1)})`}
                    width="20px"
                    height="20px"
                    borderRadius="20px"
                    marginRight="10px"
                  />
                )}
                {!!searchAddress && <Box as="span" fontWeight="bold" marginRight="4px">{searchAddress}</Box>}
                {resolvedAddress && !isENSLoading && `(${toShortAddress(resolvedAddress)})`}
                {!resolvedAddress && !isENSLoading && <Box as="span" color="#898989">{`No ENS found`}</Box>}
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  width="40px"
                  height="100%"
                  as="span"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {!!isENSLoading && <Image width="20px" src={IconLoading} />}
                </Box>
              </MenuItem>
            </MenuList>
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default ENSResolver
