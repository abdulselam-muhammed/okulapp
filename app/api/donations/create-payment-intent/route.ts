import { handler, validate } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import { ApiError } from "@/lib/helpers/api-error";
import * as res from "@/lib/helpers/api-response";
import { stripe } from "@/lib/helpers/stripe";
import { z } from "zod";

const createPaymentIntentDto = z.object({
  amount: z.number().positive().min(1),
});

export const POST = handler(async (req) => {
  const auth = getAuth(req);
  const { amount } = await validate(req, createPaymentIntentDto);

  if (!process.env.STRIPE_SECRET_KEY) {
    throw ApiError.internal("Stripe is not configured");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        donor_id: String(auth.userId),
        donor_email: auth.email,
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
