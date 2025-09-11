import { HttpException } from '@/exceptions/HttpException';
import { devconsole } from '@/utils/devconsole';
import { apiURL } from '@/utils/util';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import ApiTokenService from './api-token.service';

class ApiResponse<T> {
  data: T;
  message: string;
}

class ApiService {
  private apiTokenService = new ApiTokenService();
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const token = await this.apiTokenService.getToken();

    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const defaultParams = {};

    const preparedConfig: AxiosRequestConfig = {
      ...config,
      headers: { ...defaultHeaders, ...config.headers },
      params: { ...defaultParams, ...config.params },
      url: apiURL(config.url),
    };

    try {
      const res = await axios(preparedConfig);
      return { data: res.data, message: 'success' };
    } catch (error: unknown | AxiosError) {
      devconsole.log(error);
      if (axios.isAxiosError(error) && (error as AxiosError).response?.status === 404) {
        throw new HttpException(404, 'Not found');
      }
      // NOTE: did you subscribe to the API called?
      throw new HttpException(500, 'Internal server error from gateway');
    }
  }

  public async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
    devconsole.log('GET to url', url);
    return this.request<T>({ url, ...config, method: 'GET' });
  }

  public async post<T, D = any>(url: string, data: D, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
    devconsole.log('POST to url', url);
    return this.request<T>({ url, data, ...config, method: 'POST' });
  }

  public async patch<T, D = any>(url: string, data: D, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
    devconsole.log('PATCH to url', url);
    return this.request<T>({ url, data, ...config, method: 'PATCH' });
  }

  public async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
    devconsole.log('DELETE to url', url);
    return this.request<T>({ url, ...config, method: 'DELETE' });
  }
}

export default ApiService;
