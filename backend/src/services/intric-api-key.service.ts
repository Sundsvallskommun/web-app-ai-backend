import { Request } from 'express';
import prisma from '../utils/prisma';

export const getApiKey = async (req: Request) => {
  //NOTE: We should not need to check for the 'undefined' string, but older versions of frontend with this bug is still in production.
  //This will allow the old version to continue to work without updating every app.
  if (req.headers?.['_apikey'] && req.headers?.['_apikey'] !== 'undefined') {
    return req.headers['_apikey'];
  }

  const app = req.headers['_skapp'] ? (req.headers['_skapp'] as string) : undefined;
  if (typeof app !== 'string') {
    console.log('Application id missing');
    return false;
  }
  console.log('inbound app:', app);

  try {
    const assistant = await prisma.assistant.findUnique({ where: { app } });
    return assistant.apiKey;
  } catch (err) {
    console.log('Not in database');
    throw new Error('Application not found');
  }
};
