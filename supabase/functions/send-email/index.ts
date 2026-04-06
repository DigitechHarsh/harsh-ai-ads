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

    const transporter = nodemailer.createTransport({
      host: Deno.env.get("SMTP_HOST"),
      port: Number(Deno.env.get("SMTP_PORT")),
      secure: false, // true for 465, false for other ports
      auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
      },
    });

    const info = await transporter.sendMail({
      from: `"Harsh AI Creations" <${Deno.env.get("SMTP_USER")}>`,
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
              <p style="margin: 0; font-weight: bold;">🚀 Your Cinematic Ad will be delivered to you via WhatsApp within 12 hours!</p>
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
    });

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
