"""
Stripe Payment Processor
------------------------
Handles split payments using Stripe Connect.
Logic:
1. Guest pays Total Charge.
2. Funds are split:
    - Net Rate -> Ancile Platform (Held for TBO settlement).
    - Markup -> Agent's Connected Account (Instant/Payout).
    - Fee -> Ancile's Application Fee.
"""

import logging
import os
from typing import Any, Dict

import stripe

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Stripe with Secret Key (from env in production)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder_key")


class PaymentProcessor:
    """
    Handles split payments using Stripe Connect.

    Logic:
    1. Guest pays Total Charge.
    2. Funds are split:
        - Net Rate -> Ancile Platform (Held for TBO settlement).
        - Markup -> Agent's Connected Account (Instant/Payout).
        - Fee -> Ancile's Application Fee.
    """

    def __init__(self):
        # Platform fee percentage (Ancile's take), if dynamic override in method
        self.ancile_flat_fee_cents = 2000  # $20.00 example fixed fee

    def create_checkout_session(
        self,
        guest_email: str,
        room_name: str,
        total_amount_cents: int,  # $250.00 -> 25000
        agent_connect_id: str,   # The Agent's Stripe Account ID (acct_...)
        markup_cents: int,       # $50.00 -> 5000 (Agent's Profit)
        currency: str = "usd"
    ) -> Dict[str, Any]:
        """
        Creates a Stripe Checkout Session with split payments.

        Args:
            total_amount_cents: Total charged to guest (e.g., 25000).
            markup_cents: The amount transfered to the agent (e.g., 5000).
            agent_connect_id: The destination connected account for the markup.

        Returns:
            JSON with checkout_url and session_id.
        """

        # Validation
        if markup_cents >= total_amount_cents:
            raise ValueError("Markup cannot exceed total amount.")

        # 1. Ancile Fee logic
        # In this model:
        # Total = Net (TBO) + Markup (Agent) + Fee (Ancile)
        # OR
        # Markup includes Fee?
        # Based on prompt:
        # Total: $250
        # TBO Net: $180 (Held by Platform)
        # Agent Markup: $50 (Transfer to Agent)
        # Ancile Fee: $20 (Platform Revenue)

        # Stripe 'application_fee_amount' is what the platform keeps FROM the transfer.
        # However, `transfer_data` sends funds to a connected account.

        # APPROACH: Direct Charge on Platform (Platform is Merchant of Record)
        # We charge $250.
        # We transfer $50 to Agent.
        # We keep $200 ($180 for TBO Float + $20 Revenue).

        try:
            # Create Session
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': f"Booking: {room_name}",
                            'description': "Hotel Reservation via Ancile"
                        },
                        'unit_amount': total_amount_cents,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url="https://ancile.app/success?session_id={CHECKOUT_SESSION_ID}",
                cancel_url="https://ancile.app/cancel",
                customer_email=guest_email,

                # SPLIT PAYMENT LOGIC
                payment_intent_data={
                    # The amount to transfer to the connected account (Agent)
                    'transfer_data': {
                        'destination': agent_connect_id,
                        'amount': markup_cents,
                    },
                    # We do NOT use application_fee_amount here because we are the primary
                    # merchant holding the bulk ($180+$20) and only sending the Markup ($50).
                    # If we used 'on_behalf_of', the Agent would be the merchant.
                    # Since we hold the Float for TBO, WE must be the merchant.
                },
                metadata={
                    "type": "hotel_booking",
                    "markup": markup_cents,
                    "net_rate_held": total_amount_cents - markup_cents
                }
            )

            logger.info("Checkout Session Created: %s", session.id)
            return {"checkout_url": session.url, "session_id": session.id}

        except stripe.error.StripeError as e:
            logger.error("Stripe Error: %s", e)
            raise e
        except Exception as e:
            logger.error("Error creating checkout session: %s", e)
            raise e

    def handle_webhook(self, payload: bytes, sig_header: str, webhook_secret: str):
        """
        Handles 'checkout.session.completed' to confirm payment and trigger
        DB/Redis commitment.
        """
        event = None
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as exc:
            raise ValueError("Invalid payload") from exc
        except stripe.error.SignatureVerificationError as exc:
            raise stripe.error.SignatureVerificationError(
                "Invalid signature", sig_header, payload
            ) from exc

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            # Commit the lock (Redis -> SQL) - Mechanism to be implemented in integration phase
            logger.info(
                "Payment Successful for Session: %s. Triggering Inventory Commit.", session['id'])
            return True

        return False
