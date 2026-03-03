import { NextResponse } from 'next/server';
import { isValidCode } from '../../../../lib/feedbackCodes';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    const valid = isValidCode(code);

    return NextResponse.json({ valid });
  } catch (error) {
    console.error('Error validating feedback code:', error);
    return NextResponse.json(
      { valid: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
