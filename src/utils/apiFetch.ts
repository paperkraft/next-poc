export interface ApiStatus {
    success: boolean;
    code: number;
}

export interface ApiResponse<T> {
    status: ApiStatus;
    message: string;
    data: T;
}

export interface ApiFetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: HeadersInit;
    errorMessage?: string;
    fullResponse?: boolean;
}

// Function overloads
export async function apiFetch<T>(path: string, options: ApiFetchOptions & { fullResponse: true }): Promise<ApiResponse<T>>;
export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T>;

// Implementation
export async function apiFetch<T>(
    path: string,
    options: ApiFetchOptions = {}
): Promise<T | ApiResponse<T>> {
    const {
        method = 'GET',
        body,
        headers = {},
        errorMessage = 'Something went wrong',
        fullResponse = false,
    } = options;

    const res = await fetch(`${path}`, {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errorResponse = await res.json().catch(() => null);
        const apiMessage = errorResponse?.message;
        throw new Error(apiMessage || errorMessage);
    }

    const json = (await res.json()) as ApiResponse<T>;
    return fullResponse ? json : json.data;
};