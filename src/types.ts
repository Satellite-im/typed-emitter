export type SyncCallback = (...args: any[]) => void;
export type AsyncCallback = (...args: any[]) => Promise<void>;
export type Callback = AsyncCallback | SyncCallback;

export type HasOnce<T extends Callback> = ReturnType<T> extends void
  ? false
  : boolean;

export interface Listener<T extends Callback> {
  fn: T;
  once: HasOnce<T>;
}
