import '@testing-library/jest-dom'
import { render, screen } from '../test-utils'
import AddOptionBtn from '@/components/atoms/AddOptionBtn.vue'
import { fireEvent, waitFor } from '@testing-library/vue'

describe('AddOption', () => {
  it('renders initial title and opens dialog on button click', async () => {
    const { getByText, getByLabelText, emitted } = render(AddOptionBtn, {
      props: {
        dialog: false,
        hasValue: false,
        option: { text: '', value: null, description: '' },
      },
    })
    await fireEvent.click(getByText(/Add a new Option/i))
    expect(emitted().dialog[0]).toEqual([true])
  })

  it('closes dialog on cancel button click', async () => {
    const { getByText, emitted } = render(AddOptionBtn, {
      props: {
        dialog: true,
        hasValue: false,
        option: { text: '', value: null, description: '' },
      },
    })
    await fireEvent.click(getByText(/Cancel/i))
    expect(emitted().dialog[0]).toEqual([false])
  })

  it('emits addOption event on save button click', async () => {
    const { getByText, getByLabelText, emitted } = render(AddOptionBtn, {
      props: {
        dialog: true,
        hasValue: false,
        option: { text: '', value: null, description: '' },
      },
    })
    await fireEvent.update(getByLabelText(/Text/i), 'Test Option')
    await fireEvent.update(getByLabelText('Value'), '1')
    await fireEvent.update(getByLabelText(/Description/i), 'Test Description')
    await fireEvent.click(getByText(/Save/i))

    expect(emitted().addOption).toBeTruthy()
  })

  it('emits required event on save button click', async () => {
    const { getByText, getByLabelText, emitted } = render(AddOptionBtn, {
      props: {
        dialog: true,
        hasValue: false,
        option: { text: '', value: null, description: '' },
      },
    })
    await fireEvent.click(getByText(/Save/i))

    await waitFor(() => {
      expect(screen.getByText(/Required/i)).toBeInTheDocument()
    })

    expect(emitted().addOption).toBeFalsy()
  })
})
