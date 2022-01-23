import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import {
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  Box,
  Spacer,
  Center,
} from "@chakra-ui/layout";
import { formatEther, formatUnits, parseEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import useTokenBalance from "hooks/useTokenBalance";
import { useTokenData } from "hooks/useTokenData";
import { useMemo, useState } from "react";
import { SWRResponse } from "swr";

import { usePegExchangeRate } from "hooks/merger/usePegExchangeRate";
import { usePegExchangeSwap } from "hooks/merger/usePegExchangeSwap";
import { TOKEN_ADDRESSES } from "../../constants";
import { chakra } from "@chakra-ui/system";
const Swap = () => {
  const { account } = useWeb3React();

  const { data: rgtBalance, mutate }: SWRResponse<BigNumber, Error> =
    useTokenBalance(account, TOKEN_ADDRESSES.REPTB);

  const { data: tribeBalance }: SWRResponse<BigNumber, Error> = useTokenBalance(
    account,
    TOKEN_ADDRESSES.FEI
  );

  const reptb = useTokenData(TOKEN_ADDRESSES.REPTB);
  const tribe = useTokenData(TOKEN_ADDRESSES.FEI);

  const [rgtInput, setRgtInput] = useState("");

  const exchangeRate = 1
  console.log({ exchangeRate });
  const { swap, swapStep } = usePegExchangeSwap();

  const tribeReceived = useMemo(() => {
    if (!rgtInput || !exchangeRate) return "0";
    return formatEther(parseEther(rgtInput).mul(1))
  }, [rgtInput, exchangeRate]);


  const handleSwap = async () => {
    if (!rgtInput || isNaN(parseFloat(rgtInput))) return;
    // alert(
    //   `Swapping ${formatUnits(
    //     parseEther(rgtInput)
    //   )} RGT for ${tribeReceived} TRIBE`
    // );
    await swap(parseEther(rgtInput));
    mutate();


  };

  const error = useMemo(() => {
    if (!rgtBalance) {
      return "You have no REPT-B";
    }

    if (!rgtInput) {
      return "Enter a value";
    }

    // console.log({
    //   rgtInput,
    //   rgtBalance,
    //   rgtInputBN,
    // });

    if (parseEther(rgtInput).gt(rgtBalance)) {
      return "You don't have enough REPT-B";
    }
    // if (maxRageQuittableAmount.isZero()) {
    //   return "Ineligible for Ragequit";
    // }
    // if (maxRageQuittableAmount.gt(0) && currentRageQuittableAmount.isZero()) {
    //   return "You have already Ragequit";
    // }
    // if (tribeBalance.isZero()) {
    //   return "You have no TRIBE";
    // }
    return undefined;
  }, [rgtInput, rgtBalance, tribeBalance]);

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      //justifyContent="start"
      w="100%"
      h={{ base: "30%", lg: "100%" }}
      flexGrow={1}
      mt={{ base: "35px", lg: "0" }}
      color="white"
    >
      {/* Left side */}
      <VStack
        flexGrow={0}
        h="100%"
        w={{ base: "100%", lg: "50%" }}
        spacing="4"
        align="start"
        id="POOP"
        px={5}
      >
        {/* Box */}
        <Flex
          direction="column"
          w={{ base: "100%", sm: "80%" }}
          h="400px"
          // border="1px solid grey"
          borderRadius="lg"
          px={{ base: 5, sm: 10 }}
          py={5}
          my="auto"
          mx="auto" r
        // bgGradient="linear-gradient(90deg, rgba(5,53,181,1) 0%, rgba(23,141,207,1) 100%)"
        >
          <Heading> Swap REPT-B for FEI </Heading>

          <HStack w="100%" align="start" justify="start" my={1}>
            <VStack align="start" bg="" my={4}>
              <Text>You have:</Text>
              <HStack>
                <Text fontWeight="bold">
                  {parseFloat(
                    formatEther(rgtBalance ?? BigNumber.from(0))
                  ).toFixed(18)}{" "}
                  REPT-B
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <VStack align="flex-start" w="100%">
            <InputGroup w="100%" size="lg">
              <Input
                type="number"
                inputMode="decimal"
                w="100%"
                size="lg"
                value={rgtInput}
                onChange={({ target: { value } }) => {
                  setRgtInput(value);
                }}
                fontWeight="bold"
                bg="white"
                color="black"
                placeholder="REPT-B to swap"
                _placeholder={{
                  fontWeight: "bold",
                }}
              />
              <InputRightElement
                children={
                  <HStack
                    w="100%"
                    mr={"30px"}
                    justify="end"
                    align="center"
                    color="black"
                  >
                    <Button
                      onClick={() =>
                        setRgtInput(
                          formatEther(rgtBalance ?? BigNumber.from(0))
                        )
                      }
                      background="transparent"
                      color="#adadad"
                      border="1px"
                      borderColor="#adadad"
                      margin={0}
                      h="30%"
                      _hover={{}}
                      _active={{}}
                      _focus={{ boxShadow: "" }}
                      p={1}
                    >
                      <Text fontSize="sm"> Max </Text>
                    </Button>
                  </HStack>
                }
              />
            </InputGroup>
          </VStack>

          <Center w="100%" my={3}>
            <ArrowDownIcon size="lg" color="black" />
          </Center>

          <VStack align="flex-start" w="100%" mb={4}>
            <InputGroup w="100%" size="lg">
              <Input
                w="100%"
                size="lg"
                value={parseFloat(tribeReceived).toFixed(18)}
                placeholder="FEI recieved"
                disabled
                bg="white"
                color="grey"
                _placeholder={{
                  fontWeight: "bold",
                }}
                _disabled={{
                  opacity: 0.7,
                }}
                fontWeight="bold"
              />
              <InputRightElement
                children={
                  <HStack
                    w="100%"
                    mr={"30px"}
                    justify="end"
                    align="center"
                    color="#178DCF"
                  >
                    <Avatar h="100%" boxSize="15px" src={tribe?.logoURL} />
                    <Text>FEI</Text>
                  </HStack>
                }
              />
            </InputGroup>
          </VStack>

          <Button
            onClick={handleSwap}
            w="100%"
            colorScheme="green"
            disabled={!!error || !!swapStep}
            _disabled={{
              opacity: 0.7,
            }}
          >
            {!!error ? (
              error
            ) : swapStep === "APPROVING" ? (
              "Approving REPT-B..."
            ) : swapStep === "SWAPPING" ? (
              <HStack h="100%">
                <Image
                  h="100%"
                  src="https://cdn.discordapp.com/emojis/749637020946661487.gif?size=240"
                />
              </HStack>
            ) : (
              "Swap RGT for TRIBE"
            )}
          </Button>
        </Flex>
      </VStack>
      {/* Right Side */}
      <VStack
        w={{ base: "100%", lg: "50%" }}
        h={{ base: "60%", lg: "100%" }}
        pb={{ base: "150px", sm: "0px" }}
        flexGrow={0}
        flexShrink={0}
        bg=""
      >
        <Image
          src="https://pbs.twimg.com/media/Ed2QkqsWkAMzlzQ?format=png&name=900x900"
          w={{ base: "90%", sm: "70%" }}
          h="auto"
          mx="auto"
          my="auto"
          alt="Happy Pepe"
        />
      </VStack>
    </Flex>
  );
};

export default Swap;
