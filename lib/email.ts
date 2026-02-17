import { Resend } from 'resend';

export async function sendOTP(email: string, otp: string) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Provide dummy if missing for init

  // Development Fallback: If no API key is provided or it's a placeholder, log to console
  const isPlaceholder = !process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY === 'your_key_here' ||
    process.env.RESEND_API_KEY === 'your_resend_api_key_here';

  if (isPlaceholder) {
    console.log('--- DEVELOPMENT MODE: OTP EMAIL ---');
    console.log(`To: ${email}`);
    console.log(`Code: ${otp}`);
    console.log('-----------------------------------');
    return { success: true, data: { mock: true } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'SafeTyres <onboarding@resend.dev>', // Default for testing, user should verify domain for custom sender
      to: [email],
      subject: 'Verify your SafeTyres Account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 8px;">
          <h2 style="color: #111827; margin-bottom: 16px;">Welcome to SafeTyres!</h2>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">Please use the following 4-digit code to verify your account:</p>
          <div style="background-color: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7c3aed;">${otp}</span>
          </div>
          <p style="color: #9ca3af; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
          <hr style="margin-top: 32px; border: 0; border-top: 1px solid #e5e7eb;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">© ${new Date().getFullYear()} SafeTyres. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email send catch error:', err);
    return { success: false, error: err };
  }
}
