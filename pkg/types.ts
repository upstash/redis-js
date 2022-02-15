export type UpstashResponse<TResult> = {
  result?: TResult
  error?: string
}

export type NonEmptyArray<T> = [T, ...T[]]

export type CommandArgs<TCommand extends new (...args: any) => any> =
  ConstructorParameters<TCommand>
