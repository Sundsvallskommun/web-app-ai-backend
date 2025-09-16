import { APIS } from '@/config';
import { ApiKey } from '@/data-contracts/eneo-sundsvall/data-contracts';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { ApiKeyApiResponse } from '@/responses/apikey.response';
import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import prisma from '@/utils/prisma';
import adminMiddleware from '@middlewares/admin.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import { Response } from 'express';
import { Controller, Get, Param, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@UseBefore(authMiddleware)
@UseBefore(adminMiddleware)
@Controller()
export class AdminApiKeyController {
  private apiService = new ApiService();
  private api = APIS.find(api => api.name === 'eneo-sundsvall');
  private basePath = `${this.api.name}/${this.api.version}/api/v1`;

  @Get('/admin/apikey/:id')
  @OpenAPI({ summary: 'Get apikey for assistant' })
  @ResponseSchema(ApiKeyApiResponse)
  async getApiKey(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Res() response: Response<ApiKeyApiResponse>,
  ): Promise<Response<ApiKeyApiResponse>> {
    const { userId } = req.user;
    if (!userId) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      const { apiKey } = await prisma.userSettings.findFirst({ where: { userId } });

      if (!apiKey) {
        throw new HttpException(403, 'No private api key found');
      }

      const url = `${this.basePath}/assistants/${id}/api-keys/`;

      const res = await this.apiService.get<ApiKey>(url, { headers: { 'api-key': apiKey } });
      return response.send({ data: res.data.key, message: 'success' });
    } catch (e) {
      logger.error('Error getting api key for assistant', e);
      throw new HttpException(e?.httpCode ?? 500, e?.message ?? 'Could not get api key');
    }
  }
}
