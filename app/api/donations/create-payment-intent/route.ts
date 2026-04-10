import { handler, validate } from "@/lib/helpers/controller";
import { ApiError } from "@/lib/helpers/api-error";
import * as res from "@/lib/helpers/api-response";
import { stripe } from "@/lib/helpers/stripe";
import { verifyToken } from "@/lib/helpers/auth";
import { z } from "zod";

const createPaymentIntentDto = z.object({
  amount: z.number().positive().min(1),
  guest_email: z.string().email().optional(),
  guest_name: z.string().min(1).max(200).optional(),
});

export const POST = handler(async (req) => {
  const { amount, guest_email, guest_name } = await validate(req, createPaymentIntentDto);

  if (!process.env.STRIPE_SECRET_KEY) {
    throw ApiError.internal("Stripe is not configured");
  }

  // Try to identify the donor (auth or guest)
  let donorId: number | null = null;
  let donorEmail: string | undefined;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const payload = verifyToken(authHeader.slice(7));
      donorId = payload.userId;
      donorEmail = payload.email;
    } catch {
      // Invalid token — fall through to guest flow
    }
  }

  // Guest must provide email + name
  if (!donorId) {
    if (!guest_email || !guest_name) {
      throw ApiError.badRequest("Guest donors must provide name and email");
    }
    donorEmail = guest_email;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        donor_id: donorId ? String(donorId) : "guest",
        donor_email: donorEmail || "",
        guest_name: guest_name || "",
      },
    });

    return res.success({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe error";
    throw ApiError.badRequest(`Payment initialization failed: ${message}`);
  }
});
