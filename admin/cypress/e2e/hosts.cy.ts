import { host1, host1Updated, hostsWithNew, newHost } from 'cypress/fixtures/hosts';

describe('Hosts', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('lists hosts on front page', () => {
    cy.get('[data-cy="resource-card-hosts"]').within(() => {
      cy.get('[data-cy="resource-card-title"]').should('have.text', 'Värdar');
      cy.get('[data-cy="resource-card-subtitle"]').should('have.text', '2 värdar');
    });
  });
  it('lists and sorts hosts', () => {
    cy.get('[data-cy="resource-card-hosts"]').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .within(() => {
        cy.get('tbody').children().eq(0).contains('www.sundsvall.se');
        cy.get('tbody').children().eq(1).contains('www.test.com');

        cy.get('thead>tr').children().eq(0).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('www.test.com');
        cy.get('tbody').children().eq(1).contains('www.sundsvall.se');

        cy.get('thead>tr').children().eq(1).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('www.sundsvall.se');
        cy.get('tbody').children().eq(1).contains('www.test.com');

        cy.get('thead>tr').children().eq(1).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('www.test.com');
        cy.get('tbody').children().eq(1).contains('www.sundsvall.se');
      });

    cy.get('[data-cy="table-settings-button"]').click();
    cy.get('[data-cy="table-settings-panel"]').children().should('have.length', 2);
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Url');
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="table-settings-panel"]').children().eq(1).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Id');
  });

  it('creates a new host', () => {
    cy.intercept('GET', '**/admin/hosts', hostsWithNew);
    cy.intercept('GET', '**/admin/hosts/3', newHost);
    cy.intercept('POST', '**/admin/hosts', newHost);
    cy.get('[data-cy="mainmenu-resource-hosts"]>span>button').click();
    cy.contains('Skapa ny värd').click();
    cy.get('h1').should('have.text', 'Skapa ny värd');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-hosts-host"]').type('www.nydomän.se');
    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-delete"]').click();
    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Du har osparade ändringar');
      cy.get('button').contains('Nej').click();
    });
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('h1').should('have.text', 'Redigera värd');
    cy.get('header').should('include.text', 'Id: 3');
    cy.get('[data-cy="goback"]').click();
    cy.get('[data-cy="resource-table"]').eq(0).find('tbody').children().should('have.length', 3);
  });

  it('edits a host', () => {
    cy.intercept('GET', '**/admin/hosts/1', host1);
    cy.intercept('PATCH', '**/admin/hosts/1', host1Updated);
    cy.get('[data-cy="mainmenu-resource-hosts"]>span>a').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .find('tbody')
      .children()
      .eq(0)
      .find('a[data-cy="edit-resource"]')
      .click();
    cy.get('h1').should('have.text', 'Redigera värd');
    cy.get('header').should('include.text', 'Id: 1');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-hosts-host"]').should('have.value', 'www.sundsvall.se');
    cy.get('[data-cy="edit-hosts-host"]').clear();
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('[data-cy="edit-hosts-host"]').type('nydomän.com');
    cy.get('[data-cy="edit-toolbar-save"]').click();
  });
});
