import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { paymentContractConfig } from '@/contracts/contracts';

export default function usePublic() {
  const { writeContract } = useWriteContract();

  const payFee = async (fee: bigint, payId: string) => {
    writeContract(
      {
        ...paymentContractConfig,
        functionName: 'pay',
        args: [payId],
        value: fee,
      },
      {
        onSuccess: (hash) => {
          console.log('success', hash);
          const result = useWaitForTransactionReceipt({
            hash,
            // onSuccess() {
            //   toast({
            //     title: "Success",
            //     description: "Redeem",
            //     status: "success",
            //   });
            // },
          });
          console.log('result issss:', result);
        },
        onSettled: () => {
          console.log('settled');
        },
        onError: (error) => {
          console.log('error', error);
        },
      },
    );
  };

  return {
    payFee,
  };
}
