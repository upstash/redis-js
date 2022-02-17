export type UpstashResponse<TResult> = {
  result?: TResult
  error?: string
}

export type NonEmptyArray<T> = [T, ...T[]]

export type CommandArgs<TCommand extends new (...args: any) => any> =
  ConstructorParameters<TCommand>

/**
 * Ensures a tuple is of an exact length
 *
 * @author https://github.com/alii
 */
export type TupleOfLength<T, L extends number, R extends T[] = []> = R["length"] extends L
  ? R
  : TupleOfLength<T, L, [...R, T]>
