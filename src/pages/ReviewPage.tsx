import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReviewForm from '../components/Features/Reviwes/ReviewForm';
import ReviewsSection from '@/components/Features/Reviwes/ReviewsSection';
import MainPageLink from '../shared/MainPageLink';

export default function ReviewsPage() {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('reviews.allReviews')}
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t('reviews.writeReview')}</span>
            </button>
            <MainPageLink/>
          </div>
        </div>

        <ReviewsSection />

        {isReviewFormOpen && (
          <ReviewForm onClose={() => setIsReviewFormOpen(false)} />
        )}
      </div>
    </div>
  );
}