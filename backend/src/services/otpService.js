import OTP from '../models/OTP.js';

/**
 * Generate 6-digit OTP code
 */
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create and send OTP code
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, code?: string, error?: string}>}
 */
export async function createAndSendOTP(email) {
  try {
    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Generate new code
    const code = generateCode();

    // Save to database
    const otp = await OTP.create({
      email,
      code,
      attempts: 0,
      verified: false
    });

    // In production, send email here
    // For now, we just log it
    console.log(`OTP for ${email}: ${code}`);

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // Example:
    // await sendEmail({
    //   to: email,
    //   subject: 'Код подтверждения LegalFlow',
    //   text: `Ваш код подтверждения: ${code}\n\nКод действителен 10 минут.`
    // });

    return { success: true, code };
  } catch (error) {
    console.error('OTP creation error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify OTP code
 * @param {string} email - User email
 * @param {string} code - OTP code to verify
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function verifyOTP(email, code) {
  try {
    const otp = await OTP.findOne({ email, code });

    if (!otp) {
      // Increment attempts on existing code if found by email only
      const existingOTP = await OTP.findOne({ email });
      if (existingOTP) {
        existingOTP.attempts += 1;
        await existingOTP.save();

        if (existingOTP.attempts >= 3) {
          await OTP.deleteOne({ _id: existingOTP._id });
          return { success: false, error: 'Превышено количество попыток. Запросите новый код.' };
        }
      }
      return { success: false, error: 'Неверный код подтверждения' };
    }

    if (otp.attempts >= 3) {
      await OTP.deleteOne({ _id: otp._id });
      return { success: false, error: 'Превышено количество попыток. Запросите новый код.' };
    }

    // Mark as verified
    otp.verified = true;
    await otp.save();

    return { success: true };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if OTP was verified
 * @param {string} email - User email
 * @param {string} code - OTP code
 * @returns {Promise<boolean>}
 */
export async function isOTPVerified(email, code) {
  const otp = await OTP.findOne({ email, code, verified: true });
  return !!otp;
}
