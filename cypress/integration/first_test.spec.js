describe("My First Test", () => {
  it("Visits localhost", () => {
    cy.visit("localhost:3000");

    cy.contains("Voting Wallet");
  });
});
