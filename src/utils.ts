import { AsyncCallback, Callback } from "./types";

export function isAsync(fn: Callback): fn is AsyncCallback {
  return typeof fn === "function" && fn.constructor.name === "AsyncFunction";
}
