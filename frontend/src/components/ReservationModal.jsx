import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  PawPrint, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function ReservationModal({ isOpen, onClose, preselectedPet = null, onOpenAuth }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getTomorrowDate());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');
  const [preferredPet, setPreferredPet] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (preselectedPet) {
      setPreferredPet(preselectedPet.name);
    }
  }, [preselectedPet]);

  // Load slot availability when date changes
  useEffect(() => {
    if (!isOpen || !date) return;

    async function loadAvailability() {
      setLoadingSlots(true);
      try {
        const res = await api.checkAvailability(date);
        if (res.success && res.slots) {
          setAvailableSlots(res.slots);
          // Auto select first available slot if current not available
          const firstAvail = res.slots.find((s) => s.available && s.remaining >= partySize);
          if (firstAvail && !selectedSlot) {
            setSelectedSlot(firstAvail.time);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadAvailability();
  }, [date, isOpen, partySize]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in or create an account to reserve your table.', 'info', 'Authentication Required');
      onOpenAuth('login');
      return;
    }

    if (!date) {
      showToast('Please choose a reservation date.', 'error');
      return;
    }

    if (!selectedSlot) {
      showToast('Please select an available time slot.', 'error');
      return;
    }

    const slotInfo = availableSlots.find((s) => s.time === selectedSlot);
    if (slotInfo && slotInfo.remaining < partySize) {
      showToast(`Selected slot only has ${slotInfo.remaining} spot(s) remaining.`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const finalNotes = [
        preferredPet ? `Excited to meet: ${preferredPet}` : '',
        notes.trim()
      ].filter(Boolean).join(' | ');

      const res = await api.createReservation({
        date,
        startTime: selectedSlot,
        partySize,
        notes: finalNotes
      });

      if (res.success) {
        setConfirmedBooking(res.reservation);
        showToast('Table reserved successfully!', 'success', 'Confirmed');
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      } else {
        showToast(res.message || 'Could not complete reservation.', 'error');
      }
    } catch (err) {
      showToast('Error booking reservation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-lg w-full overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e75ff] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0e2445] tracking-tight">
                Reserve Your Café Slot
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Complimentary petting access with every table booking
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {confirmedBooking ? (
          // Confirmation Ticket Screen
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                Reservation Confirmed
              </span>
              <h4 className="text-2xl font-black text-[#0e2445]">
                We Can't Wait to Welcome You!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your table is confirmed. Please arrive 5 minutes before your slot for hand sanitization.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-sky-50/80 rounded-2xl p-5 border border-sky-200 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-sky-200/80">
                <span className="text-slate-500 font-sans">Booking Ref:</span>
                <span className="font-bold text-[#0e2445]">{confirmedBooking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">Date:</span>
                <span className="font-bold text-[#0e2445]">{confirmedBooking.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">Time:</span>
                <span className="font-bold text-[#0e2445]">{confirmedBooking.start_time || confirmedBooking.startTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">Party Size:</span>
                <span className="font-bold text-[#0e2445]">{confirmedBooking.party_size || confirmedBooking.partySize} Guests</span>
              </div>
              {confirmedBooking.notes && (
                <div className="pt-2 border-t border-sky-200/80">
                  <span className="text-slate-500 font-sans block mb-1">Notes:</span>
                  <span className="text-slate-700 italic font-sans">{confirmedBooking.notes}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm cursor-pointer"
            >
              Done & Return to Café
            </button>
          </div>
        ) : (
          // Booking Form
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Date Input */}
            <div>
              <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-2">
                1. Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1e75ff]"
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider">
                  2. Choose 90-Min Time Slot
                </label>
                {loadingSlots && <span className="text-[11px] text-slate-400">Checking availability...</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSlots.map((slot) => {
                  const isAvailable = slot.available && slot.remaining >= partySize;
                  const isSelected = selectedSlot === slot.time;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e75ff] text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : isAvailable
                          ? 'bg-white border-sky-150 hover:border-sky-300 text-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-sm font-black">{slot.time}</div>
                      <div className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-sky-100' : isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isAvailable ? `${slot.remaining} spots left` : 'Full'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Party Size Counter */}
            <div>
              <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-2">
                3. Number of Guests
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-fit">
                <button
                  type="button"
                  onClick={() => setPartySize(Math.max(1, partySize - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-bold text-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="text-base font-black text-[#0e2445] px-2 min-w-[3rem] text-center">
                  {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
                </span>
                <button
                  type="button"
                  onClick={() => setPartySize(Math.min(10, partySize + 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-bold text-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                For groups larger than 10, please contact café reception for private lounge hire.
              </p>
            </div>

            {/* Pet Preference */}
            <div>
              <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-2">
                4. Preferred Animal Companion (Optional)
              </label>
              <select
                value={preferredPet}
                onChange={(e) => setPreferredPet(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1e75ff]"
              >
                <option value="">No preference — happy to meet anyone!</option>
                <option value="Luna (British Shorthair Cat)">Luna (British Shorthair Cat)</option>
                <option value="Milo (Golden Retriever Dog)">Milo (Golden Retriever Dog)</option>
                <option value="Bella (Holland Lop Rabbit)">Bella (Holland Lop Rabbit)</option>
                <option value="Oliver (Scottish Fold Cat)">Oliver (Scottish Fold Cat)</option>
                <option value="Charlie (Corgi Dog)">Charlie (Corgi Dog)</option>
                <option value="Daisy (Ragdoll Cat)">Daisy (Ragdoll Cat)</option>
                <option value="Pip (Netherland Dwarf Rabbit)">Pip (Netherland Dwarf Rabbit)</option>
              </select>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-2">
                5. Special Requests or Allergies
              </label>
              <textarea
                rows={2}
                placeholder="E.g. Celebrating a birthday, window seating preferred, high chair needed..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1e75ff]"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <span>Reserving Table...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm Table Reservation</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
