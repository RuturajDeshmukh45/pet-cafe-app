'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, FileText, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

interface TimeSlot {
  time: string;
  booked: number;
  maxCapacity: number;
  availableSeats: number;
  isFull: boolean;
}

export default function BookReservation() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchAvailability = async () => {
    if (!date) return;
    setLoadingAvailability(true);
    setError('');
    try {
      const res = await fetch(`/api/reservations/availability?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setAvailability(data.availability);
      } else {
        setError('Failed to fetch time slot availability.');
      }
    } catch (e) {
      setError('Failed to fetch availability.');
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    setStartTime(''); // Reset selected time slot when date changes
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !partySize) {
      setError('Please select date, time slot, and party size.');
      return;
    }

    const pSize = parseInt(partySize);
    const selectedSlot = availability.find(a => a.time === startTime);

    if (selectedSlot && pSize > selectedSlot.availableSeats) {
      setError(`Cannot book. Only ${selectedSlot.availableSeats} seats remaining for ${startTime}.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          startTime,
          partySize: pSize,
          notes,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/customer');
        }, 2000);
      } else {
        setError(data.error || 'Failed to place booking.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto py-6 animate-fade-in space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground">Book Café Session</h1>
        <p className="text-sm text-muted-foreground">Select a date and available time slot to reserve your spot.</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border shadow-xl space-y-6">
        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex p-4 bg-green-500/10 text-green-500 rounded-full animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Reservation Placed Successfully!</h3>
            <p className="text-sm text-muted-foreground">Redirecting you to your dashboard to view status...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold flex items-start gap-2">
                <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground text-xs flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>Select Date</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm font-semibold"
                  />
                </div>

                {/* Party Size Selector */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground text-xs flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-accent" />
                    <span>Number of Guests</span>
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots Selector */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Available Time Slots (Hourly Capacity: 15)</span>
                </label>

                {loadingAvailability ? (
                  <div className="py-8 flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  </div>
                ) : availability.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {availability.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={slot.isFull}
                        onClick={() => setStartTime(slot.time)}
                        className={`p-3.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          slot.isFull
                            ? 'bg-red-500/5 border-red-500/10 text-red-400 opacity-50 cursor-not-allowed'
                            : startTime === slot.time
                            ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]'
                            : 'bg-background hover:bg-muted border-border text-foreground'
                        }`}
                      >
                        <span className="font-extrabold text-sm">{slot.time}</span>
                        <span className="text-[9px] opacity-80 uppercase leading-none mt-0.5">
                          {slot.isFull ? 'Full' : `${slot.availableSeats} spots left`}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-2 text-center">Please select a valid date.</p>
                )}
              </div>

              {/* Booking Notes */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-accent" />
                  <span>Preferences / Notes (Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us if you have pet preferences, allergies, or if it is a special occasion..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !startTime}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-opacity-95 shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Place Reservation Booking</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
