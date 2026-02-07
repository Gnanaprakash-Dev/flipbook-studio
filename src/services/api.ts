/**
 * API Service
 *
 * Centralized HTTP client for backend communication.
 * All API calls go through this module for:
 * 1. Consistent error handling
 * 2. Base URL configuration
 * 3. Request/response interceptors (future: auth tokens)
 */

// Backend URL - from environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    // Don't set Content-Type for FormData (browser sets it with boundary)
  };

  // Only add JSON content-type for non-FormData bodies
  if (options.body && !(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Parse response
  const data = await response.json();

  // Check for errors
  if (!response.ok) {
    throw new ApiError(
      data.error || 'An error occurred',
      response.status,
      data
    );
  }

  return data;
}

/**
 * Magazine API Types
 */
export interface PageData {
  pageNumber: number;
  imageUrl: string;
  publicId: string;
  width: number;
  height: number;
}

export interface MagazineConfig {
  width: number;
  height: number;
  flipAnimation: 'hard' | 'soft' | 'fade' | 'vertical';
  flipSpeed: number;
  showShadow: boolean;
  shadowOpacity: number;
  pageLayout: 'single' | 'double';
  backgroundColor: string;
  showPageNumbers: boolean;
  navigationStyle: 'arrows' | 'thumbnails' | 'both' | 'none';
  autoPlay: boolean;
  autoPlayInterval: number;
}

export interface Magazine {
  id: string;
  _id: string;
  name: string;
  shareId: string;
  pdfUrl: string | null;
  pages: PageData[];
  totalPages: number;
  config: MagazineConfig;
  status: 'processing' | 'ready' | 'failed';
  createdAt: string;
  updatedAt: string;
  shareUrl?: string;
  thumbnail?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

/**
 * Magazine API Methods
 */
export const magazineApi = {
  /**
   * Upload PDF and create magazine
   *
   * @param file - PDF file to upload
   * @param onProgress - Upload progress callback (0-100)
   * @returns Created magazine
   */
  async upload(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<Magazine> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('pdf', file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && response.success) {
            resolve(response.data);
          } else {
            reject(new ApiError(response.error || 'Upload failed', xhr.status));
          }
        } catch (e) {
          reject(new ApiError('Failed to parse response', xhr.status));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new ApiError('Network error', 0));
      });

      // Send request
      xhr.open('POST', `${API_BASE_URL}/magazines/upload`);
      xhr.send(formData);
    });
  },

  /**
   * Get magazine by ID
   */
  async getById(id: string): Promise<Magazine> {
    const response = await fetchApi<ApiResponse<Magazine>>(`/magazines/${id}`);
    return response.data;
  },

  /**
   * Get magazine by share ID (public viewing)
   */
  async getByShareId(shareId: string): Promise<Magazine> {
    const response = await fetchApi<ApiResponse<Magazine>>(
      `/magazines/share/${shareId}`
    );
    return response.data;
  },

  /**
   * Get all magazines (paginated)
   */
  async getAll(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Magazine>> {
    return fetchApi<PaginatedResponse<Magazine>>(
      `/magazines?page=${page}&limit=${limit}`
    );
  },

  /**
   * Update magazine
   */
  async update(
    id: string,
    data: { name?: string; config?: Partial<MagazineConfig> }
  ): Promise<Magazine> {
    const response = await fetchApi<ApiResponse<Magazine>>(`/magazines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * Delete magazine
   */
  async delete(id: string): Promise<void> {
    await fetchApi(`/magazines/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Check magazine status (for polling during processing)
   */
  async getStatus(id: string): Promise<{
    id: string;
    name: string;
    shareId: string;
    status: 'processing' | 'ready' | 'failed';
    totalPages: number;
    errorMessage: string | null;
  }> {
    const response = await fetchApi<ApiResponse<{
      id: string;
      name: string;
      shareId: string;
      status: 'processing' | 'ready' | 'failed';
      totalPages: number;
      errorMessage: string | null;
    }>>(`/magazines/${id}/status`);
    return response.data;
  },
};

/**
 * Health check
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetchApi<{ status: string }>('/health');
    return response.status === 'ok';
  } catch {
    return false;
  }
};
