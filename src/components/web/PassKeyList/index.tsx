import { useState } from 'react'
import { Box, Text, Input } from '@chakra-ui/react';
import EditIcon from '@/components/Icons/Edit';
import ComputerIcon from '@/components/Icons/Computer';

function PassKeyItem({ passKey, setPassKeyName }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(passKey.name);

  const onChange = (event: any) => {
    setName(event.target.value);
  }

  const onKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      setPassKeyName({ id: passKey.id, name });
      setIsEditing(false);
    }
  }

  const onBlur = () => {
    setPassKeyName({ id: passKey.id, name });
    setIsEditing(false);
  }

  return (
    <Box background="white" borderRadius="16px" padding="16px" width="100%" marginBottom="4px">
      <Box display="flex" alignItems="center">
        <Box width="50px" height="50px" background="#efefef" borderRadius="50px" marginRight="16px" display="flex" alignItems="center" justifyContent="center"><ComputerIcon /></Box>
        <Box>
          {!isEditing && (
            <Text color="rgb(7, 32, 39)" fontSize="18px" fontWeight="600">
              {passKey.name}
            </Text>
          )}
          {isEditing && (
            <Input type="text" value={name} fontSize="16px" color="rgb(7, 32, 39)" fontWeight="700" marginBottom="4px" onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
          )}
          <Text color="rgb(51, 51, 51)" fontSize="14px">
            last used: Steptember 11 2023, 1:03 PM
          </Text>
          <Text color="rgb(51, 51, 51)" fontSize="14px">
            backup: none
          </Text>
        </Box>
        <Box marginLeft="auto" marginRight="20px" borderRadius="48px" width="48px" height="48px" display="flex" alignItems="center" justifyContent="center" cursor="pointer" _hover={{ background: 'rgba(0, 0, 0, 0.04)' }} onClick={() => setIsEditing(true)}>
          <EditIcon />
        </Box>
      </Box>
    </Box>
  );
}

export default function PassKeyList({ passKeys, setPassKeyName }: any) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box display="flex" alignItems="flex-start" justifyContent="center" flexDirection="column" width="100%">
      <Text fontSize="16px" color="#1E1E1E" fontWeight="700" marginBottom="4px">
        MY PASSKEYS
      </Text>
      {passKeys.map((passKey: any) => (
        <PassKeyItem key={passKey.id} passKey={passKey} setPassKeyName={setPassKeyName} />
      ))}
    </Box>
  );
}
