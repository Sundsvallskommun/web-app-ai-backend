import { HostApiResponse, HostsApiResponse } from '../../src/data-contracts/backend/data-contracts';

const hosts: HostsApiResponse = {
  message: 'success',
  data: [
    { id: 1, host: 'www.sundsvall.se' },
    { id: 2, host: 'www.test.com' },
  ],
};

export const host1: HostApiResponse = {
  message: 'success',
  data: hosts.data[0],
};

export const host1Updated: HostApiResponse = {
  message: 'success',
  data: {
    id: 1,
    host: 'www.nydomän.com',
  },
};

export const newHost: HostApiResponse = {
  message: 'success',
  data: {
    id: 3,
    host: 'www.nydomän.se',
  },
};

export const hostsWithNew: HostsApiResponse = {
  message: 'success',
  data: [...hosts.data, newHost.data],
};

export default hosts;
