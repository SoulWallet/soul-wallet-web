import { ReactNode } from "react";
import { Text } from '@chakra-ui/react'

export default function Heading1({ children, onClick, ...restProps }: any) {
  return (
    <Text fontSize="24px" fontWeight="800" marginBottom="10px" color="#1E1E1E" {...restProps} onClick={onClick}>
      {children}
    </Text>
  )
}
