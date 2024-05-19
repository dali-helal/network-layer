import { AxiosHeaders, AxiosRequestConfig, Method, RawAxiosRequestHeaders } from "axios";

// Define the HTTP methods that can be used in the requests
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Define a type for the headers, allowing partial customization for each HTTP method
export type MethodsHeaders = Partial<{
    [Key in Method as Lowercase<Key>]: AxiosHeaders;
} & {common: AxiosHeaders}>;

// Interface for the configuration of an HTTP request
export interface IRequestBuilderConfig {
    method: RequestMethod;                         // HTTP method for the request
    endPoint?: string;                             // EndPoint URL to be appended to the base URL
    pathParams?: Record<string, string | number>;  // Path parameters to be replaced in the URL
    queryParams?: Record<string, string>;          // Query parameters to be appended to the URL
    headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders; // Custom headers for the request
    requestData?: unknown;                         // Request body data
    config?: AxiosRequestConfig;                   // Additional Axios request configuration
    secure?: boolean;                              // Flag to indicate if the route is private
}
