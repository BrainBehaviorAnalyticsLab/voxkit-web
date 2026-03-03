"use client"
import { useState, useRef, useEffect } from 'react';
import { Footer, Navbar } from '../../layout';

type FeedbackState = 'code-entry' | 'form' | 'success' | 'error';

const CATEGORIES = [
  { value: '', label: 'Select a category (optional)' },
  { value: 'Bug', label: 'Bug Report' },
  { value: 'Feature Request', label: 'Feature Request' },
  { value: 'General', label: 'General Feedback' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Other', label: 'Other' },
];

export default function FeedbackPage() {
  const [state, setState] = useState<FeedbackState>('code-entry');
  const [code, setCode] = useState(['', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [validatedCode, setValidatedCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (state === 'code-entry' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [state]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setCodeError('');

    // Auto-advance to next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleCodeSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    if (pastedData.length === 5) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[4]?.focus();
    }
  };

  const handleCodeSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 5) {
      setCodeError('Please enter all 5 digits');
      return;
    }

    setIsSubmitting(true);
    setCodeError('');

    try {
      const response = await fetch('/api/feedback/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode }),
      });

      const data = await response.json();

      if (data.valid) {
        setValidatedCode(fullCode);
        setState('form');
      } else {
        setCodeError('Invalid code. Please check and try again.');
      }
    } catch {
      setCodeError('Failed to validate code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setFeedbackError('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    setFeedbackError('');

    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: validatedCode,
          feedback: feedback.trim(),
          category: category || 'General',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setState('success');
      } else {
        setFeedbackError(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch {
      setFeedbackError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Feedback" />

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 pb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Anonymous Feedback
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Share your thoughts, report issues, or suggest improvements. Your feedback helps us make VoxKit better.
          </p>
        </div>

        {/* Code Entry Modal */}
        {state === 'code-entry' && (
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Enter Access Code</h2>
                <p className="text-slate-400 text-sm">
                  Enter your 5-digit feedback code to continue
                </p>
              </div>

              <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              {codeError && (
                <div className="text-red-400 text-sm text-center mb-4 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {codeError}
                </div>
              )}

              <button
                onClick={handleCodeSubmit}
                disabled={isSubmitting || code.some((d) => !d)}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/25"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Validating...
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        {state === 'form' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center gap-2 mb-6 text-slate-400 text-sm">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Code verified: {validatedCode}
              </div>

              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-slate-800">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="feedback" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Feedback <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => {
                      setFeedback(e.target.value);
                      setFeedbackError('');
                    }}
                    rows={6}
                    placeholder="Share your thoughts, report a bug, or suggest an improvement..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                  />
                </div>

                {feedbackError && (
                  <div className="text-red-400 text-sm mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {feedbackError}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-slate-500 text-xs">
                    Your submission is completely anonymous. No IP or identifying information is collected.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/25"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success State */}
        {state === 'success' && (
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
              <p className="text-slate-400 mb-6">
                Your feedback has been submitted successfully. We appreciate you taking the time to help us improve VoxKit.
              </p>
              <button
                onClick={() => {
                  setState('code-entry');
                  setCode(['', '', '', '', '']);
                  setValidatedCode('');
                  setFeedback('');
                  setCategory('');
                }}
                className="py-3 px-6 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-200"
              >
                Submit More Feedback
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
