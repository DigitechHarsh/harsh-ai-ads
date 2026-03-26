import nodemailer from "npm:nodemailer";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SMTP_EMAIL = Deno.env.get("SMTP_EMAIL");
    const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");

    if (!SMTP_EMAIL || !SMTP_PASSWORD) {
      throw new Error("Missing SMTP credentials");
    }

    const { email, name, isEligible } = await req.json();

    if (!email || !name) {
      throw new Error("Missing recipient details");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Harsh AI Creations" <${SMTP_EMAIL}>`,
      to: email,
      subject: isEligible 
        ? "Your request was received! (₹299 Offer Applied 🎉)" 
        : "Your request was received! - Harsh AI Creations",
      html: isEligible 
        ? `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi ${name},</h2>
            <p>Thank you for choosing Harsh AI Creations!</p>
            <p><strong>Great news!</strong> You have successfully claimed one of the final spots for our <strong>₹299 Cinematic Ad</strong> offer.</p>
            <p>Our team will contact you within the next 24 hours to begin creating your masterpiece.</p>
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

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
