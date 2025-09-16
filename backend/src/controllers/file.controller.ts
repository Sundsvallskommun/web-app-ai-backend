import { APIS } from '@/config';
import {
  FilePublic as FilePublicInterface,
  PaginatedResponseFilePublic as PaginatedResponseFilePublicInterface,
} from '@/data-contracts/eneo-sundsvall/data-contracts';
import { UploadFileDto } from '@/dtos/file.dto';
import hashMiddleware from '@/middlewares/hash.middleware';
import { FilePublic, PaginatedResponseFilePublic } from '@/responses/eneo/file.response';
import ApiService from '@/services/api.service';
import { getApiKey } from '@/services/eneo-api-key.service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import { formDataFromMulterFiles } from '@/utils/formDataFromMulterFile';
import { logger } from '@/utils/logger';
import { Request, Response } from 'express';
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
  UploadedFile,
  UseBefore,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
export class FileController {
  private apiService = new ApiService();
  private api = APIS.find(api => api.name === 'eneo-sundsvall');
  private basePath = `${this.api.name}/${this.api.version}`;

  @Get('/files')
  @OpenAPI({
    summary: 'Get files',
  })
  @UseBefore(hashMiddleware)
  @ResponseSchema(PaginatedResponseFilePublic)
  async get_files(
    @Req() req: Request,
    @Res() response: Response<PaginatedResponseFilePublicInterface>,
  ): Promise<Response<PaginatedResponseFilePublicInterface>> {
    try {
      const url = `${this.basePath}/files/`;
      const apiKey = await getApiKey(req);
      const res = await this.apiService.get<PaginatedResponseFilePublicInterface>(url, {
        headers: { 'api-key': apiKey },
      });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting files', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Internal server error');
    }
  }

  @Get('/files/:id')
  @OpenAPI({
    summary: 'Get file',
  })
  @UseBefore(hashMiddleware)
  @ResponseSchema(FilePublic)
  async get_file(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() response: Response<FilePublicInterface>,
  ): Promise<Response<FilePublicInterface>> {
    try {
      const url = `${this.basePath}/files/${id}`;
      const apiKey = await getApiKey(req);
      const res = await this.apiService.get<FilePublicInterface>(url, { headers: { 'api-key': apiKey } });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error getting file', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Internal server error');
    }
  }

  @Post('/files')
  @OpenAPI({
    summary: 'Upload file',
  })
  @UseBefore(hashMiddleware)
  @ResponseSchema(FilePublic)
  async upload_file(
    @Req() req: Request,
    @Body() body: UploadFileDto,
    @UploadedFile('upload_file', { options: fileUploadOptions, required: true }) file: Express.Multer.File,
    @Res() response: Response<FilePublicInterface>,
  ): Promise<Response<FilePublicInterface>> {
    const data = formDataFromMulterFiles([file], 'upload_file');

    try {
      const url = `${this.basePath}/files/`;
      const apiKey = await getApiKey(req);
      const res = await this.apiService.post<FilePublicInterface, any>(url, data, {
        headers: { 'api-key': apiKey, Accept: 'multipart/form-data', 'Content-Type': 'multipart/form-data' },
      });
      return response.send(res.data);
    } catch (e) {
      logger.error('Error uploading file', e);
      throw new HttpError(e?.httpCode ?? 500, e?.message ?? 'Internal server error');
    }
  }

  @Delete('/files/:id')
  @OpenAPI({
    summary: 'Delete file',
  })
  @UseBefore(hashMiddleware)
  async delete_file(@Req() req: Request, @Param('id') id: string, @Res() response: Response): Promise<Response> {
    try {
      const url = `${this.basePath}/files/${id}/`;
      const apiKey = await getApiKey(req);
      const res = await this.apiService.delete(url, { headers: { 'api-key': apiKey } });
      if (res) {
        return response.send();
      }
    } catch (e) {
      logger.error('Error deleting file', e);
      throw new HttpError(e?.code ?? 500, e?.message ?? 'Internal server error');
    }
  }
}
