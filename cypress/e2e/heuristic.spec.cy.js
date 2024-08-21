const heuristic = require('../fixtures/heuristic.json')
const authUser = require('../fixtures/authUser.json')

const url = Cypress.env('url')
const { email, password } = authUser

describe('Heuristic test Suite', () => {
  before('Signup into the app', () => {
    cy.deleteUser(email, password)
    cy.signup(email, password)
    cy.login(email, password)
  })
  after('Remove user', () => {
    cy.deleteUser(email, password)
  })
  describe('Create Heuristic Test', () => {
    it('should allow a new test to create', () => {
      cy.visit(url + '/testslist')
      cy.findByTestId('create-test-btn').click()
      cy.findByText('Create a blank test').click()
      cy.findByText('Usability Heuristic').click()

      const { name, description } = heuristic
      cy.findByLabelText(/Test name/i).type(name)
      cy.findByLabelText(/Test Description/i).type(description)
      cy.findByTestId('add-name-test-creation-btn').click()

      cy.contains(/Manager/i)
    })
  })
})
