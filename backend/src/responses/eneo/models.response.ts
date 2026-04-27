import {
  EmbeddingModelPublic as EmbeddingModelPublicInterface,
  TranscriptionModelPublic as TranscriptionModelPublicInterface,
  EmbeddingModelPublicLegacy as EmbeddingModelPublicLegacyInterface,
  CompletionModelSparse as CompletionModelSparseInterface,
  CompletionModel as CompletionModelInterface,
  CompletionModelPublic as CompletionModelPublicInterface,
} from '@/data-contracts/eneo-sundsvall/data-contracts';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DatesAndId, SecurityClassificationPublic, SecurityClassificationPublicInterface } from './common';

export class EmbeddingModelPublic extends DatesAndId implements EmbeddingModelPublicInterface {
  @IsString()
  name!: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  family?: string | null;
  @IsBoolean()
  is_deprecated!: boolean;
  @IsBoolean()
  open_source!: boolean;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  dimensions?: number | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  max_input?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  hf_link?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  stability?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  hosting?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  org?: string | null;
  @IsBoolean()
  can_access?: boolean;
  @IsBoolean()
  is_locked?: boolean;
  @IsBoolean()
  is_org_enabled?: boolean;
  @ValidateNested()
  @Type(() => SecurityClassificationPublic)
  @IsOptional()
  @IsNullable()
  security_classification?: SecurityClassificationPublicInterface | null;
}

export class TranscriptionModelPublic implements TranscriptionModelPublicInterface {
  @IsString()
  id!: string;
  @IsString()
  name!: string;
  @IsString()
  nickname!: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  family?: string | null;
  @IsBoolean()
  is_deprecated!: boolean;
  @IsString()
  @IsOptional()
  @IsNullable()
  stability?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  hosting?: string | null;
  @IsBoolean()
  @IsOptional()
  @IsNullable()
  open_source?: boolean;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  hf_link?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  org?: string | null;
  @IsBoolean()
  @IsOptional()
  can_access?: boolean;
  @IsBoolean()
  @IsOptional()
  is_locked?: boolean;
  @IsBoolean()
  @IsOptional()
  is_org_enabled?: boolean;
  @IsBoolean()
  @IsOptional()
  is_org_default?: boolean;
  @ValidateNested()
  @Type(() => SecurityClassificationPublic)
  @IsOptional()
  @IsNullable()
  security_classification?: SecurityClassificationPublicInterface | null;
}

export class EmbeddingModelPublicLegacy extends DatesAndId implements EmbeddingModelPublicLegacyInterface {
  @IsString()
  name!: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  family?: string | null;
  @IsBoolean()
  is_deprecated!: boolean;
  @IsBoolean()
  open_source!: boolean;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  dimensions?: number | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  max_input?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  hf_link?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  stability?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  hosting?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  org?: string | null;
  @IsBoolean()
  @IsOptional()
  is_org_enabled?: boolean;
  @IsBoolean()
  @IsOptional()
  can_access?: boolean;
  @IsBoolean()
  @IsOptional()
  is_locked?: boolean;
}

export class CompletionModelSparse extends DatesAndId implements CompletionModelSparseInterface {
  @IsString()
  name!: string;
  @IsString()
  nickname!: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  family?: string | null;
  @IsNumber()
  max_input_tokens!: number;
  @IsNumber()
  max_output_tokens!: number;
  @IsNumber()
  token_limit!: number;
  @IsBoolean()
  is_deprecated!: boolean;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  nr_billion_parameters?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  hf_link?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  stability?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  hosting?: string | null;
  @IsBoolean()
  @IsOptional()
  @IsNullable()
  open_source?: boolean | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  deployment_name?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  org?: string | null;
  @IsBoolean()
  vision!: boolean;
  @IsBoolean()
  reasoning!: boolean;
  @IsString()
  @IsOptional()
  @IsNullable()
  base_url?: string | null;
}

export class CompletionModel extends CompletionModelSparse implements CompletionModelInterface {
  @IsBoolean()
  @IsOptional()
  is_org_enabled?: boolean;
  @IsBoolean()
  @IsOptional()
  is_org_default?: boolean;
}

export class CompletionModelPublic extends CompletionModel implements CompletionModelPublicInterface {
  @IsBoolean()
  @IsOptional()
  can_access?: boolean;
  @IsBoolean()
  @IsOptional()
  is_locked?: boolean;
  @ValidateNested()
  @Type(() => SecurityClassificationPublic)
  @IsOptional()
  @IsNullable()
  security_classification?: SecurityClassificationPublicInterface | null;
}
