import { useState, useEffect } from 'react';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, KeyRound, Smartphone, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Spinner } from '../components/ui';

type AuthMode = 'login' | 'register' | 'forgot' | 'otp';

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    setError(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        onSuccess();
      }
    } else if (mode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        onSuccess();
      }
    } else if (mode === 'forgot') {
      setOtpSent(true);
      setMode('otp');
      setLoading(false);
    } else if (mode === 'otp') {
      setMode('login');
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) {
      const next = document.getElementById(`otp-${i + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/10" />

        <div className="relative z-10 flex flex-col justify-center p-12 w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow-accent">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-p">NetLens</div>
              <div className="text-sm text-m">AI-Powered NIDS</div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-p mb-4 leading-tight">
            AI-Powered Network<br />
            <span className="text-gradient-cyber">Intrusion Detection</span>
          </h1>
          <p className="text-lg text-s mb-8 max-w-md">
            Monitor, detect, predict, and respond to cyber threats in real-time with advanced machine learning.
          </p>

          <div className="space-y-3">
            {[
              'Real-time packet capture & analysis',
              'AI threat detection with 99.7% accuracy',
              'Predictive attack analysis & prevention',
              'Automated threat response & blocking',
              'AI security assistant for instant insights',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-s">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-p font-mono">99.7%</div>
              <div className="text-xs text-m">Detection Accuracy</div>
            </div>
            <div className="w-px h-12 bg-c" />
            <div className="text-center">
              <div className="text-3xl font-bold text-p font-mono">&lt;50ms</div>
              <div className="text-xs text-m">Response Time</div>
            </div>
            <div className="w-px h-12 bg-c" />
            <div className="text-center">
              <div className="text-3xl font-bold text-p font-mono">12+</div>
              <div className="text-xs text-m">Attack Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-base">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-p">NetLens</div>
          </div>

          <div className="card p-8 fade-in-up">
            <h2 className="text-2xl font-bold text-p mb-2">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'otp' && 'Verify OTP'}
            </h2>
            <p className="text-sm text-s mb-6">
              {mode === 'login' && 'Sign in to your NetLens security dashboard'}
              {mode === 'register' && 'Set up your AI-powered security platform'}
              {mode === 'forgot' && 'Enter your email to receive a reset code'}
              {mode === 'otp' && 'Enter the 6-digit code sent to your email'}
            </p>

            {mode === 'otp' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-tertiary border border-c text-p focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    />
                  ))}
                </div>
                {error && <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">{error}</div>}
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : <><CheckCircle className="w-5 h-5" /> Verify & Continue</>}
                </Button>
                <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-s hover:text-p transition-colors">
                  Back to login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="text-sm text-s mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
                      <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field pl-10" placeholder="John Doe" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm text-s mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" />
                  </div>
                </div>
                {(mode === 'login' || mode === 'register') && (
                  <div>
                    <label className="text-sm text-s mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
                      <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-m hover:text-p">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-s cursor-pointer">
                      <input type="checkbox" className="rounded border-c" /> Remember me
                    </label>
                    <button type="button" onClick={() => setMode('forgot')} className="text-accent hover:underline">Forgot password?</button>
                  </div>
                )}

                {error && <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">{error}</div>}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : <>
                    {mode === 'login' && <>Sign In <ArrowRight className="w-5 h-5" /></>}
                    {mode === 'register' && <>Create Account <ArrowRight className="w-5 h-5" /></>}
                    {mode === 'forgot' && <>Send Reset Code <KeyRound className="w-5 h-5" /></>}
                  </>}
                </Button>

                {mode === 'login' && (
                  <div className="text-center text-sm text-s">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setMode('register')} className="text-accent hover:underline font-medium">Sign up</button>
                  </div>
                )}
                {mode === 'register' && (
                  <div className="text-center text-sm text-s">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-accent hover:underline font-medium">Sign in</button>
                  </div>
                )}
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-c">
              <div className="flex items-center gap-2 text-xs text-m justify-center">
                <Smartphone className="w-3.5 h-3.5" />
                <span>2FA & OTP verification supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
