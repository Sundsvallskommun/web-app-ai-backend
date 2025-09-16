import { APIS } from '@/config';
import {
  CollectionPublic as CollectionPublicInterface,
  CollectionUpdate,
  InfoBlobUpsertRequest,
  JobPublic as JobPublicInterface,
  PaginatedResponseInfoBlobPublic as PaginatedResponseInfoBlobPublicInterface,
  PaginatedResponseInfoBlobPublicNoText as PaginatedResponseInfoBlobPublicNoTextInterface,
} from '@/data-contracts/eneo-sundsvall/data-contracts';
import { UpdateGroupDto } from '@/dtos/group.dto';
import { UpdateInfoBlobsDto } from '@/dtos/info-blob.dto';
import applicationModeMiddleware from '@/middlewares/application-mode.middleware';
import hashMiddleware from '@/middlewares/hash.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { CollectionPublic } from '@/responses/eneo/group.response';
import {
  JobPublic,
  PaginatedResponseInfoBlobPublic,
  PaginatedResponseInfoBlobPublicNoText,
} from '@/responses/eneo/info-blob.response';
import ApiService from '@/services/api.service';
import { getApiKey } from '@/services/eneo-api-key.service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import { formDataFromMulterFiles } from '@/utils/formDataFromMulterFile';
import { logger } from '@/utils/logger';
import { Request, Response } from 'express';
import FormData from 'form-data';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpError,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseBefore,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@UseBefore(applicationModeMiddleware)
@Controller()
export class GroupController {
  private apiService = new ApiService();
  private api = APIS.find(api => api.name === 'eneo-sundsvall');
  private basePath = `${this.api.name}/${this.api.version}`;

  @Get('/groups/:id')
  @OpenAPI({
    summary: 'Get group',
  })
  @ResponseSchema(CollectionPublic)
  @UseBefore(hashMiddleware)
  async get_group_by_id(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() response: Response<CollectionPublicInterface>,
  ): Promise<Response<CollectionPublicInterface>> {
    const url = `${this.basePath}/groups/${id}/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.get<CollectionPublicInterface>(url, { headers: { 'api-key': apiKey } });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting group:', e);
      throw new HttpError(e?.httpCode ?? 500, 'Server error');
    }
  }

  @Post('/groups/:id')
  @OpenAPI({
    summary: 'Update group',
  })
  @ResponseSchema(CollectionPublic)
  @UseBefore(hashMiddleware)
  @UseBefore(validationMiddleware(UpdateGroupDto, 'body'))
  async update_group(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateGroupDto,
    @Res() response: Response<CollectionPublicInterface>,
  ): Promise<Response<CollectionPublicInterface>> {
    const url = `${this.basePath}/groups/${id}/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.post<CollectionPublicInterface, CollectionUpdate>(url, body, {
        headers: { 'api-key': apiKey },
      });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error updating group:', e);
      throw new HttpError(e?.httpCode ?? 500, 'Server error');
    }
  }

  @Delete('/groups/:id')
  @OpenAPI({
    summary: 'Delete group',
  })
  @UseBefore(hashMiddleware)
  async delete_group(@Req() req: Request, @Param('id') id: string, @Res() res: Response): Promise<Response> {
    const url = `${this.basePath}/groups/${id}/`;
    const apiKey = await getApiKey(req);
    try {
      await this.apiService.delete(url, { headers: { 'api-key': apiKey } });
      return res.send();
    } catch (e) {
      logger.error('Error deleting group:', e);
      throw new HttpError(e?.httpCode ?? 500, 'Server error');
    }
  }

  @Get('/groups/:id/info-blobs')
  @OpenAPI({
    summary: 'Get infoblobs for group',
  })
  @ResponseSchema(PaginatedResponseInfoBlobPublicNoText)
  @UseBefore(hashMiddleware)
  async get_group_infoblobs(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() response: Response<PaginatedResponseInfoBlobPublicNoTextInterface>,
  ): Promise<Response<PaginatedResponseInfoBlobPublicNoTextInterface>> {
    const url = `${this.basePath}/groups/${id}/info-blobs/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.get<PaginatedResponseInfoBlobPublicNoTextInterface>(url, {
        headers: { 'api-key': apiKey },
      });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting group info blobs:', e);
      throw new HttpError(e?.httpCode ?? 500, 'Server error');
    }
  }

  @Post('/groups/:id/info-blobs')
  @OpenAPI({
    summary: 'Add info blob to a group',
  })
  @ResponseSchema(PaginatedResponseInfoBlobPublic)
  @UseBefore(hashMiddleware)
  @UseBefore(validationMiddleware(UpdateInfoBlobsDto, 'body'))
  async add_group_infoblobs(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateInfoBlobsDto,
    @Res() response: Response<PaginatedResponseInfoBlobPublicInterface>,
  ): Promise<Response<PaginatedResponseInfoBlobPublicInterface>> {
    const url = `${this.basePath}/groups/${id}/info-blobs/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.post<PaginatedResponseInfoBlobPublicInterface, InfoBlobUpsertRequest>(
        url,
        body,
        {
          headers: { 'api-key': apiKey },
        },
      );
      return response.send(res.data);
    } catch (e) {
      logger.error('Error adding group info blobs:', e);
      throw new HttpError(e?.httpCode ?? 500, 'Server error');
    }
  }

  @Post('/groups/:id/info-blobs/upload-files')
  @OpenAPI({
    summary: 'Upload a file to a group',
  })
  @ResponseSchema(JobPublic)
  @UseBefore(hashMiddleware)
  async upload_files(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
    @Res() response: Response<JobPublicInterface>,
  ): Promise<Response<JobPublicInterface>> {
    if (!files || files.length < 1) {
      logger.error('Trying to save attachment without name or data');
      throw new Error('File missing');
    }
    const data = formDataFromMulterFiles(files, 'files');

    const url = `${this.basePath}/groups/${id}/info-blobs/upload-files/`;
    const apiKey = await getApiKey(req);
    try {
      const res = await this.apiService.post<JobPublicInterface, FormData>(url, data, {
        headers: { 'Content-Type': 'multipart/form-data', 'api-key': apiKey },
      });

      return response.send(res.data);
    } catch (e) {
      logger.error('Error uploading files:', e);
      throw new HttpError(e?.httpCode ?? 500, 'Server error');
    }
  }
}
