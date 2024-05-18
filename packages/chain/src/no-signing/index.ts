import { runtimeModule, state, runtimeMethod, RuntimeModule} from "@proto-kit/module";
import { State, assert } from "@proto-kit/protocol";
import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { Field, CircuitString, PublicKey, PrivateKey, Encryption, Experimental, Provable} from "o1js";
import { Pickles } from "o1js/dist/node/snarky";
import { dummyBase64Proof } from "o1js/dist/node/lib/proof_system";

const generate = (seed: CircuitString) => {

  // Transform seed to private key and pad it to 255 fields
  let seedFields = seed.toFields();
  const padding = Array(255 - seedFields.length).fill(Field(0));
  const paddedFields = seedFields.concat(padding).slice(0, 255);
  const privateKey = PrivateKey.fromFields(paddedFields);

  const message = privateKey.toFields();
  const publicKey = privateKey.toPublicKey()
  const encryptedPrivateKey = Encryption.encrypt(message, publicKey); // [Field] // 255
  return encryptedPrivateKey.cipherText;
};

const program = Experimental.ZkProgram({
  publicOutput: Provable.Array(Field, 255),
  methods: {
    generate: {
      privateInputs: [CircuitString],
      method: generate
    }
  }
})

class NoSignerProof extends Experimental.ZkProgram.Proof(program) {}

// // generate a dummy proof, to be used when testing the runtime method
// const [, dummy] = Pickles.proofOfBase64(await dummyBase64Proof(), 2);
// const publicInput = Field(0);
// const proof = new NoSignerProof({
//   proof: dummy,
//   publicOutput: generate(CircuitString.fromCharacters([])),
//   publicInput,
//   maxProofsVerified: 2,
// });

@runtimeModule()
export class NoSigning extends RuntimeModule<Record<string, never>> {
  // @state() public circulatingSupply = State.from<Balance>(Balance);


  @runtimeMethod()
  public generate(

    seed: CircuitString
  ): Field[] {
    return generate(seed);
  }

  @runtimeMethod()
  public verify(proof: NoSignerProof) {
    proof.verify();
  }

}
