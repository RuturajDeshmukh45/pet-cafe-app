'use client';

import { useState } from 'react';
import { Coffee, ShieldCheck, Heart, HeartHandshake, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function About() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
      {/* Introduction */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-foreground">Our Story & Café Experience</h1>
        <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
          Established in 2026, Pet Café was founded on a simple belief: that animals make our lives better, and we make theirs better too. We provide a cozy, calm environment for humans to relax and a warm, safe home for our animal companions.
        </p>
      </section>

      {/* Core Values */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-border text-center space-y-3">
          <div className="p-3 bg-secondary text-primary rounded-xl inline-block">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Animal Welfare</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our pets' health and happiness come first. They receive daily veterinary checkups, structured playtime, and plenty of quiet resting hours.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border text-center space-y-3">
          <div className="p-3 bg-secondary text-primary rounded-xl inline-block">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Community Focus</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We partner with local shelters to raise awareness about pet adoption, helping rescue cats and dogs find loving forever homes.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border text-center space-y-3">
          <div className="p-3 bg-secondary text-primary rounded-xl inline-block">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Premium Quality</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We serve double-origin specialty coffees, organic teas, and pastries freshly baked each morning in our separate kitchen.
          </p>
        </div>
      </section>

      {/* Café Rules */}
      <section id="rules" className="glass-panel p-8 rounded-3xl border border-border space-y-6">
        <div className="space-y-2 border-b border-border pb-3">
          <h2 className="text-2xl font-extrabold text-foreground">Café Handling Guidelines</h2>
          <p className="text-xs text-muted-foreground">Please read these rules before visiting us to ensure a safe experience for everyone.</p>
        </div>
        
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</span>
            <span><b>Sanitize Hands First:</b> Use the sanitizer dispensers at the entrance before interacting with any animals.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</span>
            <span><b>Do Not Disturb Sleepers:</b> Let sleeping pets rest. We do not pick up or wake pets that are asleep.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</span>
            <span><b>Feed Only Approved Treats:</b> Do not feed pets human food from the menu. Only feed them café-provided pet treats.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">4</span>
            <span><b>No Flash Photography:</b> Taking photos is encouraged, but please ensure your camera flash is turned off.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">5</span>
            <span><b>Supervise Children:</b> Children under 12 must be supervised closely by an adult at all times.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">6</span>
            <span><b>Respect Play Status:</b> Some pets may wear a colored collar indicating they are resting or training. Please respect their status.</span>
          </li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6 justify-center flex flex-col">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground">Get In Touch</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Have questions about reservations, event bookings, or adoption processes? Reach out to us directly or drop by during operating hours.
            </p>
          </div>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-accent" />
              <span>+1 (555) 738-2233</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent" />
              <span>hello@petcafe.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-accent" />
              <span>124 Barista St, Espresso District, Seattle, WA</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-2xl border border-border text-xs text-muted-foreground space-y-1">
            <h4 className="font-bold text-foreground">Opening Hours</h4>
            <p>Monday - Friday: 10:00 AM - 8:00 PM</p>
            <p>Saturday - Sunday: 9:00 AM - 9:00 PM</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel p-6 rounded-2xl border border-border shadow-lg space-y-4">
          <h3 className="text-lg font-bold text-foreground">Send Us a Message</h3>
          
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 rounded-xl text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you! Your message has been received. We will get back to you shortly.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label htmlFor="name" className="font-semibold text-muted-foreground text-xs">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="font-semibold text-muted-foreground text-xs">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="font-semibold text-muted-foreground text-xs">Message</label>
              <textarea
                id="message"
                rows={4}
                placeholder="Write your query here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-opacity-95 shadow transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
