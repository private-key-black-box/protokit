import 'reflect-metadata';

import { TestingAppChain } from "@proto-kit/sdk";
import { Character, CircuitString, PrivateKey, Proof } from "o1js";
import { NoSigning, NoSignerProof } from "../../src/runtime/nosigning";
import { TokenRegistry } from "../../src/runtime/token-registry";
import { log } from "@proto-kit/common";
import { config, modules } from "../../src/runtime";
import { BalancesKey, TokenId, UInt64 } from "@proto-kit/library";
import mockProof from "../proof";

log.setLevel("ERROR");

describe("sign", () => {
  it("should demonstrate how our new module works", async () => {
    const appChain = TestingAppChain.fromRuntime({
      NoSigning,
      TokenRegistry
    });

    appChain.configurePartial({
      Runtime: config,
    });

    await appChain.start();

    const alicePrivateKey = PrivateKey.random();
    const bobPrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    const bob = bobPrivateKey.toPublicKey();
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

    const tx2 = await appChain.transaction(alice, () => {
      const seed = "test";
      const chars = seed.split('').map(c => Character.fromString(c));
      const circuitStringSeed = CircuitString.fromCharacters(chars); 
      const mock = NoSignerProof.fromJSON(mockProof);
      noSigning.transferWithProof(tokenId, bob, alice, UInt64.from(1000n), mock);
    });
    // console.log(tx1);

    await tx2.sign();
    await tx2.send();
    
    const block = await appChain.produceBlock();

    const key = new BalancesKey({ tokenId, address: alice });
    const balance = await appChain.query.runtime.Balances.balances.get(key);

    expect(block?.transactions[0].status.toBoolean()).toBe(true);
    expect(balance?.toBigInt()).toBe(1000n);
  }, 1_000_000);
});
