import { useParams } from 'react-router-dom';
import SendAssets from '@/components/SendAssets';
import MobileContainer from '@/components/MobileContainer';
import { ethers } from 'ethers';

export default function Send() {
  const params = useParams();
  const tokenAddress = params.tokenAddress || ethers.ZeroAddress;
  return (
    <MobileContainer p="5">
      <SendAssets tokenAddress={tokenAddress} />
    </MobileContainer>
  );
}
