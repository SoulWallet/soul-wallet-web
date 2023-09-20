import React from "react";
import LogoIcon from "@/assets/logo-v3.svg";
import LogoText from "@/assets/logo-text-v3.svg";
import { Box} from "@chakra-ui/react";
import {Image} from "@chakra-ui/react";

export default function Logo() {
  return (
    <Box display="flex" height="100px" minHeight="100px" alignItems="center">
      <Image width="70px" src={LogoIcon} alt="Logo" />
      <Image
        height="22px"
        src={LogoText}
        alt="Logo Text"
        marginLeft="10px"
        marginRight="10px"
      />
    </Box>
  );
}
