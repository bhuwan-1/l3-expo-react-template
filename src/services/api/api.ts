import {
  ApiError,
  ApiRequestConfig,
  ApiResponse,
} from '@template/models/api.model';
import { API_METHODS } from '@template/models/constants/api-methods.constant';
import StorageService from '../storage/storage.service';

// Configuration
const API_BASE_URL = 'https://mock-server.free.beeceptor.com';
const TOKEN_STORAGE_KEY = 'auth_token';

const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await StorageService.getItem(TOKEN_STORAGE_KEY);
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const buildURL = (
  baseURL: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string => {
  const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`;

  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

const parseResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  // Handle empty responses (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  const hasContent = response.status !== 204 && response.status !== 205;
  let data: T;

  if (!hasContent) {
    data = null as unknown as T;
  } else {
    try {
      if (contentType?.includes('application/json')) {
        const text = await response.text();
        data = text ? (JSON.parse(text) as T) : (null as unknown as T);
      } else {
        data = (await response.text()) as unknown as T;
      }
    } catch {
      data = null as unknown as T;
    }
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
};

const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout);
  });
};

const handleError = async (response: Response): Promise<never> => {
  let errorData: unknown;
  const contentType = response.headers.get('content-type');

  try {
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = await response.text();
    }
  } catch {
    errorData = null;
  }

  const error: ApiError = {
    message: response.statusText || 'An error occurred',
    status: response.status,
    statusText: response.statusText,
    data: errorData,
  };

  throw error;
};

const request = async <T>(
  endpoint: string,
  method: string,
  config: ApiRequestConfig = {},
  baseURL: string = API_BASE_URL
): Promise<ApiResponse<T>> => {
  const {
    params,
    skipAuth = false,
    timeout = 30000,
    headers: customHeaders = {},
    ...fetchConfig
  } = config;

  // Build URL with query parameters
  const url = buildURL(baseURL, endpoint, params);

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Add authentication token if not skipped
  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  // Prepare request config
  const requestConfig: RequestInit = {
    method,
    headers,
    ...fetchConfig,
  };

  try {
    // Create request with timeout
    const requestPromise = fetch(url, requestConfig);
    const timeoutPromise = createTimeoutPromise(timeout);

    const response = await Promise.race([requestPromise, timeoutPromise]);

    // Handle non-ok responses
    if (!response.ok) {
      await handleError(response);
    }

    // Parse response
    const apiResponse = await parseResponse<T>(response);
    return apiResponse;
  } catch (error) {
    if (error instanceof Error && error.message === 'Request timeout') {
      throw {
        message: 'Request timeout',
        status: 408,
      } as ApiError;
    }

    // Network or other errors
    throw {
      message:
        error instanceof Error ? error.message : 'Network error occurred',
      status: 0,
    } as ApiError;
  }
};

const api = {
  setAuthToken: async (token: string): Promise<void> => {
    try {
      await StorageService.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  },

  clearAuthToken: async (): Promise<void> => {
    try {
      await StorageService.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  },

  get: async <T = unknown>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, API_METHODS.GET, config);
  },

  post: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const headers: HeadersInit =
      data instanceof FormData ? {} : { 'Content-Type': 'application/json' };

    return request<T>(endpoint, API_METHODS.POST, {
      ...config,
      body,
      headers: {
        ...headers,
        ...config?.headers,
      },
    });
  },

  put: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const headers: HeadersInit =
      data instanceof FormData ? {} : { 'Content-Type': 'application/json' };

    return request<T>(endpoint, API_METHODS.PUT, {
      ...config,
      body,
      headers: {
        ...headers,
        ...config?.headers,
      },
    });
  },

  delete: async <T = unknown>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, API_METHODS.DELETE, config);
  },

  patch: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const headers: HeadersInit =
      data instanceof FormData ? {} : { 'Content-Type': 'application/json' };

    return request<T>(endpoint, 'PATCH', {
      ...config,
      body,
      headers: {
        ...headers,
        ...config?.headers,
      },
    });
  },
};

export default {
  setAuthToken: api.setAuthToken,
  clearAuthToken: api.clearAuthToken,
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
  patch: api.patch,
};
