import { CartItem } from "@/types";

interface CheckoutModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'your-paypal-client-id';


const CheckoutModal = ({items, total, onClose, onSuccess}: CheckoutModalProps) => {
    
  return (
    <div>CheckoutModal</div>
  )
}

export default CheckoutModal