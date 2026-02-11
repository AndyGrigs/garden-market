import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateReviewMutation } from '@/features/buyer/api/reviewApi';
import { Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  onClose: () => void;
  productId?: string;
  productName?: string;
}

const ReviewForm = memo(function ReviewForm({ onClose, productId, productName }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { t } = useTranslation();

  // Отримуємо дані користувача з Redux
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [createReview, { isLoading }] = useCreateReviewMutation();

  // Якщо користувач не авторизований - показуємо повідомлення
  if (!isAuthenticated) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              
            </h2>
            <p className="text-gray-600 mb-6">
              Щоб залишити відгук, необхідно увійти в аккаунт
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Закрити
              </button>
              <button
                onClick={() => {
                  onClose();
                  // Тут можна додати редирект на сторінку логіну
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Увійти в аккаунт
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData = {
      rating,
      comment,
      ...(productId && { productId }),
    };

    try {
      await createReview(reviewData).unwrap();
      toast.success(t('reviews.success'));
      onClose();
    } catch (error) {
      console.error('Failed to create review:', error);
      toast.error(t('reviews.error'));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {productId
              ? t('reviews.writeProductReview')
              : t('reviews.writeWebsiteReview')}
          </h2>

          {productName && (
            <p className="text-gray-600 mb-4">
              {t('reviews.reviewingProduct')}:{' '}
              <span className="font-semibold">{productName}</span>
            </p>
          )}

          {/* Показуємо ім'я авторизованого користувача */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Відгук від:</p>
            <p className="font-semibold text-gray-800">{user?.fullName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Рейтинг */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('reviews.rating')}
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Коментар */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('reviews.comment')}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t('reviews.commentPlaceholder')}
              />
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? t('common.submitting') : t('reviews.submitReview')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default ReviewForm;