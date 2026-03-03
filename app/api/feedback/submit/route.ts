import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { isValidCode } from '../../../../lib/feedbackCodes';

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, feedback, category } = body;

    // Validate required fields
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feedback is required' },
        { status: 400 }
      );
    }

    // Validate code again server-side
    if (!isValidCode(code)) {
      return NextResponse.json(
        { success: false, error: 'Invalid feedback code' },
        { status: 403 }
      );
    }

    // Check SendGrid configuration
    if (!apiKey) {
      console.error('SENDGRID_API_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const feedbackEmail = process.env.FEEDBACK_EMAIL;
    if (!feedbackEmail) {
      console.error('FEEDBACK_EMAIL is not configured');
      return NextResponse.json(
        { success: false, error: 'Feedback recipient is not configured' },
        { status: 500 }
      );
    }

    // Prepare email
    const timestamp = new Date().toISOString();
    const categoryLabel = category || 'General';
    const subject = `[VoxKit Feedback] Code: ${code} - ${categoryLabel}`;

    const emailBody = `Feedback Space Code: ${code}
Category: ${categoryLabel}
Submitted: ${timestamp}

---
${feedback.trim()}
---

This feedback was submitted anonymously via voxkit.com/feedback`;

    // Send email via SendGrid
    // Note: We do NOT log IP addresses or any identifying information
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || feedbackEmail;

    try {
      await sgMail.send({
        to: feedbackEmail,
        from: fromEmail, // Must be a verified sender in SendGrid
        subject,
        text: emailBody,
      });
    } catch (sendError: unknown) {
      const err = sendError as { code?: number; response?: { body?: unknown } };
      console.error('SendGrid error:', err.code, err.response?.body);
      if (err.code === 403) {
        return NextResponse.json(
          { success: false, error: 'Email sender not verified in SendGrid' },
          { status: 500 }
        );
      }
      throw sendError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
