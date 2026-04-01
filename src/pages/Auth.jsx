import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-brand-surface border border-slate-700 p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input required name="name" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-primary transition-colors" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input required name="phone" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-primary" placeholder="+123..." />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Country</label>
                  <input required name="country" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-primary" placeholder="USA" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-400 mb-1">Email</label>
            <input required type="email" name="email" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-primary transition-colors" placeholder="name@email.com" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <input required type="password" name="password" onChange={handleChange} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-primary transition-colors" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-slate-900 font-bold py-3 rounded-lg hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center mt-6"
          >
            {loading ? <span className="animate-spin border-2 border-slate-900 border-t-transparent rounded-full w-5 h-5"></span> : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? '/signup' : '/login'} className="text-brand-primary hover:underline font-semibold">
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
