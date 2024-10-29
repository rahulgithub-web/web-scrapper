import puppeteer from 'puppeteer';

export async function scrapeResorts(location: string, propertyType: string) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  });

  const page = await browser.newPage();
  
  try {
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Encode the location for the URL
    const encodedLocation = encodeURIComponent(location);
    
    // Construct the URL with location and property type
    const url = `https://www.airbnb.co.in/s/${encodedLocation}/homes?type=${propertyType}`;
    
    console.log('Navigating to:', url);
    
    // Navigate with timeout and waitUntil settings
    await page.goto(url, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    // Wait for listings to load
    await page.waitForFunction(
      'document.querySelectorAll("div[itemprop=\'itemListElement\']").length > 0',
      { timeout: 10000 }
    );

    // Add a delay to ensure dynamic content loads
    await page.waitForTimeout(3000);

    const resorts = await page.evaluate((location, propertyType) => {
      const listings = document.querySelectorAll('div[itemprop="itemListElement"]');
      
      return Array.from(listings, listing => {
        try {
          // Image - look for meta tag first, then fallback to img element
          const metaImage = listing.querySelector('meta[itemprop="image"]');
          const imgElement = listing.querySelector('img');
          const imgSrc = metaImage?.getAttribute('content') || imgElement?.src || '';

          // Name
          const titleElement = listing.querySelector('meta[itemprop="name"]');
          const name = titleElement?.getAttribute('content') || 
                      listing.querySelector('div[data-testid="listing-card-title"]')?.textContent || '';

          // Address
          const addressElement = listing.querySelector('div[data-testid="listing-card-subtitle"]');
          const address = addressElement?.textContent || '';

          // Description and Amenities
          const descriptionElement = listing.querySelector('div[data-testid="listing-card-description"]');
          const description = descriptionElement?.textContent || '';
          const amenities = description.split('·')
            .map(item => item.trim())
            .filter(item => item.length > 0);

          // Rating
          const ratingElement = listing.querySelector('span[aria-label*="rating"]');
          const ratingText = ratingElement?.getAttribute('aria-label') || '';
          const rating = parseFloat(ratingText.match(/\d+(\.\d+)?/)?.[0] || '0');

          // Reviews count
          const reviewsElement = listing.querySelector('span[aria-label*="reviews"]');
          const reviewsText = reviewsElement?.getAttribute('aria-label') || '';
          const reviewsCount = parseInt(reviewsText.match(/\d+/)?.[0] || '0');

          // Review status based on rating
          const reviewStatus = rating >= 4.5 ? 'Excellent' : 
                             rating >= 4.0 ? 'Very Good' : 
                             rating >= 3.5 ? 'Good' : 'Fair';

          // Price
          const priceElement = listing.querySelector('span[data-testid="price-element"]');
          const priceText = priceElement?.textContent || '';
          const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

          return {
            imgSrc,
            name,
            address,
            description,
            amenities,
            rating,
            price,
            reviewStatus,
            reviewsCount,
            location,
            propertyType
          };
        } catch (error) {
          console.error('Error parsing listing:', error);
          return null;
        }
      });
    }, location, propertyType);

    // Filter out null entries and ensure required fields exist
    const validResorts = resorts.filter(resort => 
      resort && 
      resort.name && 
      resort.imgSrc && 
      resort.price > 0
    );

    if (validResorts.length === 0) {
      throw new Error('No valid properties found');
    }

    return validResorts;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}