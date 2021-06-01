describe("My First Test", () => {
  it("Visits localhost", () => {
    cy.visit("localhost:3000");

    cy.contains("Voting Wallet");
    // cy.visit(
    //   "chrome-extension://hgoafkmacacpcipakokjkkpodaonghel/home.html#initialize/welcome"
    //   // "https://google.com"
    // );

    cy.get(".connect-btn").click();

    cy.get(".svelte-1skxsnk").first().click();
    cy.get(
      ".bn-onboard-custom.bn-onboard-prepare-button.svelte-r5g1v4.bn-onboard-prepare-button-center"
    )
      .first()
      .click();
  });
});
