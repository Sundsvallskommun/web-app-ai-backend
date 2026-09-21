import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { appURL } from '../src/utils/app-url.ts';

const origin = 'https://ai-backend-i.sundsvall.se';
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;

beforeEach(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { location: { origin } },
  });
  process.env.NEXT_PUBLIC_BASE_PATH = '/admin';
});

afterEach(() => {
  if (originalWindow) {
    Object.defineProperty(globalThis, 'window', originalWindow);
  } else {
    delete globalThis.window;
  }
  if (originalBasePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
  }
});

test('omitting the path returns the admin base URL', () => {
  assert.equal(appURL(), `${origin}/admin`);
});

test('login failure redirects to the login page without undefined', () => {
  assert.equal(`${appURL()}/login`, `${origin}/admin/login`);
});

test('logout redirects to the login page with its loggedout flag', () => {
  assert.equal(`${appURL()}/login?loggedout`, `${origin}/admin/login?loggedout`);
});

test('explicit paths preserve query parameters', () => {
  assert.equal(appURL('/assistants/42?view=edit'), `${origin}/admin/assistants/42?view=edit`);
});

test('paths already containing the base path do not duplicate it', () => {
  assert.equal(appURL('/admin/assistants'), `${origin}/admin/assistants`);
});

test('relative paths work without a browser window', () => {
  delete globalThis.window;
  assert.equal(appURL('/admin/assistants', true), '/assistants');
  assert.equal(appURL(undefined, true), '');
});

test('an empty base path supports deployment at the domain root', () => {
  process.env.NEXT_PUBLIC_BASE_PATH = '';
  assert.equal(appURL('/login'), `${origin}/login`);
});

test('an unset base path does not add undefined to the URL', () => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  assert.equal(appURL(), origin);
  assert.equal(appURL('/login'), `${origin}/login`);
});
