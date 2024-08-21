describe('RUXAILAB APP' , () => {
  it('should visit the app', () => {
    cy.visit('http://localhost:8080')
  })

it('should have a title', () => {
    cy.visit('http://localhost:8080')
    cy.contains('Remote Testing Lab')
  })
})
