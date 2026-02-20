
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Review } from "../../../types/IReviews";

interface UserReviewsProps {
  userReviews: Review[];
  reviewsLoading: boolean;
  reviewsError: boolean;
}

export const UserReviews = ({ userReviews, reviewsLoading, reviewsError }: UserReviewsProps) => {
  const { t } = useTranslation();
  return (
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
  )
}
