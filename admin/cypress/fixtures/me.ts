import { UserApiResponse } from '../../src/data-contracts/backend/data-contracts';

export const me: UserApiResponse = {
  data: {
    name: 'Karin Andersson',
    username: 'kar00and',
    isAdmin: true,
  },
  message: 'success',
};

export default me;
