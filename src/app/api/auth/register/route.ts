import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, college, phone } = body;

    // Validate required fields
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required', code: 'EMAIL_REQUIRED' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long', code: 'INVALID_PASSWORD' },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required', code: 'NAME_REQUIRED' },
        { status: 400 }
      );
    }

    if (!college || !college.trim()) {
      return NextResponse.json(
        { error: 'College is required', code: 'COLLEGE_REQUIRED' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        password: hashedPassword,
        name: name.trim(),
        college: college.trim(),
        phone: phone ? phone.trim() : null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Remove password from response
    const { password: _, ...userResponse } = newUser[0];

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);

    // Check for unique constraint violation
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + error.message, code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}