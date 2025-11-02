import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query = db.select().from(products);

    const conditions = [];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(products.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)),
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sellerId, name, description, category, price, imageUrl } = body;

    // Validate required fields
    if (!sellerId) {
      return NextResponse.json(
        { 
          error: 'sellerId is required',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { 
          error: 'name is required and cannot be empty',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    if (!description || description.trim() === '') {
      return NextResponse.json(
        { 
          error: 'description is required and cannot be empty',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    if (!category || category.trim() === '') {
      return NextResponse.json(
        { 
          error: 'category is required and cannot be empty',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    if (!imageUrl || imageUrl.trim() === '') {
      return NextResponse.json(
        { 
          error: 'imageUrl is required and cannot be empty',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    if (price === undefined || price === null) {
      return NextResponse.json(
        { 
          error: 'price is required',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Validate sellerId is a valid integer
    const sellerIdInt = parseInt(String(sellerId));
    if (isNaN(sellerIdInt)) {
      return NextResponse.json(
        { 
          error: 'sellerId must be a valid integer',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Validate price is a positive number
    const priceNum = parseFloat(String(price));
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { 
          error: 'price must be a positive number',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Validate category is one of the allowed values
    const allowedCategories = ['books', 'electronics', 'stationery', 'furniture', 'clothing'];
    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { 
          error: `category must be one of: ${allowedCategories.join(', ')}`,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Insert new product
    const newProduct = await db.insert(products)
      .values({
        sellerId: sellerIdInt,
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: priceNum,
        imageUrl: imageUrl.trim(),
        status: 'available',
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)),
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}