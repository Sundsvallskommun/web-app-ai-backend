import { HttpException } from '@/exceptions/HttpException';
import { devconsole } from '@/utils/devconsole';
import { apiURL } from '@/utils/util';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import ApiTokenService from './api-token.service';

interface ApiResponse<T> {
  data: T;
  message: string;
}

class ApiService {
  private apiTokenService = new ApiTokenService();

  private resolveOrigin(req: Request): string | undefined {
    const originHeader = req.get('origin') ?? req.headers.origin;
    if (typeof originHeader === 'string' && originHeader.trim() !== '') {
      return originHeader;
    }

    const referer = req.get('referer');
    if (referer) {
      try {
        return new URL(referer).origin;
      } catch {
        // Ignore invalid referer and continue with fallback logic.
      }
    }

    const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim();
    const forwardedHost = req.get('x-forwarded-host')?.split(',')[0]?.trim();
    const host = forwardedHost ?? req.get('host');

    if (!host) {
      return undefined;
    }

    const protocol = forwardedProto ?? req.protocol;
    return `${protocol}://${host}`;
  }

  private withOriginHeader(req: Request, config: AxiosRequestConfig = {}): AxiosRequestConfig {
    const origin = this.resolveOrigin(req);
    if (!origin) {
      return config;
    }

    const existingHeaders = config.headers as Record<string, unknown> | undefined;
    if (existingHeaders?.origin || existingHeaders?.Origin) {
      return config;
    }

    return {
      ...config,
      headers: { ...(config.headers as Record<string, unknown> | undefined), origin },
    } as AxiosRequestConfig;
  }

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
      url: apiURL(config.url ?? ''),
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

  public async get<T>(url: string, req: Request, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
    devconsole.log('GET to url', url);
    return this.request<T>({ ...this.withOriginHeader(req, config), url, method: 'GET' });
  }

  public async post<T, D = any>(
    url: string,
    data: D,
    req: Request,
    config: AxiosRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    devconsole.log('POST to url', url);
    return this.request<T>({ ...this.withOriginHeader(req, config), url, data, method: 'POST' });
  }

  public async patch<T, D = any>(
    url: string,
    data: D,
    req: Request,
    config: AxiosRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    devconsole.log('PATCH to url', url);
    return this.request<T>({ ...this.withOriginHeader(req, config), url, data, method: 'PATCH' });
  }

  public async delete<T>(url: string, req: Request, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
    devconsole.log('DELETE to url', url);
    return this.request<T>({ ...this.withOriginHeader(req, config), url, method: 'DELETE' });
  }
}

export default ApiService;
