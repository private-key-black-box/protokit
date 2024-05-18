// "use client";
// import { Swap } from "@/components/swap";
// import { useWalletStore } from "@/lib/stores/wallet";
// import { useBalancesStore, tokenIdMina, tokenIdDai, tokenIdBtc } from '@/lib/stores/balances';
// import { UInt64 } from 'o1js';

// export default function SwapPage() {
//   const wallet = useWalletStore();
//   const balances = useBalancesStore();

//   const handleSwap = async (fromToken: string, toToken: string, amount: number) => {
//     if (wallet.wallet && balances.client) {
//       const fromTokenId = fromToken === 'mina' ? tokenIdMina : fromToken === 'dai' ? tokenIdDai : tokenIdBtc;
//       const toTokenId = toToken === 'mina' ? tokenIdMina : toToken === 'dai' ? tokenIdDai : tokenIdBtc;
//       const amountUInt64 = UInt64.from(amount);

//       await balances.swapTokens(balances.client, fromTokenId, toTokenId, amountUInt64, wallet.wallet);
//     }
//   };

//   return (
//     <div className="mx-auto h-full pt-16">
//       <div className="flex h-full w-full items-center justify-center pt-16">
//         <div className="flex basis-4/12 flex-col items-center justify-center 2xl:basis-3/12">
//           <Swap
//             wallet={wallet.wallet}
//             onConnectWallet={wallet.connectWallet}
//             onSwap={handleSwap}
//             loading={false}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
