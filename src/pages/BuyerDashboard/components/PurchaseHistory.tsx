import { motion } from "@/utils/motionComponents";
import { Package } from "lucide-react";
import { getCurrency } from '@/shared/helpers/getCurrency';
import { useGetUserOrdersQuery } from "@/features/buyer/api/orderApi";
import { useTranslation } from "react-i18next";




export default function PurchaseHistory({ userId }: { userId: string }) {
    const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetUserOrdersQuery(
        userId
      );
      const { t } = useTranslation();
    
    return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white rounded-lg shadow-md p-6 mb-6"
  >
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <Package className="h-5 w-5 mr-2" />
      {t("dashboard.orderHistory")}
    </h2>
    
    {ordersLoading ? (
      <div className="flex justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-8 w-8 border-b-2 border-emerald-600"
        />
      </div>
    ) : ordersError ? (
      <div className="text-center text-red-600 py-8">
        <p>{t("dashboard.failedToLoadOrders")}</p>
      </div>
    ) : !orders || orders.length === 0 ? (
      <div className="text-gray-600 text-center py-8">
        {t("dashboard.noOrders")}
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{t("dashboard.orderNumber")}{order.orderNumber || order._id.slice(-8)}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-emerald-600">
                  {order.totalAmount.toFixed(2)} {order.currency || getCurrency()}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'paid' ? 'bg-green-100 text-green-800' :
                  order.status === 'awaiting_payment' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {t(`dashboard.orderStatus.${order.status}`, { defaultValue: order.status })}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.title?.ru || item.title?.ro || 'Product'} x{item.quantity}</span>
                  <span>{item.subtotal.toFixed(2)} {order.currency || getCurrency()}</span>
                </div>
              ))}
            </div>

            {order.paymentStatus && (
              <div className="mt-3 pt-3 border-t">
                <span className="text-xs text-gray-600">{t("dashboard.paymentStatus", { defaultValue: "Статус оплати" })}: </span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'unpaid' ? 'bg-red-100 text-red-800' :
                  order.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {t(`dashboard.payment.${order.paymentStatus}`, { defaultValue: order.paymentStatus })}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </motion.div>
  );
}