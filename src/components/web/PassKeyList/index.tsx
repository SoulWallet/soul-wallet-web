import { Box, Text } from "@chakra-ui/react"
import EditIcon from "@/components/Icons/Edit";

export default function PassKeyList({ passKeys }) {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      flexDirection="column"
      width="100%"
    >
      <Text fontSize="16px" color="#1E1E1E" fontWeight="700" marginBottom="4px">MY PASSKEYS</Text>
      {passKeys.map((passKey, i) =>
        <Box key={i} background="white" borderRadius="16px" padding="16px" width="100%" marginBottom="4px">
          <Box display="flex" alignItems="center">
            <Box width="50px" height="50px" background="#898989" borderRadius="50px" marginRight="16px" />
            <Box>
              <Text color="#1E1E1E" fontSize="18px" fontWeight="600">macOS computer</Text>
              <Text color="#1E1E1E" fontSize="14px">last used: Steptember 11 2023, 1:03 PM</Text>
              <Text color="#1E1E1E" fontSize="14px">backup: none</Text>
            </Box>
            <Box marginLeft="auto" marginRight="20px"><EditIcon /></Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
