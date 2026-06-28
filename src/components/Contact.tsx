import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('loading');
    try {
      await api.post('/messages', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      console.error('Error sending message:', err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact-section" className="py-24 px-6 max-w-4xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Get In <span className="text-blue-400">Touch</span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-400 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-400 font-light max-w-md mx-auto">
          Have a question, project proposal, or training inquiry? Send a message directly to Youssef.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden"
      >
        {/* Glow behind form */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                Name <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className="w-full bg-[#0A182E]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address <span className="text-blue-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full bg-[#0A182E]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
              Phone Number <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +201553514081"
              className="w-full bg-[#0A182E]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
              Message <span className="text-blue-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Write your message here..."
              className="w-full bg-[#0A182E]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none animate-none"
            />
          </div>

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium"
            >
              ✓ Thank you! Your message has been sent successfully. Youssef will get back to you shortly.
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium"
            >
              ⚠ {errorMessage}
            </motion.div>
          )}

          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
            >
              {status === 'loading' ? 'Sending Message...' : 'Send Message →'}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default Contact;
