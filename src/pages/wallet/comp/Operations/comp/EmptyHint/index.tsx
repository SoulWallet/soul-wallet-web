import { Box, Text } from "@chakra-ui/react";
import {Image} from "@chakra-ui/react";
import IconEmpty from "@/assets/empty.svg";

interface IEmptyHint {
    title: string;
}
export default function EmptyHint({ title }: IEmptyHint) {
    return (
        <Box textAlign={"center"} pb="10">
            <Image src={IconEmpty} w="32" mx="auto" mt="8" display={"block"} />
            <Text mt="2" fontWeight={"700"}>{title}</Text>
        </Box>
    );
}
