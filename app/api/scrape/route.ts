import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resort from '@/lib/models/Resort';
import { scrapeResorts } from '@/lib/scraper';

export async function POST(req: Request) {
  try {
    const { location, propertyType } = await req.json();

    if (!location || !propertyType) {
      return NextResponse.json(
        { success: false, error: 'Location and property type are required' },
        { status: 400 }
      );
    }

    console.log('Starting scrape for:', { location, propertyType });
    
    const resorts = await scrapeResorts(location, propertyType);
    
    if (!resorts || resorts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No properties found for the given criteria' },
        { status: 404 }
      );
    }

    await connectDB();
    
    // Remove existing entries for this location and property type
    await Resort.deleteMany({ location, propertyType });
    
    // Insert new entries
    await Resort.insertMany(resorts);
    
    return NextResponse.json({ 
      success: true, 
      count: resorts.length,
      message: `Successfully scraped ${resorts.length} properties`
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to scrape data'
    }, { 
      status: 500 
    });
  }
}