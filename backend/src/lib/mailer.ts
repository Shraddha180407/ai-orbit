import nodemailer from 'nodemailer';

const getBaseUrl = (env: any) => {
  if (env?.FRONTEND_URL) return env.FRONTEND_URL;
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL;
  return 'https://aiorbit.club';
};

const getTransporter = (env: any) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env?.EMAIL_USER || process.env.EMAIL_USER,
      pass: env?.EMAIL_PASS || process.env.EMAIL_PASS,
    },
  });
};

export async function sendVerificationLinkEmail(email: string, token: string, env: any) {
  const confirmLink = `${getBaseUrl(env)}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  const emailUser = env?.EMAIL_USER || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"The AI Signal" <${emailUser}>`,
    to: email,
    subject: 'Verify your email address',
    text: `Thanks for signing up for The AI Signal!\n\nPlease verify your email address by copying and pasting the following link into your browser:\n${confirmLink}\n\nThis link will expire in 1 hour. If you didn't request this email, you can safely ignore it.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111;">Verify your email address</h2>
        <p style="color: #444; line-height: 1.5;">
          Thanks for signing up for The AI Signal! Please click the link below to verify your email address.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${confirmLink}" style="background-color: #7C3AED; color: #fff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `,
  };

  try {
    const transporter = getTransporter(env);
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string, env: any) {
  const resetLink = `${getBaseUrl(env)}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const emailUser = env?.EMAIL_USER || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"The AI Signal" <${emailUser}>`,
    to: email,
    subject: 'Reset your password - The AI Signal',
    text: `You requested a password reset.\n\nPlease set a new password by copying and pasting the following link into your browser:\n${resetLink}\n\nThis link will expire in 1 hour. If you didn't request this email, you can safely ignore it.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111;">Reset your password</h2>
        <p style="color: #444; line-height: 1.5;">
          You requested a password reset. Please click the link below to set a new password.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetLink}" style="background-color: #7C3AED; color: #fff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `,
  };

  try {
    const transporter = getTransporter(env);
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}
