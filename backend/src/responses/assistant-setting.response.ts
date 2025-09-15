import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AssistantSetting as AssistantSettingInterface } from '../interfaces/assistant.interface';
import { Type } from 'class-transformer';
import ApiResponse from '../interfaces/api-service.interface';

export class AssistantSetting implements AssistantSettingInterface {
  @IsInt()
  id: number;
  @IsString()
  app: string;
  @IsString()
  assistantId: string;
  @IsString()
  apiKey: string;
}

export class AssistantSettingsApiResponse implements ApiResponse<AssistantSettingInterface[]> {
  @ValidateNested({ each: true })
  @Type(() => AssistantSetting)
  data: AssistantSetting[];
  @IsString()
  message: string;
}

export class AssistantSettingApiResponse implements ApiResponse<AssistantSettingInterface> {
  @ValidateNested()
  @Type(() => AssistantSetting)
  data: AssistantSetting;
  @IsString()
  message: string;
}
