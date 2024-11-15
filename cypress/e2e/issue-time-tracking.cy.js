const estimatedTime = '10';
const estimatedTimeUpdated = '20';
const loggedTime = '2';
const remainingTime = '5';
const loggedTimeUpdated = '3';
const remainingTimeUpdated = '4';
const loggedTimeExpectedText  = 'h logged';
const estimatedTimeExpectedText = 'h estimated';
const remainingTimeExpectedText = 'h remaining';

describe("Time tracking functionality testing", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.url()
        .should("eq", `${Cypress.env("baseUrl")}project/board`)
        .then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
            cy.get('[data-testid="modal:issue-create"]')
                .within(() => {
                    cy.get('[data-testid="select:type"]').click();
                    cy.get('[data-testid="select-option:Bug"]').click();
                    cy.get(".ql-editor").type('Can add and edit time');
                    cy.get('input[name="title"]').type('Time traking test');
                    cy.get('[data-testid="select:userIds"]').click();
                    cy.get('[data-testid="select-option:Baby Yoda"]').click();
                    cy.get('button[type="submit"]').click();
                });
            cy.contains('Issue has been successfully created.').should('be.visible');
            cy.get('[data-testid="board-list:backlog"]').should('be.visible').contains('Time traking test').click();
        });
    });
    
    it('Should successfully add, update and remove estimated time', () => {
        cy.contains('No time logged').should('be.visible');

        cy.get('input[placeholder="Number"]').type(estimatedTime);
        cy.get('input[placeholder="Number"]').should('have.value', estimatedTime);
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('be.visible');

        cy.get('input[placeholder="Number"]').clear().type(estimatedTimeUpdated);
        cy.get('input[placeholder="Number"]').should('have.value', estimatedTimeUpdated);
        cy.contains(`${estimatedTimeUpdated}${estimatedTimeExpectedText}`).should('be.visible');

        cy.get('input[placeholder="Number"]').clear();
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('not.exist');
        cy.contains(`${estimatedTimeUpdated}${estimatedTimeExpectedText}`).should('not.exist');
        cy.contains('No time logged').should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();
        cy.reload();
        cy.get('[data-testid="board-list:backlog"]').should('be.visible').contains('Time traking test').click();
        cy.contains('No time logged').should('be.visible');
    });

    it('Should successfully add, update and remove logged time values', () => {
        cy.get('input[placeholder="Number"]').type(estimatedTime);
        cy.get('input[placeholder="Number"]').should('have.value', estimatedTime);
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('be.visible');

        cy.contains('No time logged').should('be.visible');
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible')
            .within(() => {
                cy.get('input[placeholder="Number"]').eq(0).type(loggedTime);
                cy.get('input[placeholder="Number"]').eq(1).type(remainingTime);

                cy.contains('button', 'Done').click();
            });

        cy.get('[data-testid="modal:tracking"]').should('not.exist');

        cy.contains(`${loggedTime}${loggedTimeExpectedText }`).should('be.visible');
        cy.contains(`${remainingTime}${remainingTimeExpectedText}`).should('be.visible');
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('not.exist');

        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible')
            .within(() => {
                cy.get('input[placeholder="Number"]').eq(0).type(loggedTimeUpdated);
                cy.get('input[placeholder="Number"]').eq(1).type(remainingTimeUpdated);

                cy.contains('button', 'Done').click();
            });

        cy.get('[data-testid="modal:tracking"]').should('not.exist');

        cy.contains(`${loggedTimeUpdated}${loggedTimeExpectedText }`).should('be.visible');
        cy.contains(`${remainingTimeUpdated}${remainingTimeExpectedText}`).should('be.visible');
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('not.exist');

        cy.contains('No time logged').should('not.exist');

        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible')
            .within(() => {
                cy.get('input[placeholder="Number"]').eq(0).clear();
                cy.get('input[placeholder="Number"]').eq(1).clear();
                cy.contains('button', 'Done').click();
            });

        cy.contains('No time logged').should('be.visible');
        cy.contains(`${loggedTime}${loggedTimeExpectedText }`).should('not.exist');
        cy.contains(`${remainingTime}${remainingTimeExpectedText}`).should('not.exist');
        cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should('be.visible');
    });
});