import { z } from "zod";

/**
 * Adds Zod issues for every duplicate value found in the array.
 *
 * @param data  – the array being validated
 * @param ctx   – Zod refinement context
 * @param keys  – array of field names that must be unique (e.g. ["phone", "email"])
 * @param msgs  – optional map field→message (fallback = "Duplicate value")
 */
export function validateUniqueFields<T extends Record<string, any>>(
  data: T[],
  ctx: z.RefinementCtx,
  keys: (keyof T)[],
  msgs: Partial<Record<keyof T, string>> = {}
): void {
  keys.forEach((key) => {
    const seen = new Map<any, number>();        // value → first index
    data.forEach((item, idx) => {
      const val = item[key];
      if (val == null) return;                  // ignore undefined / null
      if (seen.has(val)) {
        const firstIdx = seen.get(val)!;
        [firstIdx, idx].forEach((i) =>
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [i, key as string],           // arrayIndex.fieldName
            message: msgs[key] ?? "Duplicate value",
          })
        );
      } else {
        seen.set(val, idx);
      }
    });
  });
}