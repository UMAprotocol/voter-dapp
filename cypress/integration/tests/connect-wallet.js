describe("Connects to the wallet", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("localhost:3000");
    cy.setLocalStorage("cypress-testing", true);
  });

  it("Visits localhost", () => {
    cy.visit("localhost:3000");
    cy.contains("Voting Wallet");
    cy.get(".connect-btn").click();
    cy.get(".svelte-1skxsnk").first().click();
    cy.get(
      ".bn-onboard-custom.bn-onboard-prepare-button.svelte-r5g1v4.bn-onboard-prepare-button-center"
    )
      .first()
      .click();
    cy.reload();
    cy.get(".connect-btn").click();
    cy.get(".svelte-1skxsnk").first().click();
  });
});
