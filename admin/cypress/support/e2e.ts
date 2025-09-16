import '@cypress/code-coverage/support';

import { CookieConsentUtils } from '@sk-web-gui/react';
import { me } from '../fixtures/me';
import assistants from '../fixtures/assistants';
import hosts from '../fixtures/hosts';

export const DEFAULT_COOKIE_VALUE = 'necessary%2Cstats';

localStorage.clear();

beforeEach(() => {
  cy.visit('/', { failOnStatusCode: false });
  cy.on('uncaught:exception', () => {
    return false;
  });

  cy.setCookie(CookieConsentUtils.defaultCookieConsentName, DEFAULT_COOKIE_VALUE);
  cy.viewport('macbook-16');
  cy.intercept('GET', '**/api/admin/me', me).as('me');
  cy.intercept('GET', '**/api/admin/assistants', assistants).as('assistants');
  cy.intercept('GET', '**/api/admin/hosts', hosts).as('hosts');
});
