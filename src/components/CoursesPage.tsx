import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

interface Booklet {
  id: string;
  title: string;
  category: string;
  isFree: boolean;
  size: string;
  description: string;
  downloadUrl?: string;
}

const CoursesPage: React.FC = () => {
  const [selectedBaccOption, setSelectedBaccOption] = useState<'اونلاين' | 'برايفت'>('اونلاين');
  const [selectedWebLevel, setSelectedWebLevel] = useState<string>('Web01');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedBookletId, setHighlightedBookletId] = useState<string | null>(null);
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({
    'lesson-1': 235
  });

  const booklets: Booklet[] = [
    {
      id: 'lesson-1',
      title: 'ملزمة الدرس الاول - بكالوريا برمجة',
      category: 'بكالوريا برمجة',
      isFree: true,
      size: 'PDF | 4.3 MB',
      description: 'الشرح الكامل والوافي للدرس الأول في البرمجة لطلاب الصف الثاني بكالوريا.',
      downloadUrl: '/assets/documents/ملزمة الدرس الاول.pdf'
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookletId = params.get('booklet');
    if (bookletId) {
      setHighlightedBookletId(bookletId);
      setTimeout(() => {
        const el = document.getElementById(`booklet-${bookletId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
      const timer = setTimeout(() => {
        setHighlightedBookletId(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    booklets.forEach(booklet => {
      api.get(`/settings/value/booklet_${booklet.id}_download_count?default=235`)
        .then(res => {
          if (res.data && res.data.value !== undefined) {
            setDownloadCounts(prev => ({
              ...prev,
              [booklet.id]: Number(res.data.value)
            }));
          }
        })
        .catch(err => {
          console.error(`Failed to fetch download count for booklet ${booklet.id}`, err);
        });
    });
  }, []);

  const handleDownloadBooklet = (id: string) => {
    api.post(`/settings/increment/booklet_${id}_download_count?default=235`)
      .then(res => {
        if (res.data && res.data.value !== undefined) {
          setDownloadCounts(prev => ({
            ...prev,
            [id]: Number(res.data.value)
          }));
        }
      })
      .catch(err => {
        console.error(`Failed to increment download count for booklet ${id}`, err);
      });
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/courses?booklet=${id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const webLevels = [
    { name: 'Web01', description: 'أساسيات الويب وبناء الهيكل والتنسيق باستخدام HTML5 & CSS3.' },
    { name: 'Web02', description: 'التصميم المتجاوب وتنسيقات CSS المتقدمة مع تأثيرات حركية.' },
    { name: 'Web03', description: 'أساسيات لغة JavaScript والتحكم في عناصر الصفحة وتفاعلها.' },
    { name: 'Web04', description: 'برمجة JavaScript المتقدمة واستدعاء البيانات من الـ APIs الخارجية.' },
    { name: 'Web05', description: 'بناء تطبيقات الويب الحديثة باستخدام مكتبة React وإدارة الحالات.' }
  ];

  const handleBaccBook = () => {
    const phoneNumber = '01553514081';
    const message = `مرحبا يبشمهندس اريد حجز كورس الصف الثاني بكالوريا برمجة (${selectedBaccOption}) ما التكلفة والمواعيد`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleWebBook = () => {
    const phoneNumber = '01553514081';
    const message = `مرحبا يبشمهندس اريد حجز كورس web ليفل (${selectedWebLevel}) ما التكلفة والمواعيد`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const currentWebLevelDesc = webLevels.find(l => l.name === selectedWebLevel)?.description || '';

  return (
    <div className="min-h-screen bg-[#071426] text-white relative overflow-hidden flex flex-col justify-between" dir="rtl">
      
      {/* Standalone Top Navigation Header */}
      <header className="w-full bg-[#0B1E3A]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <img 
              src="/assets/Y.H logo.png" 
              alt="Y.H Logo" 
              className="h-12 w-auto object-contain" 
            />
            <span className="text-lg md:text-xl font-extrabold tracking-wider text-white">
              Youssef<span className="text-gold">Hatem</span>
            </span>
          </div>
          
          {/* Back to Home Button */}
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-white border border-blue-500/20 px-4 py-2 rounded-full transition-all duration-300 shadow-md font-semibold text-xs md:text-sm cursor-pointer"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            العودة للرئيسية
          </a>
        </div>
      </header>

      {/* Main Content container */}
      <div className="flex-1 pt-32 pb-16 px-6 max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-16">
        
        {/* Page Title Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            الملازم الدراسية و<span className="text-blue-400">الكورسات</span>
          </h1>
          <div className="h-1.5 w-28 bg-gradient-to-r from-blue-500 via-blue-400 to-gold mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
            حمّل الملازم التعليمية مباشرة، أو تواصل لحجز حصص الكورسات لمختلف المستويات والمراحل الدراسية.
          </p>
        </motion.div>

        {/* Section 1: Booklets (الملازم والكتب) - Centered layout */}
        <div className="flex flex-col gap-8 items-center text-center">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 w-full max-w-xl justify-center">
            <span className="text-2.5xl">📚</span>
            <h2 className="text-2xl font-bold text-white">الملازم والكتب الدراسية</h2>
          </div>

          <div className="w-full max-w-xl">
            {booklets.map((booklet, index) => {
              const isHighlighted = highlightedBookletId === booklet.id;
              return (
                <motion.div
                  key={index}
                  id={`booklet-${booklet.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: isHighlighted ? 1.02 : 1 }}
                  transition={{ duration: 0.4 }}
                  className={`glass-panel p-8 rounded-2xl border bg-[#0B1E3A]/40 backdrop-blur-sm relative overflow-hidden text-right flex flex-col justify-between h-full shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-500 ${
                    isHighlighted 
                      ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] ring-2 ring-blue-500/20' 
                      : 'border-white/5 hover:shadow-[0_4px_30px_rgba(59,130,246,0.15)]'
                  }`}
                >
                  {/* Free Badge */}
                  <div className="absolute top-5 left-5">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      تحميل مجاني
                    </span>
                  </div>

                  <div className="mb-6 mt-4">
                    <span className="text-xs text-blue-400 font-semibold tracking-wider block mb-1">
                      {booklet.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                      {booklet.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-5">
                      {booklet.description}
                    </p>
                    <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                      <span>📁</span>
                      <span>{booklet.size}</span>
                      <span>•</span>
                      <span className="text-blue-400 font-medium">تم تحميلها {downloadCounts[booklet.id] ?? 235} مرة</span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={booklet.downloadUrl}
                      download
                      onClick={() => handleDownloadBooklet(booklet.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-center transition-all duration-300 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>تحميل مباشر</span>
                    </a>
                    
                    <button
                      onClick={() => handleCopyLink(booklet.id)}
                      className="flex-1 bg-[#0B1E3A]/80 hover:bg-blue-600/20 text-blue-400 hover:text-white border border-blue-500/20 px-4 py-3.5 rounded-xl transition-all duration-300 shadow-md font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      {copiedId === booklet.id ? (
                        <>
                          <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          تم النسخ!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                          نسخ رابط الملزمة
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Courses (الكورسات) - Balanced Horizontal Grid */}
        <div className="flex flex-col gap-8 text-right w-full">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 w-full">
            <span className="text-2.5xl">🎓</span>
            <h2 className="text-2xl font-bold text-white">الكورسات والبرامج التدريبية</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Course Card 1: Baccalaureate Programming */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-panel p-8 rounded-2xl border border-white/5 bg-[#0B1E3A]/40 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.15)] transition-all duration-300"
            >
              <div>
                <span className="text-xs text-blue-400 font-semibold tracking-wider bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/10 inline-block mb-4">
                  منهج دراسي متكامل
                </span>
                <h3 className="text-2xl font-extrabold text-white mb-3">الصف الثاني بكالوريا برمجة</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  شرح تفصيلي للمنهج الدراسي الخاص بالبرمجة لطلاب البكالوريا التقنية، مع تدريبات عملية مكثفة واختبارات دورية لضمان الاستعداد الكامل للامتحانات.
                </p>

                {/* Segmented Switcher for Options */}
                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-300 block mb-3">اختر نظام الدراسة المفضّل:</label>
                  <div className="bg-[#071426]/75 p-1 rounded-xl border border-white/10 flex gap-2 max-w-xs shadow-inner">
                    <button
                      onClick={() => setSelectedBaccOption('اونلاين')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
                        selectedBaccOption === 'اونلاين'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      أونلاين (Online)
                    </button>
                    <button
                      onClick={() => setSelectedBaccOption('برايفت')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
                        selectedBaccOption === 'برايفت'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      برايفت (Private)
                    </button>
                  </div>
                </div>
              </div>

              {/* Reservation Button */}
              <button
                onClick={handleBaccBook}
                className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/10 flex items-center justify-center gap-2.5 text-base cursor-pointer hover:scale-[1.01] active:scale-95 mt-auto"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-13.82c-.22-.397-.45-.405-.66-.413l-.56-.008c-.193 0-.51.072-.777.362-.266.29-1.016 1.014-1.016 2.473 0 1.458 1.06 2.87 1.208 3.07.147.198 2.086 3.186 5.055 4.47.705.305 1.256.488 1.685.626.709.226 1.354.194 1.864.118.57-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.15-.174.2-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207z"/>
                </svg>
                احجز مقعدك الآن عبر واتساب
              </button>
            </motion.div>

            {/* Course Card 2: Web Course */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass-panel p-8 rounded-2xl border border-white/5 bg-[#0B1E3A]/40 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.15)] transition-all duration-300"
            >
              <div>
                <span className="text-xs text-blue-400 font-semibold tracking-wider bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/10 inline-block mb-4">
                  تطوير الويب المتكامل
                </span>
                <h3 className="text-2xl font-extrabold text-white mb-3">كورس Web الاحترافي</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  مسار تعليمي متكامل مكوّن من 5 مستويات يأخذك خطوة بخطوة من الصفر وحتى احتراف بناء المواقع والتطبيقات التفاعلية وربط قواعد البيانات.
                </p>

                {/* Levels Slider/Horizontal Selector */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-300 block mb-3">المستويات الخمسة (اختر مستوى لعرض تفاصيله):</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {webLevels.map((lvl) => (
                      <button
                        key={lvl.name}
                        onClick={() => setSelectedWebLevel(lvl.name)}
                        className={`px-4.5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
                          selectedWebLevel === lvl.name
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                            : 'bg-[#071426]/50 text-gray-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {lvl.name}
                      </button>
                    ))}
                  </div>

                  {/* Level Detail Box */}
                  <div className="bg-[#071426]/50 border border-white/5 p-4 rounded-xl mb-8 min-h-[76px] flex items-center gap-3">
                    <span className="text-2xl text-gold font-bold">💡</span>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {currentWebLevelDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservation Button */}
              <button
                onClick={handleWebBook}
                className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/10 flex items-center justify-center gap-2.5 text-base cursor-pointer hover:scale-[1.01] active:scale-95 mt-auto"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-13.82c-.22-.397-.45-.405-.66-.413l-.56-.008c-.193 0-.51.072-.777.362-.266.29-1.016 1.014-1.016 2.473 0 1.458 1.06 2.87 1.208 3.07.147.198 2.086 3.186 5.055 4.47.705.305 1.256.488 1.685.626.709.226 1.354.194 1.864.118.57-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.15-.174.2-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207z"/>
                </svg>
                حجز مستوى ({selectedWebLevel}) عبر واتساب
              </button>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Simple elegant page footer */}
      <footer className="w-full bg-[#071426] border-t border-white/5 py-6 text-center text-gray-500 text-xs md:text-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} Eng. Youssef Hatem. All rights reserved.</p>
          <p className="mt-1 text-gray-600">رقم الهاتف: 01553514081 | البريد الإلكتروني: youssef@youssefhatem.com</p>
        </div>
      </footer>
      
    </div>
  );
};

export default CoursesPage;
