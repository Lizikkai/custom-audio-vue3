/// <reference types="vite/client" />

// Vue module declaration
declare module "vue" {
  export * from "@vue/runtime-dom";
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
