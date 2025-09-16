import {
  AssistantSettingApiResponse,
  AssistantSettingsApiResponse,
} from '../../src/data-contracts/backend/data-contracts';

const assistants: AssistantSettingsApiResponse = {
  message: 'success',
  data: [
    { id: 1, assistantId: '3234-5678-abcd', app: 'ASSISTANT1', apiKey: '***123' },
    { id: 2, assistantId: '1234-5678-abcd', app: 'ASSISTANT2', apiKey: '***123' },
    { id: 3, assistantId: '2234-5678-abcd', app: 'ASSISTANT3', apiKey: '***123' },
  ],
};

export const assistant1: AssistantSettingApiResponse = {
  message: 'success',
  data: assistants.data[0],
};

export const newAssistant: AssistantSettingApiResponse = {
  message: 'success',
  data: { id: 4, assistantId: 'test123', app: 'test123', apiKey: '***123' },
};

export const assistantsWithNew: AssistantSettingsApiResponse = {
  message: 'success',
  data: [...assistants.data, newAssistant.data],
};

export default assistants;
