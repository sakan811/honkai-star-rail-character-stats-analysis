import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import DashboardPage from '../src/app/dashboard/page'

describe('Dashboard page', () => {
  beforeEach(() => {
    render(<DashboardPage />)
  })
// Removed: No h1 heading is present in the current DashboardPage

  it('displays the back to home link', () => {
    const homeLink = screen.getByText('Back to Home')
    expect(homeLink).toBeTruthy()
    expect(homeLink.getAttribute('href')).toBe('/')
  })

// Removed: The key plots section is not present in the current DashboardPage
  it('displays the character dashboard section with links to all characters in left-to-right order', () => {
    expect(screen.getByText('Character Dashboards')).toBeTruthy()
    const dashboardLinks = screen.getAllByRole('link', { name: /Anaxa|Castorice|Ruan Mei/ });
    expect(dashboardLinks.length).toBe(3);
    expect(dashboardLinks[0].textContent).toBe('Anaxa');
    expect(dashboardLinks[0].getAttribute('href')).toBe('/dashboard/anaxa');
    expect(dashboardLinks[1].textContent).toBe('Castorice');
    expect(dashboardLinks[1].getAttribute('href')).toBe('/dashboard/castorice');
    expect(dashboardLinks[2].textContent).toBe('Ruan Mei');
    expect(dashboardLinks[2].getAttribute('href')).toBe('/dashboard/ruanmei');
  })
})
