import { KeyBox } from "./key-box";
import { Balance } from "@proto-kit/library";
import { Balances } from "./balances";
import { ModulesConfig } from "@proto-kit/common";

export const modules = {
  Balances,

  KeyBox,
};

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
  KeyBox: {
  },
};

export default {
  modules,
  config,
};
