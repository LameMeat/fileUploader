declare module 'qrcode';
declare module 'formidable';

// minimal react/jsx-runtime declaration to satisfy TS when types are missing
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props?: any, key?: any): any;
  export function jsxs(type: any, props?: any, key?: any): any;
  export function jsxDEV(type: any, props?: any, key?: any): any;
}

// minimal Buffer declaration if @types/node isn't available
declare var Buffer: {
  from(input: any, encoding?: string): any;
};

// jest globals
declare namespace NodeJS {
  interface Global {
    jest: any;
  }
}

declare var test: any;
declare var expect: any;
