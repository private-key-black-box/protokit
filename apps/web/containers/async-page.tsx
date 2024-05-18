"use client";
import { Faucet } from "@/components/faucet";
import { useFaucet } from "@/lib/stores/balances";
import { useWalletStore } from "@/lib/stores/wallet";
import { Swap } from "@/components/swap";
import { useBalancesStore } from "@/lib/stores/balances";
import { useClientStore } from "@/lib/stores/client";

export default function Home() {
  const wallet = useWalletStore();
  const drip = useFaucet();
  const balances = useBalancesStore();
  const clientStore = useClientStore();

  const handleSwap = async (fromToken: string, toToken: string, amount: number) => {
    if (wallet.wallet && clientStore.client) {
      await balances.swapTokens(clientStore.client, fromToken, toToken, amount, wallet.wallet);
    }
  };

  return (
    <div className="mx-auto -mt-32 h-full pt-16">
      <div className="flex h-full w-full items-center justify-center pt-16">
        <div className="flex basis-4/12 flex-col items-center justify-center 2xl:basis-3/12">
          <Faucet
            wallet={wallet.wallet}
            onConnectWallet={wallet.connectWallet}
            onDrip={drip}
            loading={false}
          />
          <Swap
            wallet={wallet.wallet}
            onConnectWallet={wallet.connectWallet}
            onSwap={handleSwap}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
}
