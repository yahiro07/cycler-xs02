export function raiseError(message: string): never {
  throw new Error(message);
}

export function raiseInvalidCondition(): never {
  throw new Error("Invalid condition");
}
