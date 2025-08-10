import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ReviewFormData } from '../types/IReviews';
import { Star } from 'lucide-react';
import { useCreateReviewMutation } from '../store/api/reviewApi';
import toast from 'react-hot-toast';

interface ReviewFormProps {

  onClose: () => void;
  productId?: string;
  productName?: string;
}

const ReviewForm = ({onClose, productId, productName}: ReviewFormProps) => {
    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    
    const {t} = useTranslation();

    const [createReview, {isLoading}] = useCreateReviewMutation();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData: ReviewFormData = {
      name,
      rating,
      comment,
      type: productId ? 'product' : 'website',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('reviews.name')}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t('reviews.namePlaceholder')}
              />

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
}

export default ReviewForm