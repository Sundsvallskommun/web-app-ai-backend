import { NODE_ENV } from '@/config';
const log: typeof console.log = log => {
  if (NODE_ENV === 'development') {
    console.log(log);
  }
};
const error: typeof console.error = error => {
  if (NODE_ENV === 'development') {
    console.error(error);
  }
};
const info: typeof console.info = info => {
  if (NODE_ENV === 'development') {
    console.info(info);
  }
};
const debug: typeof console.debug = debug => {
  if (NODE_ENV === 'development') {
    console.debug(debug);
  }
};

export const devconsole = {
  log,
  info,
  error,
  debug,
};
