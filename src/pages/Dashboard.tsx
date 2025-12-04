import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { RootState } from "../store/store";
import { useTranslation } from "react-i18next";
import { Home, Package, Star } from "lucide-react";
import { useGetUserOrdersQuery } from "../store/api/orderApi";
import { useGetUserReviewsQuery } from "../store/api/reviewApi";
import { motion } from "@/utils/motionComponents";
import { getCurrency } from '../shared/helpers/getCurrency';

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id ?? "";
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetUserOrdersQuery(
    userId
  );
  
  const { data: userReviews, isLoading: reviewsLoading, error: reviewsError } = useGetUserReviewsQuery(
    userId
  );
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("dashboard.welcome", { name: user.fullName })}
            </h1>
            <Link
              to="/"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>{t("dashboard.mainPage")}</span>
            </Link>
          </div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              {t("dashboard.profile")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("dashboard.name")}
                </label>
                <p className="mt-1 text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("dashboard.email")}
                </label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("dashboard.language")}
                </label>
                <p className="mt-1 text-gray-900 capitalize">{user.language || 'en'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("dashboard.role")}
                </label>
                <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          </motion.div>

          {/* Purchase History */}
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
                        <p className="font-semibold">{t("dashboard.orderNumber")}{order._id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600">
                          {order.totalAmount.toFixed(2)} {getCurrency()}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t(`dashboard.orderStatus.${order.status}`, order.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.productName} x{item.quantity}</span>
                          <span>{(item.price * item.quantity).toFixed(2)} {getCurrency()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* User Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              {t("dashboard.yourReviews")}
            </h2>
            
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="rounded-full h-8 w-8 border-b-2 border-emerald-600"
                />
              </div>
            ) : reviewsError ? (
              <div className="text-center text-red-600 py-8">
                <p>{t("dashboard.failedToLoadReviews")}</p>
              </div>
            ) : !userReviews || userReviews.length === 0 ? (
              <div className="text-gray-600 text-center py-8">
                {t("dashboard.noReviews")}
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    
                    {review.productName && (
                      <p className="text-sm text-gray-600">
                        {t("dashboard.product")}: {review.productName}
                      </p>
                    )}
                    
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      review.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {t(`dashboard.${review.type}Review`)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}