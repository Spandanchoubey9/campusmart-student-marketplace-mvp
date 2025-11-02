import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, buyerId, sellerId } = body;

    // Validate all required fields are present
    if (!productId) {
      return NextResponse.json(
        { 
          error: 'Product ID is required', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    if (!buyerId) {
      return NextResponse.json(
        { 
          error: 'Buyer ID is required', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    if (!sellerId) {
      return NextResponse.json(
        { 
          error: 'Seller ID is required', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    // Validate all IDs are valid integers
    const parsedProductId = parseInt(productId);
    const parsedBuyerId = parseInt(buyerId);
    const parsedSellerId = parseInt(sellerId);

    if (isNaN(parsedProductId)) {
      return NextResponse.json(
        { 
          error: 'Product ID must be a valid integer', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parsedBuyerId)) {
      return NextResponse.json(
        { 
          error: 'Buyer ID must be a valid integer', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parsedSellerId)) {
      return NextResponse.json(
        { 
          error: 'Seller ID must be a valid integer', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    // Check that buyerId and sellerId are different
    if (parsedBuyerId === parsedSellerId) {
      return NextResponse.json(
        { 
          error: 'Buyer and seller cannot be the same user', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    // Insert order record with auto-generated fields
    const newOrder = await db.insert(orders)
      .values({
        productId: parsedProductId,
        buyerId: parsedBuyerId,
        sellerId: parsedSellerId,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message,
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}