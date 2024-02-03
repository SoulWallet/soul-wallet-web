import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { paymentContractConfig } from '@/contracts/contracts';

export default function usePublic() {
  const { writeContract } = useWriteContract();

  const payFee = async (fee: string, payId: string) => {
    writeContract(
      {
        ...paymentContractConfig,
        functionName: 'pay',
        args: [fee, payId],
      },
      {
        onSuccess: (data) => {
          console.log('success', data);
          const result = useWaitForTransactionReceipt({
            //   hash: payHash,
            // onSuccess() {
            //   toast({
            //     title: "Success",
            //     description: "Redeem",
            //     status: "success",
            //   });
            // },
          });
        },
        onSettled: () => {
          console.log('settled');
        },
      },
    );
  };

  return {
    payFee,
  };
}
