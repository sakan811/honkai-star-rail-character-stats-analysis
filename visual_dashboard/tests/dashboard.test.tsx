import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import DashboardPage from '../src/app/dashboard/page'

describe('Dashboard page', () => {
  beforeEach(() => {
    render(<DashboardPage />)
  })
  it('renders the main heading correctly', () => {
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Eidolon & Signature Light Cone Value Analysis')
  })
  it('displays the back to home link', () => {
    const homeLink = screen.getByText('Back to Home')
    expect(homeLink).toBeTruthy()
    expect(homeLink.getAttribute('href')).toBe('/')
  })

  it('displays the key plots section', () => {
    expect(screen.getByText('Key Plots')).toBeTruthy()
    expect(screen.getByText(/Average Damage by Eidolon/)).toBeTruthy()
    expect(screen.getByText(/Damage per Pull Efficiency/)).toBeTruthy()
    expect(screen.getByText(/Marginal Value of Each Eidolon/)).toBeTruthy()
  })
  it('displays the character dashboard section with a link to Anaxa', () => {
    expect(screen.getByText('Character Dashboards')).toBeTruthy()
    const anaxaLink = screen.getByText('Anaxa')
    expect(anaxaLink).toBeTruthy()
    expect(anaxaLink.getAttribute('href')).toBe('/anaxa')
  })
})
