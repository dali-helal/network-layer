import axios, {AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, RawAxiosRequestHeaders} from 'axios';
import { IRequestBuilderConfig, MethodsHeaders } from "./types/ApiTypes.ts";
import { baseURL } from "./extra/constants.ts";
import NotificationService from "../utils/Notification.ts";
/**
 * Class to handle API service requests
 * @class ServiceApi
 */
class ServiceApi {
    public static instance: ServiceApi;
    private axiosInstance: AxiosInstance;
    private baseUrl: string = baseURL;

    /**
     * Constructor for ServiceApi class
     * @constructor
     */
    public constructor() {
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors
     * @private
     */
    private setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(config => {
            // Add any request interceptors here
            return config;
        });

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            response => {
                // Add any response interceptors here
                return response;
            },
            error => {
                if (error.response && error.response.status === 401) {
                    this.handleUnauthorizedError()
                }
                this.handleError(error)
                return Promise.reject(error);
            }
        );
    }

    /**
     * Singleton pattern to ensure only one instance of ServiceApi exists
     * @returns {ServiceApi} - The instance of ServiceApi
     */
    public static getInstance(): ServiceApi {
        if (!ServiceApi.instance) {
            ServiceApi.instance = new ServiceApi();
        }
        return ServiceApi.instance;
    }

    /**
     * Method to invoke API requests.
     * @param {IRequestBuilderConfig} requestBuilderConfig - An object containing request parameters such as method, URL, headers, data, and configuration.
     * @returns {Promise<TData>} - A Promise that resolves with the response data.
     */
    async invoke<TData>(requestBuilderConfig: IRequestBuilderConfig): Promise<TData> {
        const {
            method,
            endPoint,
            pathParams,
            queryParams,
            requestData,
            config,
            headers,
            secure = true,
        } = requestBuilderConfig;

        // Build the final URL
        const finalUrl:string = this.buildUrl(this.baseUrl, endPoint, pathParams, queryParams);

        // Merge headers
        const finalHeaders = {
            ...this.axiosInstance.defaults.headers,
            ...headers,
        } as (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;

        // Add Authorization header if secure is true
        if (secure) {
            const token: string | null = localStorage.getItem("ACCESS_TOKEN");
            if (token) {
                finalHeaders['Authorization'] = `Bearer ${token}`;
            } else {
                // Handle missing token scenario
                throw new Error('Authorization token is missing');
            }
        }

        // Make the request using Axios
        const response: AxiosResponse<TData> = await this.axiosInstance.request({
            method,
            url: finalUrl,
            data: requestData,
            headers: finalHeaders,
            ...config,
        });

        // Return the response data
        return response.data;
    }

    /**
     * Method to build the final URL for the request.
     * @param {string} baseUrl - The base URL for the API request.
     * @param {string} [endPoint] - Sub-prefix URL to be appended to the base URL.
     * @param {Record<string, string | number>} [pathParams] - Path parameters to be replaced in the URL.
     * @param {Record<string, string | number>} [queryParams] - Query parameters to be appended to the URL.
     * @returns {string} - The final URL for the request.
     */
    private buildUrl(
        baseUrl: string,
        endPoint?: string,
        pathParams?: Record<string, string | number>,
        queryParams?: Record<string, string | number>,
    ): string {
        let finalUrl = baseUrl;

        // Append sub-prefix URL if provided
        if (endPoint) {
            finalUrl += endPoint.startsWith('/') ? endPoint : `/${endPoint}`;
        }

        // Replace path parameters in the URL
        if (pathParams) {
            Object.entries(pathParams).forEach(([param, value]) => {
                finalUrl = finalUrl.replace(`:${param}`, String(value));
            });
        }

        // Append query parameters to the URL
        if (queryParams) {
            const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
            finalUrl += `?${queryString}`;
        }

        return finalUrl;
    }
    // Handles unauthorized errors by clearing user data and showing a modal.
    private handleUnauthorizedError() {
        // Clear any user data and tokens
        localStorage.removeItem('ACCESS_TOKEN');
    }

    // Handles generic errors by showing an error notification.
    // @param {AxiosError} error - The AxiosError object representing the error.
    private handleError(error: AxiosError) {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.response && error.response.data && (error.response.data as any).message) {
            errorMessage = (error.response.data as any).message;
        }
        // Show an error notification to the user
        NotificationService.showError(errorMessage);
    }
}

export default ServiceApi;
