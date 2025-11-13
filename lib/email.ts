import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset Your Password - MoodyMe',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6389FF 0%, #4755B6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Reset Your Password</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hello,</p>
              <p>You requested to reset your password. Click the button below to reset it. This link will expire in 1 hour.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background: #6389FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
              </div>
              <p>If you didn't request this, please ignore this email.</p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated email. Please do not reply.</p>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
