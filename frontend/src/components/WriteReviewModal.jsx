import React, { useState } from 'react';
import { X, Star, MessageSquarePlus, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function WriteReviewModal({ isOpen, onClose, onReviewSubmitted, onOpenAuth }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in to share a review.', 'info');
      onOpenAuth('login');
      return;
    }

    if (!comment || comment.trim().length < 5) {
      showToast('Please write a sentence or two describing your café visit.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitReview({
        rating,
        comment: comment.trim()
      });

      if (res.success) {
        showToast('Review submitted! Thank you for your feedback.', 'success');
        setComment('');
        onReviewSubmitted?.();
        onClose();
      } else {
        showToast(res.message || 'Failed to submit review.', 'error');
      }
    } catch (err) {
      showToast('Error submitting review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0e2445]">Rate Your Visit</h3>
              <p className="text-xs text-slate-500 font-medium">Tell fellow pet lovers about your experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star selector */}
          <div className="text-center space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Your Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-115 active:scale-95"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-600 block">
              {rating === 5 ? 'Purr-fect! (5/5)' : rating === 4 ? 'Great visit! (4/5)' : `${rating} Stars`}
            </span>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-2">
              Your Feedback
            </label>
            <textarea
              required
              rows={4}
              placeholder="What did you love? Which pet was your favorite? How was the coffee and pastry?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1e75ff] leading-relaxed"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Post Review</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
