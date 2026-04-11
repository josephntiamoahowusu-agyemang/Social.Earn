import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';

export const HelpCenter = () => {
  const { user } = useAuth();
  const { addNotification } = useData();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('bug');
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('social_earn_help_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const categories = [
    { id: 'bug', name: '🐛 Bug Report', color: 'red' },
    { id: 'feature', name: '💡 Feature Request', color: 'blue' },
    { id: 'payment', name: '💰 Payment Issue', color: 'amber' },
    { id: 'account', name: '👤 Account Issue', color: 'indigo' },
    { id: 'other', name: '❓ Other', color: 'slate' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      addNotification({
        title: 'Required Fields',
        message: 'Please fill in subject and message',
        type: 'error'
      });
      return;
    }

    const newTicket = {
      id: Date.now(),
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      subject,
      message,
      category,
      status: 'open',
      createdAt: new Date().toISOString(),
      responses: []
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    localStorage.setItem('social_earn_help_tickets', JSON.stringify(updated));

    addNotification({
      title: '✅ Ticket Submitted',
      message: 'Your support request has been sent. We\'ll get back to you soon!',
      type: 'success'
    });

    setSubject('');
    setMessage('');
    setCategory('bug');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const userTickets = tickets.filter(t => t.userId === user?.id);
  const getCategoryColor = (cat) => {
    const catObj = categories.find(c => c.id === cat);
    const colors = {
      red: 'border-red-500/30 bg-red-500/5',
      blue: 'border-blue-500/30 bg-blue-500/5',
      amber: 'border-amber-500/30 bg-amber-500/5',
      indigo: 'border-indigo-500/30 bg-indigo-500/5',
      slate: 'border-slate-500/30 bg-slate-500/5',
    };
    return colors[catObj?.color] || colors.slate;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-brand-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Help Center</h1>
        </div>
        <p className="text-slate-400 font-medium text-sm sm:text-base">
          Having issues? Send us a message and our team will help you as soon as possible
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">Submit a Support Request</h2>

            {/* Category */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-sm sm:text-base">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      category === cat.id
                        ? 'bg-brand-primary text-slate-900 ring-2 ring-brand-primary'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2 text-sm sm:text-base">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm sm:text-base"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2 text-sm sm:text-base">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows="6"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none text-sm sm:text-base"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-emerald-500 text-slate-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Request
            </button>

            {submitted && (
              <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 p-3 rounded-lg text-center text-sm">
                ✓ Request submitted successfully!
              </div>
            )}
          </form>
        </div>

        {/* Your Tickets */}
        <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4">Your Tickets</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userTickets.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No support requests yet</p>
              </div>
            ) : (
              userTickets.map(ticket => (
                <div key={ticket.id} className={`p-3 rounded-lg border ${getCategoryColor(ticket.category)}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-white truncate">{ticket.subject}</span>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-semibold ${
                      ticket.status === 'open'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {ticket.status === 'open' ? '🔵 Open' : '✅ Resolved'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="font-semibold text-white mb-2">How long does it take to get a response?</p>
            <p className="text-sm text-slate-400">We typically respond to all support requests within 24 hours.</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="font-semibold text-white mb-2">Can I track my issue status?</p>
            <p className="text-sm text-slate-400">Yes! Check the "Your Tickets" section to see all your open and resolved requests.</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="font-semibold text-white mb-2">How do I earn rewards?</p>
            <p className="text-sm text-slate-400">Complete tasks posted by admins. Verify completion to receive your payment.</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="font-semibold text-white mb-2">My payment is missing!</p>
            <p className="text-sm text-slate-400">Please submit a payment issue ticket and include your transaction ID if available.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
