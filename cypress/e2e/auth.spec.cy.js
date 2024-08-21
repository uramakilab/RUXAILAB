const authUser = require('../fixtures/authUser.json')
const url = Cypress.env('url')

describe('Authentication Suite', () => {
  describe('Registration', () => {
    it('should allow a new user to register', () => {
      cy.visit(url + '/signup')
      const { email, password } = authUser
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText("Password").type(password)
      cy.get('form').findByLabelText("Confirm your password").type(password)
      cy.findByRole('button', {name: 'Sign-up'}).click()
      cy.wait(500)
      cy.contains(email)
      cy.deleteUser(email, password)
    })
    it('should reject registration with invalid password', () => {
      cy.visit(url + '/signup')
      const { email, invalidPassword } = authUser
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText("Password").type(invalidPassword)
      cy.get('form').findByLabelText("Confirm your password").type(invalidPassword)
      cy.findByRole('button', {name: 'Sign-up'}).click()
      cy.contains('Password must be at least 6 characters')
    })
    it('should reject registration when passwords do not match', () => {
      cy.visit(url + '/signup')
      const { email, password, invalidPassword } = authUser
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText("Password").type(password)
      cy.get('form').findByLabelText("Confirm your password").type(invalidPassword)
      cy.findByRole('button', {name: 'Sign-up'}).click()
      cy.contains('Different passwords')
    })
  })
  describe('Login', () => {
    const { email, password } = authUser
    beforeEach(() => {
      cy.signup(email, password)
      cy.logout()
      cy.visit(url + '/signin')
    })
    afterEach(() => {
      cy.deleteUser(email, password)
    })
    it('should allow a registered user to login', () => {
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText('Password').type(password)
      cy.findByTestId('sign-in-button').click()
      cy.wait(500)
      cy.contains(email)
    })
    it('should reject login with incorrect password', () => {
      const { email, password, invalidPassword } = authUser
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText('Password').type(invalidPassword)
      cy.findByTestId('sign-in-button').click()
      cy.contains('Incorrect password')
    })
    it('should reject login with unregistered email', () => {
      cy.get('form').findByLabelText(/e-mail/i).type('noexist@noexist.com')
      cy.get('form').findByLabelText('Password').type('noexist')
      cy.findByTestId('sign-in-button').click()
      cy.contains('Incorrect username or password')
    })
  })
})
