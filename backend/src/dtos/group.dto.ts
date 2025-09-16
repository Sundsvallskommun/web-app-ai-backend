import { CollectionUpdate } from '@/data-contracts/eneo-sundsvall/data-contracts';
import { IsString } from 'class-validator';

export class UpdateGroupDto implements CollectionUpdate {
  @IsString()
  name: string;
}
