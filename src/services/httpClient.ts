import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export interface HttpClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

export interface HttpError {
  code: string;
  message: string;
}

export interface HttpResponse<T = any> {
  success: boolean;
  data?: T;
  error?: HttpError;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });
  }

  private handleError(error: AxiosError): HttpResponse {
    console.error("HTTP Client Error:", error);

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return {
        success: false,
        error: {
          code: "TIMEOUT",
          message: "Request timed out. Please try again.",
        },
      };
    }

    if (!error.response) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message:
            "Unable to connect to the server. Please check your internet connection.",
        },
      };
    }

    const status = error.response.status;
    const errorData = error.response.data as any;

    if (status === 401 || status === 403) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message:
            "API key is invalid or missing. Please check your authentication.",
        },
      };
    }

    if (status === 429) {
      return {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message:
            "Too many requests. Please wait a moment before trying again.",
        },
      };
    }

    return {
      success: false,
      error: {
        code: "API_ERROR",
        message: errorData?.message || `Server error: ${status}`,
      },
    };
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return this.handleError(error);
      }
      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: "An unexpected error occurred. Please try again.",
        },
      };
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return this.handleError(error);
      }
      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: "An unexpected error occurred. Please try again.",
        },
      };
    }
  }

  setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  removeHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }
}
