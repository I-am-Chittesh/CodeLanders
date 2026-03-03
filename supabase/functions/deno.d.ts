// Deno type definitions for TypeScript
declare const Deno: {
  env: {
    get(key: string): string | undefined;
    toObject(): Record<string, string>;
  };
  metrics(): { ops: Unknown; bytes: Unknown };
  build: {
    os: string;
    arch: string;
    target: string;
  };
};

declare const fetch: typeof globalThis.fetch;

// Request type - use RequestInfo type from Deno
declare type Request = globalThis.Request;
declare const Request: {
  prototype: globalThis.Request;
  new (input: RequestInfo | URL, init?: RequestInit): globalThis.Request;
};

declare type Response = globalThis.Response;
declare const Response: {
  prototype: globalThis.Response;
  new (body?: BodyInit, init?: ResponseInit): globalThis.Response;
  error(): globalThis.Response;
  redirect(url: string | URL, status?: number): globalThis.Response;
};

declare const Headers: typeof globalThis.Headers;
declare const URL: typeof globalThis.URL;
declare const URLSearchParams: typeof globalThis.URLSearchParams;
declare const console: typeof globalThis.console;
declare const JSON: typeof globalThis.JSON;
declare const Math: typeof globalThis.Math;
declare const Object: typeof globalThis.Object;
declare const Array: typeof globalThis.Array;
declare const String: typeof globalThis.String;
declare const Number: typeof globalThis.Number;
declare const Boolean: typeof globalThis.Boolean;
declare const Promise: typeof globalThis.Promise;
declare const Error: typeof globalThis.Error;
declare const RangeError: typeof globalThis.RangeError;
declare const TypeError: typeof globalThis.TypeError;
declare const SyntaxError: typeof globalThis.SyntaxError;

// Deno std library types
declare module "std/http/server.ts" {
  type Handler = (req: Request) => Response | Promise<Response>;
  export function serve(handler: Handler | { port?: number; hostname?: string; handler: Handler }): Promise<void>;
}

type Unknown = unknown;
type RequestInfo = Request | string;
type BodyInit = Blob | BufferSource | FormData | URLSearchParams | ReadableStream<Uint8Array> | string;
type ResponseInit = {
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
};
type HeadersInit = string[][] | Record<string, string>;
type RequestInit = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  cache?: string;
  credentials?: string;
  mode?: string;
  redirect?: string;
  referrer?: string;
  integrity?: string;
};

