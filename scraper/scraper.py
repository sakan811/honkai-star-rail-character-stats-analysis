from playwright.sync_api import sync_playwright

def run_scraper():
    with sync_playwright() as p:
        # Launch a browser instance
        browser = p.chromium.launch(headless=False)  # Set headless=True for production
        
        # Create a new page
        page = browser.new_page()
        
        # Navigate to the target URL
        print("Navigating to Castorice's page...")
        page.goto("https://www.prydwen.gg/star-rail/characters/castorice")
        
        # Wait for the page to load completely
        page.wait_for_load_state("networkidle")
        print(f"Successfully loaded: {page.title()}")
        
        # Wait for the tabs to be available in the DOM
        calculation_tab_selector = '#gatsby-focus-wrapper > div > div.right-main > div.content.hsr > div.tabs > div.single-tab.Quantum.active'
        page.wait_for_selector(calculation_tab_selector)
        
        # Find the calculation tab using text content
        print("Looking for Calculation tab...")
        calculation_tab = page.get_by_text("Calculation", exact=False)
        
        # Check if we found the tab
        if calculation_tab.count() > 0:
            print("Found Calculation tab, clicking...")
            calculation_tab.first.click()
            # Wait for content to load after clicking
            page.wait_for_load_state("networkidle")
            print("Calculation tab content loaded")
        else:
            print("Could not find Calculation tab")
        
        # Pause to see the page (remove in production)
        input("Press Enter to close the browser...")
        
        # Close browser
        browser.close()

if __name__ == "__main__":
    run_scraper()