import resources from '@config/resources';
import { ResourceName } from '@interfaces/resource-name';

export const stringToResourceName = (resource: string): ResourceName | undefined => {
  const isResource = Object.keys(resources).includes(resource);
  return isResource ? (resource as ResourceName) : undefined;
};
