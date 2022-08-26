/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<never, never>,
    Record<never, never>,
    any
  >;
  export default component;
}
