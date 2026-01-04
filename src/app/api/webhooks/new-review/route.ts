
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Webhook received for new review:', body);

    // In a real application, you would:
    // 1. Verify the webhook source (e.g., with a secret).
    // 2. Process the data (e.g., send a notification, update a spreadsheet).
    // For now, we just log it and return a success response.

    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ success: false, message: 'Error processing webhook' }, { status: 500 });
  }
}
