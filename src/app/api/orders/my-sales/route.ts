import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    // Validate sellerId parameter
    if (!sellerId || isNaN(parseInt(sellerId))) {
      return NextResponse.json(
        { 
          error: 'Valid seller ID is required',
          code: 'INVALID_SELLER_ID' 
        },
        { status: 400 }
      );
    }

    // Fetch orders for the seller
    const sellerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.sellerId, parseInt(sellerId)));

    return NextResponse.json(sellerOrders, { status: 200 });
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