import { IsOptional, IsString } from 'class-validator';
import { AssistantSetting as AssistantSettingInterface } from '../interfaces/assistant.interface';

export class CreateAssistantSetting implements AssistantSettingInterface {
  @IsString()
  app: string;
  @IsString()
  assistantId: string;
  @IsString()
  apiKey: string;
}

export class UpdateAssistantSetting implements AssistantSettingInterface {
  @IsString()
  app: string;
  @IsString()
  assistantId: string;
  @IsString()
  @IsOptional()
  apiKey: string;
}
