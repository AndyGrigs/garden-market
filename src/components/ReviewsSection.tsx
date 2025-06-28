import { Star } from 'lucide-react';
import { useGetReviewsQuery } from '../store/api/reviewApi';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function ReviewsSection() {
  const { data: reviews, isLoading } = useGetReviewsQuery();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-8 w-8 border-b-2 border-emerald-600"
        />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t('reviews.customerReviews')}
          </h2>
          <p className="text-center text-gray-600">
            {t('reviews.noReviews')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t('reviews.customerReviews')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating}/5
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-3">
                {review.comment}
              </p>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800">
                  {review.userName}
                </p>
                {review.productName && (
                  <p className="text-sm text-gray-600">
                    {t('reviews.reviewFor')}: {review.productName}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}