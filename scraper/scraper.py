from playwright.sync_api import sync_playwright, Page

def scroll_until_element_visible(page: Page, selector: str, max_attempts: int = 10, scroll_amount: int = 200, timeout_ms: int = 500):
    """
    Scroll the page until the element matching the selector becomes visible.
    
    Args:
        page: The Playwright page object
        selector: CSS or XPath selector to find the element
        max_attempts: Maximum number of scroll attempts
        scroll_amount: Pixels to scroll each time
        timeout_ms: Milliseconds to wait between scroll attempts
        
    Returns:
        bool: True if the element was found, False otherwise
    """
    for i in range(max_attempts):
        # Check if the selector is now visible            
        if page.locator(selector).count() > 0:
            print(f"Found the element after {i} scroll attempts")
            # Scroll the element into view to make it visible in the browser
            page.locator(selector).scroll_into_view_if_needed()
            print("Scrolled the element into view")
            page.wait_for_timeout(timeout_ms)  # Give it a moment to stabilize
            return True
                
        # Scroll down
        page.evaluate(f"window.scrollBy(0, {scroll_amount})")
        page.wait_for_timeout(timeout_ms)  # Small delay to let page render
    
    print("Warning: Reached maximum scroll attempts without finding the element")
    return False

def run_scraper():
    with sync_playwright() as p:
        # Launch a browser instance
        browser = p.chromium.launch(headless=False)  # Set headless=True for production
        
        # Create a browser context with ad and image blocking
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            # Block ads and images to improve performance
            has_touch=False,
            java_script_enabled=True,
            ignore_https_errors=False,
            proxy=None,
            # Disable loading images
            permissions=['geolocation', 'notifications'],
            bypass_csp=True
        )
        
        # Add route to block image requests
        context.route("**/*.{png,jpg,jpeg,gif,webp,svg}", lambda route: route.abort())
        context.route("**/*.{css,woff,woff2,ttf,otf}", lambda route: route.continue_())
        
        # Create a new page from the context
        page = context.new_page()
        
        # Navigate to the target URL
        print("Navigating to Castorice's page...")
        page.goto("https://www.prydwen.gg/star-rail/characters/castorice")
        
        # Define the calculation tab selector
        tab_selector = '#gatsby-focus-wrapper > div > div.right-main > div.content.hsr > div.tabs'
        calculation_tab_selector = '#gatsby-focus-wrapper > div > div.right-main > div.content.hsr > div.tabs > div:nth-child(5) > p'
        
        # Scroll down gradually until the calculation tab is found
        print("Scrolling to find the calculation tab...")
        
        if scroll_until_element_visible(page, tab_selector):
            print("Scrolled the tab into view")
        else:
            print("Warning: Reached maximum scroll attempts")
        
        page.click(calculation_tab_selector)
        
        one_target_box_selector = '#gatsby-focus-wrapper > div > div.right-main > div.content.hsr > div.tab-inside.active > div.dps-comparison.row.row-cols-xl-1.row-cols-1 > div:nth-child(1) > div'
        
        if scroll_until_element_visible(page, one_target_box_selector):
            print("Scrolled the box into view")
        else:
            print("Warning: Reached maximum scroll attempts")
            
        # Define the specific selector for the percentage text
        e6_selector = '#gatsby-focus-wrapper > div > div.right-main > div.content.hsr > div.tab-inside.active > div.dps-comparison.row.row-cols-xl-1.row-cols-1 > div:nth-child(1) > div > div > div:nth-child(1) > div.chart > div:nth-child(2) > div.data.smaller > span.percent'
        
        # Scroll to make sure the element with percentage is visible
        print("Searching for the percentage element...")
        if scroll_until_element_visible(page, e6_selector, max_attempts=15):
            # Get the text from the percentage element
            percent_text = page.locator(e6_selector).text_content()
            print(f"Found percentage text: {percent_text}")
        else:
            print("Could not find the percentage element")
        
        # Pause to see the page (remove in production)
        input("Press Enter to close the browser...")
        
        # Close browser
        browser.close()

if __name__ == "__main__":
    run_scraper()