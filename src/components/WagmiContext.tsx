import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sepolia, arbitrumSepolia, optimismSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
const queryClient = new QueryClient();

export default function WagmiContext({ children }: { children: ReactNode }) {
  const config = createConfig({
    chains: [sepolia, arbitrumSepolia, optimismSepolia],
    transports: {
      [sepolia.id]: http(),
      [arbitrumSepolia.id]: http(),
      [optimismSepolia.id]: http(),
    },
    connectors: [
      // injected(),
      // walletConnect({
      //   projectId: import.meta.env.VITE_WALLETCONNECT_ID,
      // }),
    ],
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
