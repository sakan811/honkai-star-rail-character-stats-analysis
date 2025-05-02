import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import AnaxaPage from '../src/app/anaxa/page'

describe('Anaxa page', () => {
  beforeEach(() => {
    render(<AnaxaPage />)
  })
  it('displays the back link to dashboard', () => {
    const backLink = screen.getByText('← Back')
    expect(backLink).toBeTruthy()
    expect(backLink.getAttribute('href')).toBe('/dashboard')
  })
  it('renders the dashboard iframe', () => {
    const iframe = screen.getByTitle('Anaxa Looker Studio Dashboard')
    expect(iframe).toBeTruthy()
    const src = iframe.getAttribute('src')
    expect(src).toContain('lookerstudio.google.com')
  })

  it('sets proper sandbox attributes on iframe for security', () => {
    const iframe = screen.getByTitle('Anaxa Looker Studio Dashboard')
    const sandbox = iframe.getAttribute('sandbox')
    expect(sandbox).toBe(
      'allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox'
    )
  })
})
