import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from "@proto-kit/module";
import { StateMap, assert } from "@proto-kit/protocol";
import { PublicKey } from "o1js";
import { CheckIn } from "./box";

@runtimeModule()
export class KeyBox extends RuntimeModule<Record<string, never>> {
  @state() public checkIns = StateMap.from(PublicKey, CheckIn);
}