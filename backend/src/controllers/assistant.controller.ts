import { APIS } from '@/config';
import {
  AssistantPublic as AssistantPublicInterface,
  CursorPaginatedResponseSessionMetadataPublic as CursorPaginatedResponseSessionMetadataPublicInterface,
  PaginatedResponseAssistantPublic as PaginatedResponseAssistantPublicInterface,
  PartialAssistantUpdatePublic,
  SessionPublic as SessionPublicInterface,
} from '@/data-contracts/intric/data-contracts';
import { UpdateAssistantDto } from '@/dtos/assistant.dto';
import applicationModeMiddleware from '@/middlewares/application-mode.middleware';
import hashMiddleware from '@/middlewares/hash.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { AssistantPublic, PaginatedResponseAssistantPublic } from '@/responses/intric/assistant.response';
import { CursorPaginatedResponseSessionMetadataPublic, SessionPublic } from '@/responses/intric/session.response';
import ApiService from '@/services/api.service';
import { getApiKey } from '@/services/intric-api-key.service';
import { logger } from '@/utils/logger';
import { Request, Response } from 'express';
import { Body, Controller, Delete, Get, HttpError, Param, Post, QueryParam, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@UseBefore(applicationModeMiddleware)
@Controller()
export class AssistantController {
  private apiService = new ApiService();
  private api = APIS.find(api => api.name === 'eneo/sundsvall');
  private basePath = `${this.api.name}/${this.api.version}/api/v1`;

  @Get('/assistants')
  @OpenAPI({
    summary: 'Get assitants from Intric',
  })
  @ResponseSchema(PaginatedResponseAssistantPublic)
  @UseBefore(hashMiddleware)
  async get_assistants(
    @Req() req,
    @Res() response: Response<PaginatedResponseAssistantPublicInterface>,
  ): Promise<Response<PaginatedResponseAssistantPublicInterface>> {
    const url = `${this.basePath}/assistants/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.get<PaginatedResponseAssistantPublicInterface>(url, { headers: { 'api-key': apiKey } });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting assistants: ', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Could not get assistants');
    }
  }

  @Get('/assistants/batch')
  @OpenAPI({
    summary: 'Batch get assitants from Intric',
  })
  @UseBefore(hashMiddleware)
  @ResponseSchema(PaginatedResponseAssistantPublic)
  async batch_get_assistants_by_id(
    @Req() req,
    @QueryParam('id', { required: true, isArray: true }) ids: string[],
    @Res() response: Response<PaginatedResponseAssistantPublicInterface>,
  ): Promise<Response<PaginatedResponseAssistantPublicInterface>> {
    const url = `${this.basePath}/assistants/`;
    const apiKey = await getApiKey(req);
    const items: AssistantPublicInterface[] = [];
    if (!ids || ids.length === 0) {
      throw new HttpError(400, 'No ids provided');
    }
    for (let index = 0; index < ids.length; index++) {
      try {
        const res = await this.apiService.get<AssistantPublicInterface>(`${url}${ids[index]}`, { headers: { 'api-key': apiKey } });
        if (res) {
          items.push(res.data);
        }
      } catch (e) {
        logger.error(e);
      }
    }

    if (items.length === 0) {
      throw new HttpError(404, 'No assistants found');
    }

    return response.send({ count: items.length, items });
  }

  @Get('/assistants/:id')
  @OpenAPI({
    summary: 'Get assitant from Intric',
  })
  @UseBefore(hashMiddleware)
  @ResponseSchema(AssistantPublic)
  async get_assistant_by_id(
    @Req() req,
    @Param('id') id: string,
    @Res() response: Response<AssistantPublicInterface>,
  ): Promise<Response<AssistantPublicInterface>> {
    const url = `${this.basePath}/assistants/${id}`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.get<AssistantPublicInterface>(url, { headers: { 'api-key': apiKey } });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting assistant: ', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Could not get assistant');
    }
  }

  @Post('/assistants/:id')
  @OpenAPI({
    summary: 'Update Intric assistant',
  })
  @UseBefore(hashMiddleware)
  @UseBefore(validationMiddleware(UpdateAssistantDto, 'body'))
  @ResponseSchema(AssistantPublic)
  async update_assistant(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateAssistantDto,
    @Res() response: Response<AssistantPublicInterface>,
  ): Promise<Response<AssistantPublicInterface>> {
    const url = `${this.basePath}/assistants/${id}/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.post<AssistantPublicInterface, PartialAssistantUpdatePublic>(url, body, {
        headers: { 'api-key': apiKey },
      });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error updating assistant: ', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Could not update assistant');
    }
  }

  @Delete('/assistants/:id')
  @OpenAPI({
    summary: 'Delete Intric assistant',
  })
  @UseBefore(hashMiddleware)
  async delete_assistant(@Req() req: Request, @Param('id') id: string, @Res() response: Response): Promise<Response> {
    const url = `${this.basePath}/assistants/${id}/`;
    const apiKey = await getApiKey(req);
    try {
      await this.apiService.delete<AssistantPublic>(url, { headers: { 'api-key': apiKey } });
      return response.send();
    } catch (e) {
      logger.error('Error deleting assistant: ', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Could not delete assistant');
    }
  }

  @Get('/assistants/:id/sessions')
  @OpenAPI({
    summary: 'Get sessions from Intric assistant',
  })
  @UseBefore(hashMiddleware)
  @ResponseSchema(CursorPaginatedResponseSessionMetadataPublic)
  async get_assistant_sessions(
    @Req() req,
    @Param('id') id: string,
    @Res() response: Response<CursorPaginatedResponseSessionMetadataPublicInterface>,
  ): Promise<Response<CursorPaginatedResponseSessionMetadataPublicInterface>> {
    const url = `${this.basePath}/assistants/${id}/sessions/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.get<CursorPaginatedResponseSessionMetadataPublicInterface>(url, { headers: { 'api-key': apiKey } });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting assistant sessions: ', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Could not get assistant sessions');
    }
  }

  @Get('/assistants/:id/sessions/:session_id')
  @OpenAPI({
    summary: 'Get session from Intric assistant',
  })
  @UseBefore(hashMiddleware)
  @ResponseSchema(SessionPublic)
  async get_assistant_session(
    @Req() req,
    @Param('id') id: string,
    @Param('session_id') session_id: string,
    @Res() response: Response<SessionPublicInterface>,
  ): Promise<Response<SessionPublicInterface>> {
    const url = `${this.basePath}/assistants/${id}/sessions/${session_id}`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.get<SessionPublicInterface>(url, { headers: { 'api-key': apiKey } });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting session: ', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Could not get session');
    }
  }
}
