import { runtimeModule, state, runtimeMethod, RuntimeModule} from "@proto-kit/module";
import { State, assert } from "@proto-kit/protocol";
import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { Field, CircuitString, PublicKey, PrivateKey, Encryption } from "o1js";


@runtimeModule()
export class NoSigning extends RuntimeModule<Record<string, never>> {
  // @state() public circulatingSupply = State.from<Balance>(Balance);

  @runtimeMethod()
  public generate(

    seed: CircuitString
  ): Field[] {

    // Transform seed to private key and pad it to 255 fields
    let seedFields = seed.toFields();
    const padding = Array(255 - seedFields.length).fill(Field(0));
    const paddedFields = seedFields.concat(padding).slice(0, 255);
    const privateKey = PrivateKey.fromFields(paddedFields);

    const message = privateKey.toFields();
    const publicKey = privateKey.toPublicKey()
    const encryptedPrivateKey = Encryption.encrypt(message, publicKey); // [Field] // 255
    return encryptedPrivateKey.cipherText;
   
  }
}
