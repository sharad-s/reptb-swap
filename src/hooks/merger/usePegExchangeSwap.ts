import useContract from "../useContract";
import PEG_EXCHANGER_ABI from "../../../contracts/PegExchanger.json";
import REPTB_ABI from "../../../contracts/REPTBExchanger.json";
import ERC20_ABI from "../../../contracts/ERC20.json";
import { ERC20, PegExchanger, REPTBExchanger } from "../../../contracts/types";
import { BigNumber, constants, Contract } from "ethers";
import {
  PEG_EXCHANGER_ADDRESS,
  REPTB_ADDRESS,
  TOKEN_ADDRESSES,
} from "../../constants";
import { useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useToast } from "@chakra-ui/react";
import { handleGenericError } from "utils/handleGenericError";
import { formatEther, formatUnits } from "@ethersproject/units";
import { usePegExchangeRate } from "./usePegExchangeRate";

export const usePegExchangeSwap = () => {
  const { account } = useWeb3React();
  const toast = useToast();

  const exchangeContract: REPTBExchanger = useContract(
    REPTB_ADDRESS,
    REPTB_ABI
  );

  const exchangeRate = usePegExchangeRate();

  const rgtContract: ERC20 = useContract(TOKEN_ADDRESSES.REPTB, ERC20_ABI);

  const [swapStep, setSwapStep] = useState<
    "APPROVING" | "SWAPPING" | "LOADING" | undefined
  >();

  const swapFn = useCallback(
    (amountBN: BigNumber) => {
      swapRGTForFei(
        exchangeContract,
        rgtContract,
        amountBN,
        account,
        setSwapStep
      )
        .then(() => {
          setSwapStep(undefined);
          toast({
            title: `Exchanged ${parseFloat(formatEther(amountBN)).toFixed(
              4
            )} RGT!`,
            description: `For ${formatUnits(
              amountBN.mul(exchangeRate),
              27
            )} TRIBE`,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((err) => {
          handleGenericError(err, toast);
          setSwapStep(undefined);
        });
    },
    [exchangeContract, exchangeRate, rgtContract, account, setSwapStep, toast]
  );

  return { swap: swapFn, swapStep };
};

// Checks allowance and exchanges RGT for Fei
export const swapRGTForFei = async (
  exchangeContract: REPTBExchanger,
  rgtContract: ERC20,
  amountBN: BigNumber,
  account: string,
  setStep: (x: "APPROVING" | "SWAPPING" | "LOADING" | undefined) => void
) => {
  setStep("LOADING");

  // Token
  const allowance = await rgtContract.callStatic.allowance(
    account,
    REPTB_ADDRESS
  );

  console.log({
    amountBN,
    account,
    rgtContract,
    allowanceBN: allowance,
    allowance: allowance.toString(),
    shouldApprove: allowance.lt(amountBN),
  });

  if (allowance.lt(amountBN)) {
    setStep("APPROVING");
    await rgtContract.approve(PEG_EXCHANGER_ADDRESS, constants.MaxUint256);
  }

  setStep("SWAPPING");
  const tx = await exchangeContract.exchange(account, amountBN);
  await tx.wait(1);

  setStep(undefined);
};
