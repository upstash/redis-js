export type CommandArgs<TCommand extends new (...args: any) => any> =
  ConstructorParameters<TCommand>[0];
