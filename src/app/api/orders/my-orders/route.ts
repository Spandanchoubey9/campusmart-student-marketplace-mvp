import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');

    // Validate buyerId is provided
    if (!buyerId) {
      return NextResponse.json(
        { 
          error: 'Valid buyer ID is required', 
          code: 'INVALID_BUYER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate buyerId is a valid integer
    const parsedBuyerId = parseInt(buyerId);
    if (isNaN(parsedBuyerId)) {
      return NextResponse.json(
        { 
          error: 'Valid buyer ID is required', 
          code: 'INVALID_BUYER_ID' 
        },
        { status: 400 }
      );
    }

    // Fetch orders for the buyer
    const buyerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.buyerId, parsedBuyerId));

    return NextResponse.json(buyerOrders, { status: 200 });
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