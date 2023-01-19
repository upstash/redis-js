export type CommandArgs<TCommand extends new (...args: any) => any> =
  ConstructorParameters<TCommand>[0];

export type Telemetry = {
  /**
   * Upstash-Telemetry-Sdk
   * @example @upstash/redis@v1.1.1
   */
  sdk?: string;

  /**
   * Upstash-Telemetry-Platform
   * @example cloudflare
   */
  platform?: string;

  /**
   * Upstash-Telemetry-Runtime
   * @example node@v18
   */
  runtime?: string;
};
