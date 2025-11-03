# Stripe Payment Integration Guide

## Overview

This document describes the Stripe payment integration implemented in the Garden Market application. The integration provides secure card payment processing using Stripe Elements and follows best practices for PCI compliance.

## Architecture

### Components Structure

```
src/
├── components/
│   └── StripeCheckoutForm.tsx      # Payment form component with Stripe Elements
├── contexts/
│   └── StripeContext.tsx           # Stripe initialization and Elements provider
├── pages/
│   ├── CheckoutPage.tsx            # Checkout page with payment form
│   └── OrderSuccessPage.tsx        # Success confirmation page
├── store/
│   └── api/
│       └── paymentsApi.ts          # RTK Query API for payment endpoints
└── types/
    └── stripe.ts                   # TypeScript type definitions
```

## Features

- ✅ Secure card payment processing with Stripe Elements
- ✅ PCI DSS compliant (card data never touches your server)
- ✅ 3D Secure (SCA) support built-in
- ✅ Real-time card validation
- ✅ Multi-language support (EN, RO, RU)
- ✅ Error handling with user-friendly messages
- ✅ Redux Toolkit Query integration
- ✅ Responsive design with Tailwind CSS

## Setup Instructions

### 1. Backend Configuration

Ensure your backend has the following endpoints configured:

**GET** `/payments/stripe/config`
- Returns Stripe publishable key
```json
{
  "success": true,
  "publishableKey": "pk_test_..."
}
```

**POST** `/payments/stripe/create-intent`
- Creates a Payment Intent
```json
// Request
{
  "orderId": "order_123",
  "amount": 99.99,
  "currency": "EUR",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Response
{
  "success": true,
  "clientSecret": "pi_..._secret_...",
  "paymentId": "payment_123"
}
```

**POST** `/payments/stripe/confirm`
- Confirms payment on backend
```json
// Request
{
  "paymentIntentId": "pi_..."
}

// Response
{
  "success": true,
  "payment": {
    "id": "payment_123",
    "orderId": "order_123",
    "status": "succeeded",
    "amount": 99.99,
    "currency": "EUR"
  }
}
```

### 2. Environment Variables

Add to your `.env` file:
```env
VITE_API_URL=http://localhost:4444
```

### 3. Dependencies

Already installed:
```json
{
  "@stripe/stripe-js": "^x.x.x",
  "@stripe/react-stripe-js": "^x.x.x"
}
```

## Usage

### Basic Payment Flow

1. User navigates to checkout with order details:
```typescript
navigate(`/checkout?orderId=123&amount=99.99&currency=EUR`);
```

2. CheckoutPage renders with StripeProvider and StripeCheckoutForm

3. User enters card details in Stripe Elements

4. On submit:
   - Frontend creates Payment Intent via API
   - Stripe.js confirms card payment (handles 3D Secure if needed)
   - Frontend confirms payment on backend
   - User redirected to success page

### Example: Initiating Payment

```typescript
import { useNavigate } from 'react-router-dom';

function CartComponent() {
  const navigate = useNavigate();

  const handleCheckout = (orderId: string, amount: number) => {
    navigate(`/checkout?orderId=${orderId}&amount=${amount}&currency=EUR`);
  };

  return (
    <button onClick={() => handleCheckout('order_123', 99.99)}>
      Proceed to Payment
    </button>
  );
}
```

## Testing

### Test Cards (Stripe Test Mode)

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
Name: Any name
```

**3D Secure Authentication Required:**
```
Card: 4000 0027 6000 3184
Expiry: Any future date
CVC: Any 3 digits
```

**Declined (Insufficient Funds):**
```
Card: 4000 0000 0000 9995
Expiry: Any future date
CVC: Any 3 digits
```

**Declined (Card Error):**
```
Card: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

More test cards: https://stripe.com/docs/testing

## Security Considerations

1. **PCI Compliance**: Card data is handled entirely by Stripe Elements and never touches your server
2. **HTTPS Only**: Stripe requires HTTPS in production
3. **Webhook Verification**: Always verify webhook signatures on your backend
4. **Amount Validation**: Verify amounts on backend before creating Payment Intents
5. **Idempotency**: Use idempotency keys for payment creation to prevent duplicates

## Error Handling

The implementation includes comprehensive error handling:

```typescript
const ERROR_MESSAGES: Record<string, string> = {
  card_declined: 'payment.errors.card_declined',
  insufficient_funds: 'payment.errors.insufficient_funds',
  incorrect_cvc: 'payment.errors.incorrect_cvc',
  expired_card: 'payment.errors.expired_card',
  processing_error: 'payment.errors.processing_error',
  invalid_number: 'payment.errors.invalid_number',
};
```

All error messages are internationalized and displayed to users in their preferred language.

## Customization

### Styling Stripe Elements

Modify `CARD_ELEMENT_OPTIONS` in [StripeCheckoutForm.tsx](src/components/StripeCheckoutForm.tsx):

```typescript
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '16px',
      // ... more styles
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};
```

### Currency Support

To change the default currency, update the `currency` prop:

```typescript
<StripeCheckoutForm
  orderId={orderId}
  amount={amount}
  currency="USD" // Change here
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

## Translations

Payment-related translations are located in:
- `/public/locales/en/translation.json` (needs to be created)
- `/public/locales/ro/translation.json`
- `/public/locales/ru/translation.json`

All payment strings use the `payment.*` namespace.

## API Integration

The payment API is integrated with Redux Toolkit Query:

```typescript
import {
  useCreateStripePaymentIntentMutation,
  useConfirmStripePaymentMutation,
  useGetStripeConfigQuery,
} from '../store/api/paymentsApi';

// In your component
const [createIntent, { isLoading }] = useCreateStripePaymentIntentMutation();
const [confirmPayment] = useConfirmStripePaymentMutation();
const { data: config } = useGetStripeConfigQuery();
```

## Troubleshooting

### "Stripe has not been properly initialized"
- Ensure backend returns valid publishable key
- Check network requests in DevTools

### "Payment Intent creation failed"
- Verify backend endpoint is accessible
- Check request payload format
- Ensure authentication token is valid

### "Card element not found"
- Verify StripeProvider wraps your form
- Check that Stripe.js loaded successfully

### Elements not rendering
- Check browser console for errors
- Verify Stripe publishable key is valid
- Ensure proper component nesting (Elements > Form)

## Production Checklist

- [ ] Replace test Stripe keys with production keys
- [ ] Enable HTTPS on frontend
- [ ] Configure webhook endpoints
- [ ] Set up webhook signature verification
- [ ] Test with real cards (use small amounts)
- [ ] Configure payment confirmation emails
- [ ] Set up monitoring and alerting
- [ ] Review Stripe dashboard for disputes/chargebacks
- [ ] Implement receipt generation
- [ ] Add logging for payment events

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [React Stripe.js](https://stripe.com/docs/stripe-js/react)
- [Payment Intents Guide](https://stripe.com/docs/payments/payment-intents)
- [Testing Guide](https://stripe.com/docs/testing)
- [Security Best Practices](https://stripe.com/docs/security)

## Support

For issues or questions:
1. Check Stripe Dashboard logs
2. Review browser console errors
3. Check network requests in DevTools
4. Verify backend API responses
5. Consult Stripe documentation

## License

This integration follows the same license as the main Garden Market application.
