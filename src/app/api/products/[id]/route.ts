import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(product[0], { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message, code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, category, price, imageUrl, status } = body;

    // Validate price if provided
    if (price !== undefined && price !== null) {
      if (typeof price !== 'number' || price <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number', code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
      }
    }

    // Validate category if provided
    if (category !== undefined && category !== null) {
      const validCategories = ['books', 'electronics', 'stationery', 'furniture', 'clothing'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { 
            error: `Category must be one of: ${validCategories.join(', ')}`, 
            code: 'VALIDATION_ERROR' 
          },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (status !== undefined && status !== null) {
      const validStatuses = ['available', 'sold'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { 
            error: `Status must be one of: ${validStatuses.join(', ')}`, 
            code: 'VALIDATION_ERROR' 
          },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: any = {};
    
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (category !== undefined) updates.category = category;
    if (price !== undefined) updates.price = price;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl.trim();
    if (status !== undefined) updates.status = status;

    // Check if there are any fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for update', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message, code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully', id: parseInt(id) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message, code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}