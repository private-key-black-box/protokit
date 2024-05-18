import { KeyBox } from "./key-box";
import { Balance } from "@proto-kit/library";
import { Balances } from "./balances";
import { ModulesConfig } from "@proto-kit/common";
import { NoSigning } from "./no-signing";

export const modules = {
  Balances,
  KeyBox,
  NoSigning,
};

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
  KeyBox: {
  },
  NoSigning: {
  },
};

export default {
  modules,
  config,
};
