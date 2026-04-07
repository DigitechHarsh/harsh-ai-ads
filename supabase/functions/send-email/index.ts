import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name, isEligible } = await req.json();
    console.log(`Step 1: Attempting to send email to ${email} for user ${name}`);

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error("Step 2 Error: Missing SMTP secrets in Supabase Dashboard!");
      console.log(`Current Secrets: HOST=${!!smtpHost}, PORT=${!!smtpPort}, USER=${!!smtpUser}, PASS=${!!smtpPass}`);
      throw new Error("Missing SMTP configuration secrets.");
    }

    console.log(`Step 3: Creating transporter with ${smtpHost}:${smtpPort}`);
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // Use SSL for 465
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    console.log("Step 4: Preparing the mail content...");
    const mailOptions = {
      from: `"Harsh AI Creations" <${smtpUser}>`,
      to: email,
      subject: isEligible 
        ? "Your request was received! (₹399 Offer Applied 🎉)" 
        : "Your request was received! - Harsh AI Creations",
        html: isEligible 
        ? `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #D4AF37;">Hi ${name},</h2>
            <p>Thank you for choosing <strong>Harsh AI Creations</strong>!</p>
            <p><strong>Order Confirmed!</strong> You have successfully claimed our <strong>₹399 Cinematic Ad</strong> offer.</p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">🚀 Your Cinematic Ad will be delivered to you via WhatsApp within 24-48 hours!</p>
            </div>
            <p>Our team is already working on your product visuals using the images you provided.</p>
            <br/>
            <p>Best regards,<br/>The Harsh AI Creations Team</p>
          </div>
        `
        : `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi ${name},</h2>
            <p>Thank you for choosing Harsh AI Creations!</p>
            <p>While our special offer slots are currently full, our expert team is still reviewing your request.</p>
            <p>We will contact you within the next 24 hours with our current best pricing to start creating your cinematic ad.</p>
            <br/>
            <p>Best regards,<br/>The Harsh AI Creations Team</p>
          </div>
        `
    };

    console.log("Step 5: Sending the email via SMTP...");
    const info = await transporter.sendMail(mailOptions);
    console.log(`Step 6 Success: Email sent successfully! MessageID: ${info.messageId}`);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error(`CRITICAL FAILURE: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
