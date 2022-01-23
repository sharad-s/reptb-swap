import {
  Box,
  Flex,
  Spacer,
  Avatar,
  AvatarGroup,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";

import Account from "components/Connected/Account";
import AppLink from "components/Common/AppLink";
import ETHBalance from "components/Connected/ETHBalance";
import TokenBalance from "components/Connected/TokenBalance";
import useEagerConnect from "hooks/useEagerConnect";

import Link from "next/link";
import { useEffect, useState } from "react";

export const NewHeader = () => {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 1000);
  }, []);

  return (
    <VStack w="100%" zIndex={100}>
      <Flex
        px={4}
        height="50px"
        justify="flex-start"
        align="center"
        overflowX="visible"
        overflowY="visible"
        width="100%"
        zIndex={3}
        color="white"
        // bg="pink"
      >
        <HStack>
          <AppLink href="/">
            <AvatarGroup h="100%">
              <Avatar
                h="100%"
                boxSize="30px"
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x956F47F50A910163D8BF957Cf5846D573E7f87CA/logo.png"
              />
              <Avatar
                h="100%"
                boxSize="30px"
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD291E7a03283640FDc51b121aC401383A46cC623/logo.png"
              />
            </AvatarGroup>
          </AppLink>

          <Spacer />
          <AppLink href="/swap">
            <Text fontWeight="bold">Swap</Text>
          </AppLink>
          <Spacer />
        </HStack>
        <Spacer />
        <Account triedToEagerConnect={triedToEagerConnect} />
      </Flex>
    </VStack>
  );
};

export default NewHeader;
