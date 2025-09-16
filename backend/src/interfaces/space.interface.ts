import { PaginatedResponseSpaceSparse, SpacePublic } from '@/data-contracts/eneo-sundsvall/data-contracts';

export interface PaginatedResponseSpacePublicInterface extends Omit<PaginatedResponseSpaceSparse, 'items'> {
  items: SpacePublic[];
}
