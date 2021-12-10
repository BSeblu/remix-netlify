export type Error<T> = {
  [Property in keyof T]?: boolean
};
