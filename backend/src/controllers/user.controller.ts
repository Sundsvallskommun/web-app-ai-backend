import { APIS, ENEO_BASEPATH } from '@/config';
import { UserPublic as UserPublicInterface } from '@/data-contracts/eneo-sundsvall/data-contracts';
import applicationModeMiddleware from '@/middlewares/application-mode.middleware';
import hashMiddleware from '@/middlewares/hash.middleware';
import { UserPublic } from '@/responses/eneo/user.response';
import ApiService from '@/services/api.service';
import { getApiKey } from '@/services/eneo-api-key.service';
import { logger } from '@/utils/logger';
import { Request, Response } from 'express';
import { Controller, Get, HttpError, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@UseBefore(applicationModeMiddleware)
@Controller()
export class UserController {
  private apiService = new ApiService();
  private api = APIS.find(api => api.name === 'eneo-sundsvall');
  private basePath = `${ENEO_BASEPATH || this.api.name}/${this.api.version}`;

  @Get('/users/me')
  @OpenAPI({
    summary: 'Get my user from Eneo',
  })
  @ResponseSchema(UserPublic)
  @UseBefore(hashMiddleware)
  async get_me(
    @Req() req: Request,
    @Res() response: Response<UserPublicInterface>,
  ): Promise<Response<UserPublicInterface>> {
    const url = `${this.basePath}/users/me/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.get<UserPublicInterface>(url, { headers: { 'api-key': apiKey } });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting user.', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Could not get user');
    }
  }
}
