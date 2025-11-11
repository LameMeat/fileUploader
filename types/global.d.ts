/// <reference types="react" />
/// <reference types="node" />
// Provide a minimal JSX runtime declaration so the TS language service can resolve `react/jsx-runtime`.
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props?: any, key?: any): any;
  export function jsxs(type: any, props?: any, key?: any): any;
  export const Fragment: any;
}

declare global {
  namespace JSX {
    // Use a permissive IntrinsicElements to avoid editor errors when JSX intrinsic elements are used.
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
