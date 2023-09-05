type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<SnakeToCamel<U>>}`
  : Lowercase<S>;

type ConvertKeysToCamel<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K];
};

export const snakeToCamel = <T extends Record<string, any>>(snake: T): ConvertKeysToCamel<T> => {
  const data = Object.entries(snake);
  const result: Partial<ConvertKeysToCamel<T>> = {};

  for (const [key, value] of data) {
    const camelKey = key.replace(/(_\w)/g, (match) =>
      match[1].toUpperCase(),
    ) as keyof ConvertKeysToCamel<T>;
    result[camelKey] = value;
  }

  return result as unknown as ConvertKeysToCamel<T>;
};

type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Lowercase<T>}${CamelToSnake<U>}`
    : `${Lowercase<T>}_${Lowercase<CamelToSnake<U>>}`
  : Lowercase<S>;

type ConvertKeysToSnake<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K];
};

export const camelToSnake = <T extends Record<string, any>>(camel: T): ConvertKeysToSnake<T> => {
  const data = Object.entries(camel);
  const result: Partial<ConvertKeysToSnake<T>> = {};

  for (const [key, value] of data) {
    // You can replace this logic with your own camel-to-snake logic
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`,
    ) as keyof ConvertKeysToSnake<T>;
    result[snakeKey] = value;
  }

  return result as unknown as ConvertKeysToSnake<T>;
};
