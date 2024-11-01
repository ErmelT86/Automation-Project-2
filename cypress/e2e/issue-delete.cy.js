const issueDetailModal = '[data-testid="modal:issue-details"]';
const confirmPopup = '[data-testid="modal:confirm"]';
const backlogList = '[data-testid="board-list:backlog"]';
const issuesList = '[data-testid="list-issue"]';
const deleteButtonIcon = '[data-testid="icon:trash"]';
const confirmDeleteButton = "Delete issue";
const cancelDeleteButton = "Cancel";
const closeModalButton = '[data-testid="icon:close"]';
const issueTitle = "This is an issue of type: Task.";

function clickDeleteButton() {
  cy.get(issueDetailModal).within(() => {
    cy.get(deleteButtonIcon).click();
  });
  cy.get(confirmPopup).should("be.visible");
}

function cancelDeletion() {
  cy.get(confirmPopup).within(() => {
    cy.contains(cancelDeleteButton).should("be.visible").click();
  });
  cy.get(confirmPopup).should("not.exist");
  cy.get(issueDetailModal).should("be.visible");
}

function confirmDeletion() {
  cy.get(confirmPopup).within(() => {
    cy.contains(confirmDeleteButton).should("be.visible").click();
  });
  cy.get(confirmPopup).should("not.exist");
  cy.get(backlogList).should("be.visible");
}

function closeIssueDetailModal() {
  cy.get(issueDetailModal).get(closeModalButton).first().click();
  cy.get(issueDetailModal).should("not.exist");
  cy.get(backlogList).should("be.visible");
}

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
    cy.get(issueDetailModal).should("be.visible");
  });

  it("Test Case 1: Issue Deletion", () => {
    clickDeleteButton();
    confirmDeletion();
    cy.get(backlogList)
      .should("have.length", "1")
      .within(() => {
        cy.get(issuesList).should("have.length", "3");
        cy.contains(issueTitle).should("not.exist");
      });
  });

  it("Test Case 2: Issue Deletion Cancellation", () => {
    clickDeleteButton();
    cancelDeletion();
    closeIssueDetailModal();
    cy.get(backlogList)
      .should("have.length", "1")
      .within(() => {
        cy.get(issuesList).should("have.length", "4");
        cy.contains(issueTitle).should("be.visible");
      });
  });
});