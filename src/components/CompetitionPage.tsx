import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import PuzzleBoard from './PuzzleBoard';

// Helper: Convert seconds to HH:MM:SS
function formatTime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [
    hrs > 0 ? String(hrs).padStart(2, '0') : null,
    String(mins).padStart(2, '0'),
    String(secs).padStart(2, '0')
  ].filter(Boolean).join(':');
}

// Custom Confetti Particle System
class ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight + Math.random() * 20; // start from bottom
    this.size = Math.random() * 8 + 4;
    const colors = ['#3b82f6', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.speedX = Math.random() * 6 - 3;
    this.speedY = -Math.random() * 12 - 8; // upward burst
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
  }

  update(gravity: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += gravity; // apply gravity
    this.rotation += this.rotationSpeed;
  }
}

export const CompetitionPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  // Session state
  const [sessionToken, setSessionToken] = useState<string | null>(localStorage.getItem('comp_token'));
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [passwordCorrect, setPasswordCorrect] = useState<boolean>(false);
  const [secretNumberCorrect, setSecretNumberCorrect] = useState<boolean>(false);
  const [participantName, setParticipantName] = useState<string>('');

  // Register Form State
  const [regForm, setRegForm] = useState({ name: '', phone: '', email: '' });
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Active Stage Content States
  const [stage1Flags, setStage1Flags] = useState<any[]>([]);
  const [stage1Answers, setStage1Answers] = useState<number[]>(() => {
    const saved = localStorage.getItem('comp_stage1_answers');
    return saved ? JSON.parse(saved) : [];
  });
  const [stage3Questions, setStage3Questions] = useState<any[]>([]);
  const [stage3Answers, setStage3Answers] = useState<number[]>(() => {
    const saved = localStorage.getItem('comp_stage3_answers');
    return saved ? JSON.parse(saved) : [];
  });
  const [stage4Cipher, setStage4Cipher] = useState<string>('');
  const [stage4Input, setStage4Input] = useState<string>(() => {
    return localStorage.getItem('comp_stage4_input') || '';
  });

  useEffect(() => {
    if (stage1Answers.length > 0) {
      localStorage.setItem('comp_stage1_answers', JSON.stringify(stage1Answers));
    }
  }, [stage1Answers]);

  useEffect(() => {
    if (stage3Answers.length > 0) {
      localStorage.setItem('comp_stage3_answers', JSON.stringify(stage3Answers));
    }
  }, [stage3Answers]);

  useEffect(() => {
    localStorage.setItem('comp_stage4_input', stage4Input);
  }, [stage4Input]);

  // Final password & secret number input states
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [secretInput, setSecretInput] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string>('');
  const [legendarySuccess, setLegendarySuccess] = useState<boolean>(false);

  // Solvers and Ranks
  const [myRank, setMyRank] = useState<number>(0);
  const [hasSolvers, setHasSolvers] = useState<boolean>(false);
  const [manualLetters, setManualLetters] = useState<string[]>(() => {
    const saved = localStorage.getItem('manual_letters');
    return saved ? JSON.parse(saved) : new Array(9).fill('');
  });
  const [activeViewStage, setActiveViewStage] = useState<number>(1);

  useEffect(() => {
    localStorage.setItem('manual_letters', JSON.stringify(manualLetters));
  }, [manualLetters]);

  // Sync activeViewStage with currentStage progress
  useEffect(() => {
    if (currentStage >= 4) {
      setActiveViewStage(5);
    } else {
      setActiveViewStage(currentStage + 1);
    }
  }, [currentStage]);

  // UI state
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch solvers presence for intro screen
  const fetchPublicInfo = async () => {
    try {
      const res = await api.get('/competition/public-info');
      setHasSolvers(res.data.hasSolvers);
    } catch (err) {
      console.error('Failed to fetch public info:', err);
    }
  };

  // Load status and check token on mount
  useEffect(() => {
    if (sessionToken) {
      fetchStatus();
    } else {
      fetchPublicInfo();
    }
  }, [sessionToken]);

  // Tick the timer
  useEffect(() => {
    if (!startTime || passwordCorrect) return;

    const interval = setInterval(() => {
      const start = new Date(startTime).getTime();
      const diff = Math.floor((Date.now() - start) / 1000);
      setTimeElapsed(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, passwordCorrect]);

  // Handle Confetti Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localParticles = [...particles];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gravity = 0.2;

      localParticles.forEach((p, idx) => {
        p.update(gravity);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Remove fallen particles
        if (p.y > canvas.height + 20) {
          localParticles.splice(idx, 1);
        }
      });

      if (localParticles.length > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (particles.length > 0) {
      animate();
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [particles]);

  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < 120; i++) {
      newParticles.push(new ConfettiParticle(canvas.width, canvas.height));
    }
    setParticles(newParticles);
  };

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get('/competition/status', {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setCurrentStage(res.data.currentStage);
      setStartTime(res.data.startTime);
      setPasswordCorrect(res.data.passwordCorrect);
      setSecretNumberCorrect(res.data.secretNumberCorrect);
      setParticipantName(res.data.name);
      setMyRank(res.data.rank || 0);
      setHasSolvers(res.data.hasSolvers || false);

      // Preload current stage content if needed
      loadStageContent(res.data.currentStage + 1);
    } catch (err: any) {
      console.error('Failed to fetch status:', err);
      // Clear token if invalid
      localStorage.removeItem('comp_token');
      setSessionToken(null);
    } finally {
      setLoading(false);
    }
  };

  const loadStageContent = async (stage: number) => {
    if (stage < 1 || stage > 4) {
      return;
    }
    try {
      const res = await api.get(`/competition/stage/${stage}`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (stage === 1) {
        setStage1Flags(res.data.flags);
        const saved = localStorage.getItem('comp_stage1_answers');
        const parsed = saved ? JSON.parse(saved) : [];
        if (parsed.length !== res.data.flags.length) {
          setStage1Answers(new Array(res.data.flags.length).fill(-1));
        } else {
          setStage1Answers(parsed);
        }
      } else if (stage === 3) {
        setStage3Questions(res.data.programming);
        const saved = localStorage.getItem('comp_stage3_answers');
        const parsed = saved ? JSON.parse(saved) : [];
        if (parsed.length !== res.data.programming.length) {
          setStage3Answers(new Array(res.data.programming.length).fill(-1));
        } else {
          setStage3Answers(parsed);
        }
      } else if (stage === 4) {
        setStage4Cipher(res.data.encryptedMessage);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'فشل في تحميل محتوى المرحلة.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regForm.name || !regForm.phone || !regForm.email) {
      setRegError('جميع الحقول مطلوبة.');
      return;
    }
    setRegLoading(true);
    try {
      const res = await api.post('/competition/register', regForm);
      localStorage.setItem('comp_token', res.data.sessionToken);
      setSessionToken(res.data.sessionToken);
      setCurrentStage(res.data.currentStage);
      setStartTime(res.data.startTime);
      setPasswordCorrect(res.data.passwordCorrect || false);
      setSecretNumberCorrect(res.data.secretNumberCorrect || false);
      setParticipantName(res.data.name || regForm.name);

      triggerConfetti();
      loadStageContent(res.data.currentStage + 1);
    } catch (err: any) {
      setRegError(err.response?.data?.message || 'فشل التسجيل. حاول مرة أخرى.');
    } finally {
      setRegLoading(false);
    }
  };



  const handleStageSubmit = async (stageNum: number, payload: any) => {
    setSubmissionError('');
    try {
      const res = await api.post(`/competition/stage/${stageNum}/submit`, payload, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.data.success) {
        triggerConfetti();
        setCurrentStage(res.data.currentStage);
        loadStageContent(res.data.currentStage + 1);
      }
    } catch (err: any) {
      setSubmissionError(err.response?.data?.message || 'الإجابة غير صحيحة، حاول مجددًا.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    if (!passwordInput) return;

    try {
      const res = await api.post('/competition/submit-password', { password: passwordInput }, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.data.success) {
        triggerConfetti();
        setPasswordCorrect(true);
        setCurrentStage(res.data.currentStage);
        fetchStatus();
      }
    } catch (err: any) {
      setSubmissionError(err.response?.data?.message || 'كلمة السر غير صحيحة.');
    }
  };

  const handleSecretSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    if (!secretInput) return;

    try {
      const res = await api.post('/competition/submit-secret', { secretNumber: secretInput }, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.data.success) {
        setLegendarySuccess(true);
        setSecretNumberCorrect(true);
        setCurrentStage(res.data.currentStage);
        fetchStatus();
      }
    } catch (err: any) {
      setSubmissionError(err.response?.data?.message || 'الرقم السري غير صحيح.');
    }
  };



  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-gray-400 font-sans" dir="rtl">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="relative py-20 px-6 max-w-4xl mx-auto z-10 text-right font-sans" dir="rtl">
      {/* Canvas for premium local confetti */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50"></canvas>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden text-center"
      >
        {/* Top Header details */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        {errorMsg && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium mb-6">
            ⚠ {errorMsg}
          </div>
        )}

        {/* Global Progress & Timer */}
        {sessionToken && activeViewStage <= 4 && !passwordCorrect && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-white/10 text-right w-full relative z-20">
            <div>
              <p className="text-gray-400 text-xs">المتسابق الحالي:</p>
              <h4 className="text-white font-bold text-lg">{participantName}</h4>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center bg-[#071426]/60 border border-white/10 px-4 py-2 rounded-xl">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">المرحلة الحالية</p>
                <p className="text-gold font-bold text-sm">المرحلة {activeViewStage} من 4</p>
              </div>
              <div className="text-center bg-[#071426]/60 border border-white/10 px-4 py-2 rounded-xl min-w-[100px]">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">الوقت المستغرق</p>
                <p className="text-blue-400 font-mono font-bold text-sm">{formatTime(timeElapsed)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stage Navigation Tabs */}
        {sessionToken && (
          <div className="flex justify-center gap-1.5 md:gap-3 mb-8 bg-[#071426]/40 p-2.5 rounded-2xl border border-white/5 overflow-x-auto relative z-20" dir="rtl">
            {[
              { num: 1, label: 'الأعلام 🌍', unlocked: true },
              { num: 2, label: 'البازل 🧩', unlocked: currentStage >= 1 },
              { num: 3, label: 'البرمجة 💻', unlocked: currentStage >= 2 },
              { num: 4, label: 'فك الشفرة 🔐', unlocked: currentStage >= 3 },
              { num: 5, label: 'كلمة السر 🏁', unlocked: currentStage >= 4 },
            ].map((tab) => {
              const isActive = activeViewStage === tab.num;
              return (
                <button
                  key={tab.num}
                  type="button"
                  disabled={!tab.unlocked}
                  onClick={() => {
                    setActiveViewStage(tab.num);
                    loadStageContent(tab.num);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg scale-105 border border-blue-400'
                      : tab.unlocked
                      ? 'bg-[#0A182E]/80 text-gray-300 hover:bg-slate-800 border border-white/5'
                      : 'bg-slate-900/30 text-gray-600 border border-transparent cursor-not-allowed opacity-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}



        {/* LETTER BAR (شريط الحروف) */}
        {sessionToken && currentStage >= 0 && !passwordCorrect && (
          <div className="mb-8 relative z-20">
            <p className="text-gray-400 text-xs mb-3">شريط الحروف (اكتب الحروف التي تكتشفها هنا لمساعدتك):</p>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2 bg-[#071426]/60 border border-white/5 p-4 rounded-2xl min-h-[64px] items-center">
                {manualLetters.map((letter, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={letter}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = [...manualLetters];
                      updated[idx] = val;
                      setManualLetters(updated);
                      // Auto-focus next input if typed
                      if (val && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                      }
                    }}
                    className="w-10 h-10 text-center bg-blue-600/85 border border-blue-400/40 rounded-xl text-white font-extrabold text-lg shadow-[0_0_15px_rgba(59,130,246,0.2)] focus:outline-none focus:border-blue-400 focus:bg-blue-600"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setManualLetters(new Array(9).fill(''))}
                className="text-[10px] text-gray-500 hover:text-gray-400 underline cursor-pointer"
              >
                تفريغ شريط الحروف 🗑️
              </button>
            </div>
          </div>
        )}

        {/* SCREENS */}

        {/* SCREEN 0: Registration */}
        {!sessionToken && (
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              🔐 كلمة السر
            </h1>
            {hasSolvers ? (
              <div className="mb-6 py-3 px-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-semibold max-w-md mx-auto">
                ⚠️ تنويه: تم حل كلمة السر من قبل متسابقين آخرين.
              </div>
            ) : (
              <div className="mb-6 py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold max-w-md mx-auto animate-pulse">
                🚀 كن أول من يحل كلمة السر ويحجز المركز الأول!
              </div>
            )}
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-amber-400 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 text-lg font-light max-w-md mx-auto mb-8 leading-relaxed">
              "4 مراحل تفاعلية، 9 حروف غامضة، وكلمة سر واحدة فقط لتثبت جدارتك بريادة البرمجة."
            </p>

            <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-5 text-right relative z-10">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">الاسم بالكامل</label>
                <input
                  type="text"
                  required
                  placeholder="اكتب اسمك الثلاثي"
                  value={regForm.name}
                  onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                  className="w-full bg-[#0A182E]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 01553514081"
                  value={regForm.phone}
                  onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full bg-[#0A182E]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm text-right font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  placeholder="example@domain.com"
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full bg-[#0A182E]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm text-right font-mono"
                />
              </div>

              {regError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
                  ⚠ {regError}
                </div>
              )}

              <button
                type="submit"
                disabled={regLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-98 disabled:scale-100 disabled:pointer-events-none cursor-pointer mt-4"
              >
                {regLoading ? 'جاري بدء التحدي...' : 'ابدأ التحدي 🚀'}
              </button>

            </form>
          </div>
        )}

        {/* SCREEN 1: Flags */}
        {sessionToken && activeViewStage === 1 && stage1Flags.length > 0 && (
          <div className="text-right">
            {activeViewStage < currentStage + 1 && (
              <div className="mb-6 py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold text-center">
                لقد أكملت هذه المرحلة بنجاح ✓ يمكنك مراجعتها لاستخراج الحروف.
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
              <span>🌍 المرحلة الأولى: الأعلام</span>
              <span className="text-xs bg-blue-600/30 text-blue-400 border border-blue-400/20 px-3 py-1 rounded-full">
                صعبة نسبيًا
              </span>
            </h3>
            <p className="text-gray-400 text-xs mb-1">اختر الدولة الصحيحة المطابقة لكل علم من الأعلام التالية:</p>
            <p className="text-amber-400 text-xs font-semibold mb-6">(ملحوظة: الحرف الأول للدولة الصحيحة تستعمل في كلمة السر)</p>

            <div className="space-y-6">
              {stage1Flags.map((flag, flagIdx) => (
                <div key={flagIdx} className="bg-[#0A182E]/40 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
                  {/* Flag image */}
                  <img
                    src={flag.flagUrl}
                    alt={`Flag ${flagIdx + 1}`}
                    className="w-36 h-24 object-cover rounded-lg border border-white/10 shadow-lg"
                  />
                  {/* Options */}
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {flag.options.map((option: string, optIdx: number) => {
                      const isSelected = stage1Answers[flagIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            const updated = [...stage1Answers];
                            updated[flagIdx] = optIdx;
                            setStage1Answers(updated);
                          }}
                          className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                              : 'bg-[#071426]/60 border-white/10 text-gray-300 hover:border-white/30 hover:bg-[#0A182E]'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {submissionError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium mt-6 text-center">
                ⚠ {submissionError}
              </div>
            )}

            <button
              onClick={() => handleStageSubmit(1, { answers: stage1Answers })}
              disabled={stage1Answers.includes(-1)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-99 cursor-pointer"
            >
              تحقق من الإجابات 🌍
            </button>
          </div>
        )}

        {/* SCREEN 2: Puzzle */}
        {sessionToken && activeViewStage === 2 && (
          <div className="text-right">
            {activeViewStage < currentStage + 1 && (
              <div className="mb-6 py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold text-center">
                لقد أكملت هذه المرحلة بنجاح ✓ يمكنك مراجعتها لاستخراج الحروف.
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
              <span>🧩 المرحلة الثانية: البازل</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full">
                35 قطعة
              </span>
            </h3>
            <p className="text-gray-400 text-xs mb-6">قم بسحب قطع البازل المتناثرة بالأسفل وترتيبها لتكتمل الصورة وتكشف الحروف:</p>

            <PuzzleBoard
              imageUrl="/pazzel.png"
              onSolved={() => handleStageSubmit(2, { solved: true })}
            />

            {submissionError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium mt-6 text-center">
                ⚠ {submissionError}
              </div>
            )}
          </div>
        )}

        {/* SCREEN 3: Programming */}
        {sessionToken && activeViewStage === 3 && stage3Questions.length > 0 && (
          <div className="text-right">
            {activeViewStage < currentStage + 1 && (
              <div className="mb-6 py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold text-center">
                لقد أكملت هذه المرحلة بنجاح ✓ يمكنك مراجعتها لاستخراج الحروف.
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
              <span>💻 المرحلة الثالثة: اختبار البرمجة</span>
              <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-400/20 px-3 py-1 rounded-full">
                3 أسئلة برمجية
              </span>
            </h3>
            <p className="text-gray-400 text-xs mb-1">أجب على الأسئلة التالية بدقة:</p>
            <p className="text-amber-400 text-xs font-semibold mb-6">(ملحوظة: الحرف الأول للإجابة الصحيحة يستعمل في كلمة السر)</p>

            <div className="space-y-8">
              {stage3Questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-[#0A182E]/40 border border-white/5 rounded-2xl p-6 space-y-4">
                  <h4 className="text-white font-semibold text-sm">
                    {qIdx + 1}. {q.question}
                  </h4>

                  {q.codeSnippet && (
                    <pre className="bg-[#050C16] border border-white/5 rounded-xl p-4 text-left overflow-x-auto text-xs text-blue-300 font-mono dir-ltr">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {q.options.map((option: string, optIdx: number) => {
                      const isSelected = stage3Answers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            const updated = [...stage3Answers];
                            updated[qIdx] = optIdx;
                            setStage3Answers(updated);
                          }}
                          className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                              : 'bg-[#071426]/60 border-white/10 text-gray-300 hover:border-white/30 hover:bg-[#0A182E]'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {submissionError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium mt-6 text-center">
                ⚠ {submissionError}
              </div>
            )}

            <button
              onClick={() => handleStageSubmit(3, { answers: stage3Answers })}
              disabled={stage3Answers.includes(-1)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-99 cursor-pointer"
            >
              تحقق من الإجابات 💻
            </button>
          </div>
        )}

        {/* SCREEN 4: Caesar Cipher */}
        {sessionToken && activeViewStage === 4 && (
          <div className="text-right">
            {activeViewStage < currentStage + 1 && (
              <div className="mb-6 py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold text-center">
                لقد أكملت هذه المرحلة بنجاح ✓ يمكنك مراجعتها لاستخراج الحروف.
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">
              فك الشفرة 5
            </h3>
            <p className="text-amber-400 text-xs font-semibold mb-6">(ملحوظة: الحرفين الثاني والثالث ما تحتاجهم)</p>

            <div className="bg-[#0A182E]/40 border border-white/5 rounded-2xl p-6 text-center space-y-6 relative overflow-hidden">
              <div>
                <p className="text-gray-500 text-xs">الرسالة المشفرة:</p>
                <div className="mt-2 inline-block bg-slate-900 border border-white/5 px-8 py-4 rounded-xl text-3xl font-extrabold text-blue-400 font-mono tracking-wider">
                  {stage4Cipher}
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-sm font-semibold text-gray-300 mb-2 text-right">أدخل الكلمة المفكوكة:</label>
                <input
                  type="text"
                  placeholder="أدخل الحل هنا"
                  value={stage4Input}
                  onChange={e => setStage4Input(e.target.value)}
                  className="w-full bg-[#0A182E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm text-center"
                />
              </div>
            </div>

            {submissionError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium mt-6 text-center">
                ⚠ {submissionError}
              </div>
            )}

            <button
              onClick={() => handleStageSubmit(4, { solution: stage4Input })}
              disabled={!stage4Input.trim()}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-99 cursor-pointer"
            >
              فك التشفير وتحقق 🔐
            </button>
          </div>
        )}

        {/* SCREEN 5: Password Form */}
        {sessionToken && activeViewStage === 5 && !passwordCorrect && (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block bg-blue-600/10 border border-blue-500/20 px-6 py-2 rounded-full text-blue-400 font-bold text-xs"
            >
              🎉 لقد وصلت إلى النهاية
            </motion.div>
            <h3 className="text-3xl font-extrabold text-white">اكتشف كلمة السر</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              لقد قمت بجمع الحروف التسعة كاملة. رتب الحروف لتصل إلى كلمة السر الصحيحة واكتبها أدناه:
            </p>

            <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                placeholder="اكتب كلمة السر هنا"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-[#0A182E]/80 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-md font-bold text-center"
              />

              {submissionError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
                  ⚠ {submissionError}
                </div>
              )}

              <button
                type="submit"
                disabled={!passwordInput.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                تحقق 🔐
              </button>
            </form>
          </div>
        )}

        {/* SCREEN 6: Solved / Leaderboard & Secret Number */}
        {sessionToken && activeViewStage === 5 && passwordCorrect && (
          <div className="space-y-8 text-right">
            {/* Top Success Banner */}
            <div className="text-center space-y-4">
              <div className="inline-block bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold px-8 py-3.5 rounded-2xl">
                🥇 مبارك! لقد قمت بفك شفرة كلمة السر بنجاح.
              </div>
              <h2 className="text-4xl font-extrabold text-gradient">تهانينا يا بطل! 🏆</h2>
            </div>

            {/* Secret Number Input Card */}
            {!secretNumberCorrect && (
              <div className="bg-[#0A182E]/40 border border-white/5 rounded-2xl p-6 max-w-md mx-auto space-y-4 text-center">
                <p className="text-gray-400 text-xs">هل عثرت على الرقم السري الإضافي؟</p>
                <form onSubmit={handleSecretSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="اكتب الرقم السري"
                    value={secretInput}
                    onChange={e => setSecretInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-blue-500 text-sm font-semibold"
                  />
                  {submissionError && (
                    <p className="text-red-400 text-xs font-semibold">⚠ {submissionError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all hover:scale-[1.01]"
                  >
                    تحقق
                  </button>
                </form>
              </div>
            )}

            {/* Legendary animation overlay */}
            <AnimatePresence>
              {(legendarySuccess || (secretNumberCorrect && !legendarySuccess)) && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-amber-600/20 via-amber-500/25 to-amber-600/20 border border-amber-500/30 rounded-2xl p-6 text-center max-w-md mx-auto space-y-3"
                >
                  <h3 className="text-3xl font-extrabold text-amber-400">👑 أنت الأسطوري!</h3>
                  <p className="text-gray-200 text-sm">
                    "اكتشفت السر الذي لم يُخبرك به أحد."
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rank display section */}
            <div className="space-y-4 text-center max-w-md mx-auto bg-[#0A182E]/40 border border-white/5 p-8 rounded-3xl">
              <p className="text-gray-400 text-sm">لقد أنهيت التحدي ونجحت في تسجيل إجابتك!</p>
              <div className="py-6">
                <span className="text-gray-500 text-xs block mb-1">المركز الذي حققته:</span>
                <span className="text-5xl font-extrabold text-gradient">
                  {myRank === 1 ? '🥇 الأول' : myRank === 2 ? '🥈 الثاني' : myRank === 3 ? '🥉 الثالث' : `#${myRank}`}
                </span>
              </div>
              <p className="text-gray-400 text-xs">تم حفظ وقت تسليم الإجابة في قاعدة البيانات وترتيب المتصدرين بدقة.</p>
            </div>

            {/* Clear Session / Reset for debugging or re-taking */}
            {import.meta.env.DEV && (
              <div className="text-center pt-6">
                <button
                  onClick={() => {
                    localStorage.removeItem('comp_token');
                    localStorage.removeItem('comp_stage1_answers');
                    localStorage.removeItem('comp_stage3_answers');
                    localStorage.removeItem('comp_stage4_input');
                    localStorage.removeItem('manual_letters');
                    setSessionToken(null);
                    setCurrentStage(0);
                    setPasswordCorrect(false);
                    setSecretNumberCorrect(false);
                    setStage1Answers([]);
                    setStage3Answers([]);
                    setStage4Input('');
                    setManualLetters(new Array(9).fill(''));
                  }}
                  className="text-xs text-gray-600 hover:text-gray-400 underline cursor-pointer"
                >
                  إعادة تعيين المحاولة (لأغراض التطوير والتجربة)
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompetitionPage;
