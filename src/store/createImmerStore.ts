import { deepEqual } from "fast-equals";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import { StateCreator } from "zustand/vanilla";

export function createImmerStore<T>(
  creator: StateCreator<T, [["zustand/immer", never]], []>,
) {
  return createWithEqualityFn<T, [["zustand/immer", never]]>(
    immer(creator),
    deepEqual,
  );
}
