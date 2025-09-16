import { assistant1, assistantsWithNew, newAssistant } from '../fixtures/assistants';

describe('Assistants', () => {
  it('lists assistants on front page', () => {
    cy.get('[data-cy="resource-card-assistants"]').within(() => {
      cy.get('[data-cy="resource-card-title"]').should('have.text', 'Assistenter');
      cy.get('[data-cy="resource-card-subtitle"]').should('have.text', '3 assistenter');
    });
  });
  it('lists assistants and sorts assistants', () => {
    cy.get('[data-cy="resource-card-assistants"]').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .within(() => {
        cy.get('tbody').children().eq(0).contains('ASSISTANT1');
        cy.get('tbody').children().eq(1).contains('ASSISTANT2');
        cy.get('tbody').children().eq(2).contains('ASSISTANT3');

        cy.get('thead>tr').children().eq(0).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('ASSISTANT3');
        cy.get('tbody').children().eq(1).contains('ASSISTANT2');
        cy.get('tbody').children().eq(2).contains('ASSISTANT1');

        cy.get('thead>tr').children().eq(1).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('ASSISTANT2');
        cy.get('tbody').children().eq(1).contains('ASSISTANT3');
        cy.get('tbody').children().eq(2).contains('ASSISTANT1');

        cy.get('thead>tr').children().eq(1).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('ASSISTANT1');
        cy.get('tbody').children().eq(1).contains('ASSISTANT3');
        cy.get('tbody').children().eq(2).contains('ASSISTANT2');
      });

    cy.get('[data-cy="table-settings-button"]').click();
    cy.get('[data-cy="table-settings-panel"]').children().should('have.length', 4);
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Assistent-id');
    cy.get('[data-cy="table-settings-panel"]').children().eq(1).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Applikationsnamn');
  });

  it('creates a new assistant', () => {
    cy.intercept('GET', '**/admin/assistants', assistantsWithNew);
    cy.intercept('GET', '**/admin/assistants/4', newAssistant);
    cy.intercept('POST', '**/admin/assistants', newAssistant);
    cy.get('[data-cy="mainmenu-resource-assistants"]>span>button').click();
    cy.contains('Skapa ny assistent').click();
    cy.get('h1').should('have.text', 'Skapa ny assistent');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-assistant-appname"]').type('test123');
    cy.get('[data-cy="edit-assistant-assistantid"]').type('test123');
    cy.get('[data-cy="edit-assistant-apikey"]').type('test123');
    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-delete"]').click();
    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Du har osparade ändringar');
      cy.get('button').contains('Nej').click();
    });
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('h1').should('have.text', 'Redigera assistent');
    cy.get('header').should('include.text', 'Id: 4');
    cy.get('[data-cy="goback"]').click();
    cy.get('[data-cy="resource-table"]').eq(0).find('tbody').children().should('have.length', 4);
  });

  it('edits an assistant', () => {
    cy.intercept('GET', '**/admin/assistants/1', assistant1);
    cy.intercept('PATCH', '**/admin/assistants/1', assistant1);
    cy.get('[data-cy="mainmenu-resource-assistants"]>span>a').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .find('tbody')
      .children()
      .eq(0)
      .find('a[data-cy="edit-resource"]')
      .click();
    cy.get('h1').should('have.text', 'Redigera assistent');
    cy.get('header').should('include.text', 'Id: 1');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-assistant-appname"]').should('have.value', 'ASSISTANT1');
    cy.get('[data-cy="edit-assistant-assistantid"]').should('have.value', '3234-5678-abcd');
    cy.get('[data-cy="edit-assistant-apikey"]').should('be.disabled');
    cy.get('[data-cy="edit-assistant-apikey"]').should('have.value', '***123');
    cy.get('[data-cy="change-apikey-button"]').click();
    cy.get('[data-cy="edit-assistant-apikey"]').should('not.be.disabled');
    cy.get('[data-cy="edit-assistant-apikey"]').should('have.value', '');
    cy.get('[data-cy="change-apikey-button"]').should('not.exist');
    cy.get('[data-cy="edit-assistant-apikey"]').type('test123');
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('[data-cy="edit-assistant-apikey"]').should('be.disabled');
    cy.get('[data-cy="edit-assistant-apikey"]').should('have.value', '***123');
  });
});
