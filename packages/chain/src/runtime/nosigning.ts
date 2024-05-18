import {
  runtimeMethod,
  RuntimeModule,
  runtimeModule,
} from "@proto-kit/module";
import { inject } from "tsyringe";

import {
  CircuitString,
  Encryption,
  Experimental,
  Field,
  PublicKey,
  PrivateKey,
  Provable,
  Struct,
} from "o1js";
import { MAX_TOKEN_ID, TokenRegistry } from "./token-registry";
import { Balances } from "./balances";
import { UInt64 } from "@proto-kit/library";



export class TokenId extends Field {}
export class BalancesKey extends Struct({
  tokenId: TokenId,
  address: PublicKey,
}) {
  public static from(tokenId: TokenId, address: PublicKey) {
    return new BalancesKey({ tokenId, address });
  }
}

export class Balance extends UInt64 {}

const generate = (seed: CircuitString) => {
  // Transform seed to private key and pad it to 255 fields
  let seedFields = seed.toFields();
  const padding = Array(255 - seedFields.length).fill(Field(0));
  const paddedFields = seedFields.concat(padding).slice(0, 255);

  // console.log(`paddedFields length: ${paddedFields.length}`);
  const privateKey = PrivateKey.fromFields(paddedFields);

  const message = privateKey.toFields();
  const publicKey = privateKey.toPublicKey();
  const encryptedPrivateKey = Encryption.encrypt(message, publicKey); // [Field] // 255
  // let cipherText = encryptedPrivateKey.cipherText;
  // console.log(`cipherText: ${cipherText.length}`);

  // slicing the last byte off doesn't work
  // return encryptedPrivateKey.cipherText.slice(0,255);
  return encryptedPrivateKey.cipherText;
};

const MyProgram = Experimental.ZkProgram({
  publicOutput: Provable.Array(Field, 255),
  methods: {
    generate: {
      privateInputs: [CircuitString],
      method: generate,
    },
  },
});

export class NoSignerProof extends Experimental.ZkProgram.Proof(MyProgram) { }
// let NoSignerProof = ZkProgram.Proof(MyProgram);

// console.log(`program digest: ${MyProgram.digest()}`);

let { verificationKey } = await MyProgram.compile();

// console.log('verification key', verificationKey.data.slice(0, 10) + '..');
// console.log(`verification key ${verificationKey}`);
//
// let proof = await MyProgram.generate(CircuitString.fromString("test"));
// // proof = await testJsonRoundtrip(NoSignerProof, proof);
//
// console.log("verify...");
// let ok = await MyProgram.verify(proof);
// console.log("ok?", ok);

// generate a dummy proof, to be used when testing the runtime method
// const [, dummy] = Pickles.proofOfBase64(Pickles.dummyBase64Proof(), 2);
const publicInput = undefined;
const proof = new NoSignerProof({
  proof: "dummy",
  publicInput,
  publicOutput: generate(CircuitString.fromString("test")),
  maxProofsVerified: 2,
});


// console.log(`proof: ${JSON.stringify(proof, null, 2)}`);

@runtimeModule()
export class NoSigning extends RuntimeModule<Record<string, never>> {
  // @state() public circulatingSupply = State.from<Balance>(Balance);

  public constructor(
    @inject("Balances") public balances: Balances,
    @inject("TokenRegistry") public tokenRegistry: TokenRegistry
  ) {
    super();
  }


  @runtimeMethod()
  public generate(
    seed: CircuitString,
  ): Field[] {
    return generate(seed);
  }


  @runtimeMethod()
  public transferWithProof(
    tokenId: TokenId,
    from: PublicKey,
    to: PublicKey,
    amount: Balance,
    proof: NoSignerProof,
  ) {
    // proof.verify();

    this.balances.transfer(tokenId, from, to, amount);
  }
  
  // @runtimeMethod()
  // public signTransaction(
  //   proof: Proof,
  // ): Field[] {
  //   return signTransaction(proof);
  // }


  // @runtimeMethod()
  // public verify(proof: NoSignerProof) {
  //   proof.verify();
  // }
}
