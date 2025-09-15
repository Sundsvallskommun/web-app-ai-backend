import { Host } from '@prisma/client';
import { IsString } from 'class-validator';

export class HostDto implements Pick<Host, 'host'> {
  @IsString()
  host: string;
}
