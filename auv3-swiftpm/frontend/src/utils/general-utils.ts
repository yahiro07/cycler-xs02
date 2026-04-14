export function assignFields<T extends object>(target: T, source: Partial<T>) {
  Object.assign(target, source);
}

export function filterObjectMembers<T extends object, K extends keyof T>(
  obj: T,
  referenceObject: T,
): Partial<Pick<T, K>> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key]) => referenceObject[key as K] !== undefined,
    ),
  ) as Partial<Pick<T, K>>;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
