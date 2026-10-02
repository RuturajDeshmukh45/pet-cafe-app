import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, PawPrint } from 'lucide-react';
import { api } from '../services/api';

export function ReviewsSection({ onWriteReview }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.getReviews();
      if (res.success) {
        setReviews(res.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-2">
            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0e2445] tracking-tight">
            Loved By Coffee & Pet Enthusiasts
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Read stories from guests who spent heartwarming afternoons at our café.
          </p>
        </div>

        <button
          onClick={onWriteReview}
          className="flex items-center gap-2 px-6 py-3 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-full text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all self-start md:self-auto cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-sky-100 p-6">
          <p className="text-slate-500 text-sm">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-150 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < r.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-2">{r.rating}.0 / 5</span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-[#1e75ff] flex items-center justify-center font-bold text-xs">
                    {r.customer_name ? r.customer_name.charAt(0) : 'G'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0e2445]">{r.customer_name || 'Verified Visitor'}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Visit
                    </span>
                  </div>
                </div>

                <PawPrint className="w-5 h-5 text-sky-200 fill-current" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
