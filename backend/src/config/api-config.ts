import { ENEO_BASEPATH, ENEO_VERSION } from '.';

//Subscribed APIS as lowercased
export const APIS = [
  {
    name: 'simulatorserver',
    version: '2.0',
  },
  {
    name: 'eneo-sundsvall',
    version: '1.1',
  },
] as const;

type ApiName = (typeof APIS)[number]['name'];

export const getApiBase = (name: ApiName) => {
  const api = APIS.find(api => api.name === name);
  if (name === 'eneo-sundsvall') {
    return `${ENEO_BASEPATH ?? api?.name}/${ENEO_VERSION ?? api?.version}`;
  }
  return `${api?.name}/${api?.version}`;
};
