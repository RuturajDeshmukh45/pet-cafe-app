'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

interface Reservation {
  id: string;
  date: string;
  startTime: string;
}

export default function LeaveReview() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedResId, setSelectedResId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRes = async () => {
      try {
        const res = await fetch('/api/reservations');
        if (res.ok) {
          const data = await res.json();
          // Filter to show confirmed reservations that occurred or are active
          const confirmed = data.reservations.filter((r: any) => r.status === 'Confirmed');
          setReservations(confirmed);
          if (confirmed.length > 0) {
            setSelectedResId(confirmed[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchRes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      setError('Please write a comment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          reservationId: selectedResId || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/customer');
        }, 2000);
      } else {
        setError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto py-6 animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground">Share Your Experience</h1>
        <p className="text-sm text-muted-foreground">Your feedback helps us make the café a happier place for guests and pets.</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border shadow-xl space-y-6">
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-3 bg-green-500/10 text-green-500 rounded-full animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Review Submitted!</h3>
            <p className="text-xs text-muted-foreground">Thank you for your feedback. Redirecting...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              {/* Star Rating */}
              <div className="space-y-2 text-center">
                <label className="font-bold text-muted-foreground text-xs block">Overall Rating</label>
                <div className="flex justify-center items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-amber-400 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating ?? rating) ? 'fill-current' : 'stroke-current fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Associate Reservation */}
              {reservations.length > 0 && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground text-xs">Associate with Visit (Optional)</label>
                  <select
                    value={selectedResId}
                    onChange={(e) => setSelectedResId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent text-xs font-semibold"
                  >
                    <option value="">General Review (No specific visit)</option>
                    {reservations.map((r) => (
                      <option key={r.id} value={r.id}>
                        Visit on {r.date} at {r.startTime}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground text-xs">Your Feedback</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you liked! Mention your favorite pets, barista coffee, or café environment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm resize-none"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !comment}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-opacity-95 shadow transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
