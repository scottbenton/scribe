import { createWithEqualityFn } from "zustand/traditional";
import { immer } from "zustand/middleware/immer";
import { StateCreator } from "zustand/vanilla";
import { deepEqual } from "fast-equals";

export function createImmerStore<T>(
  creator: StateCreator<T, [["zustand/immer", never]], []>,
) {
  return createWithEqualityFn<T, [["zustand/immer", never]]>(
    immer(creator),
    deepEqual,
  );
}
