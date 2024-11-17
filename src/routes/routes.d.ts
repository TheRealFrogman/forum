import { IncomingMessage, ServerResponse } from "http";
import { OutgoingHttpHeaders } from "http2";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "CONNECT" | "TRACE";

type EndpointResult = { statusCode: number, statusMessage?: string, responseModel?: object | null, headers?: OutgoingHttpHeaders }
type MaybePromise<T> = Promise<T> | T
interface MyRequestListener {
   (request: IncomingMessage): MaybePromise<EndpointResult>;
}
export type Routes<Routes extends `/${string}`> = { [key in Routes]: { [key in Method]?: MyRequestListener } }
