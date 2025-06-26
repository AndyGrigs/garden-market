import React, { useState } from 'react'

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
    
  return (
    <div>ReviewForm</div>
  )
}

export default ReviewForm