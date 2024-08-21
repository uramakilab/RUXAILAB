import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '../test-utils'
import SignInView from '@/views/public/SignInView.vue'
import { signInWithEmailAndPassword } from 'firebase/auth'

global.console.error = jest.fn()
global.console.warn = jest.fn()

describe('SignIn', () => {

  it('should display email input', async () => {
    render(SignInView)
    expect(screen.getByLabelText(/E-mail/i, { selector: 'input' })).toBeInTheDocument()
  })
  it('should display password input', async () => {
    render(SignInView)
    expect(screen.getByLabelText(/Password/i, { selector: 'input' })).toBeInTheDocument()
  })

  it('should display sign-in button', async () => {
    render(SignInView)
    expect(screen.getByRole('button', { name: /Sign-in/i })).toBeInTheDocument()
  })

  describe('when user type valid credentials', () => {
    it('should sign in', async () => {
      render(SignInView)

      signInWithEmailAndPassword.mockImplementation(() => {
        return Promise.resolve()
      })

      const emailInput = screen.getByLabelText(/E-mail/i)
      await fireEvent.update(emailInput, 'valid-email')
      const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' })
      await fireEvent.update(passwordInput, 'valid-password')
      const submitButton = screen.getByRole('button', { name: /Sign-in/i })
      await fireEvent.click(submitButton)
      expect(signInWithEmailAndPassword).toHaveBeenCalled()
    })
  })
})
