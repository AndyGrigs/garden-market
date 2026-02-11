import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from '@/utils/motionComponents';
import ReviewCarousel from './ReviewCarousel';
import { useGetReviewsQuery } from '@/features/buyer/api/reviewApi';

const ReviewsSection = memo(function ReviewsSection() {
  const { data: reviews, isLoading } = useGetReviewsQuery();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t('reviews.customerReviews')}
          </h2>
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-8 w-8 border-b-2 border-emerald-600"
            />
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t('reviews.customerReviews')}
          </h2>
          <div className="text-center text-gray-600 py-12">
            <p className="text-lg">{t('reviews.noReviews')}</p>
            <p className="text-sm mt-2">{t('reviews.first')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('reviews.customerReviews')}
          </h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('reviews.customerSays')}
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-6xl mx-auto">
          <ReviewCarousel reviews={reviews} />
        </div>

        {/* View All Reviews Button */}
        {reviews.length > 6 && (
          <div className="text-center mt-8">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              Переглянути всі відгуки ({reviews.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
});

export default ReviewsSection;