import { TestingAppChain } from "@proto-kit/sdk";
import { Character, CircuitString, PrivateKey } from "o1js";
import { NoSigning } from "../../runtime/nosigning";
import { log } from "@proto-kit/common";
import { BalancesKey, TokenId, UInt64 } from "@proto-kit/library";

log.setLevel("ERROR");

describe("sign", () => {
  it("should demonstrate how our new module works", async () => {
    const appChain = TestingAppChain.fromRuntime({
      NoSigning,
    });

    appChain.configurePartial({
      Runtime: {
        Balances: {
          totalSupply: UInt64.from(10000),
        },
        NoSigning: {
        },
      },
    });

    await appChain.start();

    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    const tokenId = TokenId.from(0);

    appChain.setSigner(alicePrivateKey);

    const noSigning = appChain.runtime.resolve("NoSigning");

    const tx1 = await appChain.transaction(alice, () => {
      const seed = "test";
      const chars = seed.split('').map(c => Character.fromString(c));
      const circuitStringSeed = CircuitString.fromCharacters(chars); 
      noSigning.generate(circuitStringSeed);
    });
    // console.log(tx1);

    await tx1.sign();
    await tx1.send();
    
    const block = await appChain.produceBlock();

    // const key = new BalancesKey({ tokenId, address: alice });
    // const balance = await appChain.query.runtime.Balances.balances.get(key);

    // expect(block?.transactions[0].status.toBoolean()).toBe(true);
    // expect(balance?.toBigInt()).toBe(1000n);
  }, 1_000_000);
});
