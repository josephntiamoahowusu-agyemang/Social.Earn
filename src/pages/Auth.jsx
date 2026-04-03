import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

export const Auth = ({ type }) => {
  const isLogin = type === 'login';
  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', country: '' });
  
  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isLogin ? await login(form.email, form.password) : await signup(form);
    if (success) {
      if (form.email === 'admin@socialearn.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-brand-surface border border-slate-700 p-5 sm:p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4 sm:mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 text-sm sm:text-base">Full Name</label>
                <input required name="name" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-brand-primary transition-colors text-sm sm:text-base touch-target" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 text-sm sm:text-base">Phone Number</label>
                  <input required name="phone" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-brand-primary text-sm sm:text-base touch-target" placeholder="+123..." />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-sm sm:text-base">Country</label>
                  <input required name="country" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-brand-primary text-sm sm:text-base touch-target" placeholder="USA" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-400 mb-1 text-sm sm:text-base">Email</label>
            <input required type="email" name="email" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-brand-primary transition-colors text-sm sm:text-base touch-target" placeholder="name@email.com" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 text-sm sm:text-base">Password</label>
            <input required type="password" name="password" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-brand-primary transition-colors text-sm sm:text-base touch-target" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-slate-900 font-bold py-2 sm:py-3 rounded-lg hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center mt-6 touch-target text-sm sm:text-base"
          >
            {loading ? <span className="animate-spin border-2 border-slate-900 border-t-transparent rounded-full w-5 h-5"></span> : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4 sm:mt-6 text-sm sm:text-base">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? '/signup' : '/login'} className="text-brand-primary hover:underline font-semibold">
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
