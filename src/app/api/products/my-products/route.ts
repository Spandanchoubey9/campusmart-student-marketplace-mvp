import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    // Validate sellerId is provided
    if (!sellerId) {
      return NextResponse.json(
        { 
          error: 'Valid seller ID is required',
          code: 'INVALID_SELLER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate sellerId is a valid integer
    const sellerIdInt = parseInt(sellerId);
    if (isNaN(sellerIdInt)) {
      return NextResponse.json(
        { 
          error: 'Valid seller ID is required',
          code: 'INVALID_SELLER_ID' 
        },
        { status: 400 }
      );
    }

    // Fetch products for the specified seller
    const sellerProducts = await db
      .select()
      .from(products)
      .where(eq(products.sellerId, sellerIdInt));

    return NextResponse.json(sellerProducts, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}