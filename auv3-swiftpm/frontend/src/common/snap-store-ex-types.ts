export type SnapStoreSetterFn<T> = (value: T | ((prev: T) => T)) => void;
export type SnapStorePatchFn<T> = (
  arg: Partial<T> | ((prev: T) => Partial<T>),
) => void;
