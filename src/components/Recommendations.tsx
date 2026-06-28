import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiX } from 'react-icons/fi';
import api from '../utils/api';

interface Letter {
  _id: string;
  title: string;
  category: string;
  description: string;
  photo?: string;
  pdfUrl?: string;
}

const keyQuotes: Record<string, { quote: string; quoteRu?: string }> = {
  'Eng. Ahmed Fathy': {
    quote: "Youssef has successfully represented our school in numerous scientific and programming competitions, earning outstanding achievements at both national and international levels."
  },
  'Hosn Elbanaa': {
    quote: "Youssef's discipline, leadership, and outstanding moral character earned him the honor of being selected as the Ideal Student of El-Dabaa Nuclear School for the Academic Year 2026."
  },
  'Manal': {
    quote: "Youssef consistently demonstrated outstanding academic performance, exceptional analytical thinking, and a genuine passion for electronics and software engineering."
  },
  'Mr. Mahmoud Ragab': {
    quote: "I have every confidence that Youssef will continue to excel in higher education and in his future professional career. He has my highest recommendation.",
    quoteRu: "Я полностью уверен в том, что Юссеф продолжит добиваться успехов в высшем образовании и в своей будущей профессиональной карьере."
  }
};

const Recommendations: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/recommendationletters')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setLetters(res.data);
        }
      })
      .catch(err => {
        console.log('Failed to fetch recommendation letters.', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDownload = (e: React.MouseEvent, fileUrl?: string) => {
    e.stopPropagation();
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const getParagraphs = (desc: string) => {
    return desc.split('\n').filter(p => p.trim() !== '');
  };

  return (
    <section id="recommendations-section" className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold uppercase tracking-widest mb-3">
          📜 Academic Endorsements
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Letters of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-gold">Recommendation</span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-gold mx-auto rounded-full mb-4"></div>
        <p className="text-gray-400 font-light max-w-2xl mx-auto">
          Official letters from my academic mentors, teachers, and department heads at the Advanced School of Applied Nuclear Technology.
        </p>
      </motion.div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {letters.map((letter, idx) => {
            const keyInfo = keyQuotes[letter.title] || { quote: letter.description.substring(0, 150) + "..." };
            const isRussianTeacher = letter.title.includes('Mahmoud Ragab');

            return (
              <motion.div
                key={letter._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => setSelectedLetter(letter)}
                className="glass-panel p-8 rounded-3xl cursor-pointer border border-white/5 bg-[#0B1E3A]/10 hover:bg-[#0B1E3A]/30 transition-all duration-300 flex flex-col justify-between relative group shadow-xl overflow-hidden"
              >
                {/* Visual quote mark decoration */}
                <span className="absolute right-6 top-4 text-7xl font-serif text-white/[0.03] select-none pointer-events-none group-hover:text-blue-500/[0.05] transition-colors">“</span>

                {/* Card Top: Highlights */}
                <div className="space-y-4">
                  <div className="text-xl">✍️</div>
                  
                  {isRussianTeacher && keyInfo.quoteRu ? (
                    <div className="space-y-3">
                      <p className="text-gray-300 italic font-light leading-relaxed text-sm md:text-base border-l-2 border-blue-500/40 pl-3">
                        "{keyInfo.quote}"
                      </p>
                      <p className="text-gray-400 italic font-light leading-relaxed text-sm md:text-base border-l-2 border-gold/40 pl-3">
                        "{keyInfo.quoteRu}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-300 italic font-light leading-relaxed text-sm md:text-base border-l-2 border-blue-500/40 pl-3">
                      "{keyInfo.quote}"
                    </p>
                  )}
                </div>

                {/* Card Bottom: Sender Info and Actions */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="text-left max-w-[70%]">
                    <h4 className="font-bold text-white text-sm md:text-base leading-tight group-hover:text-gold transition-colors">{letter.title}</h4>
                    <p className="text-xs text-gray-500 font-medium truncate mt-1">{letter.category}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {letter.pdfUrl && (
                      <button
                        onClick={(e) => handleDownload(e, letter.pdfUrl)}
                        title="Download Document"
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition-all active:scale-95 shadow-lg"
                      >
                        <FiDownload size={14} />
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-xs font-bold text-blue-400 hover:text-blue-300 transition-all active:scale-95 shadow-md">
                      Read More
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-[100] flex justify-center overflow-y-auto p-4 md:p-10">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="fixed inset-0 bg-[#020914]/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="my-auto relative w-full max-w-5xl max-h-[85vh] bg-[#091527] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 bg-[#0B1D38]/50 flex items-center justify-between">
                <div className="text-left">
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">
                    <FiFileText />
                    <span>Official Endorsement Letter</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white">{selectedLetter.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{selectedLetter.category}</p>
                </div>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="p-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Body / Letter Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-left custom-scrollbar">
                {selectedLetter.title.includes('Mahmoud Ragab') ? (
                  // Mahmoud Ragab Russian teacher: side-by-side or dual-column stacked layout
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                    {/* English Column */}
                    <div className="space-y-4 text-justify pr-2">
                      <div className="text-xs text-blue-400 font-bold uppercase tracking-wider border-b border-blue-500/10 pb-1 mb-3">
                        🇬🇧 English Version
                      </div>
                      {getParagraphs(selectedLetter.description.split('=== RUSSIAN VERSION ===')[0].replace('=== ENGLISH VERSION ===', '')).map((para, idx) => (
                        <p key={idx} className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Russian Column */}
                    <div className="space-y-4 text-justify lg:pl-8 pt-6 lg:pt-0">
                      <div className="text-xs text-gold font-bold uppercase tracking-wider border-b border-gold/10 pb-1 mb-3">
                        🇷🇺 Russian Version (Русская версия)
                      </div>
                      {getParagraphs(selectedLetter.description.split('=== RUSSIAN VERSION ===')[1] || '').map((para, idx) => (
                        <p key={idx} className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Regular layout for other letters
                  <div className="max-w-3xl mx-auto space-y-4 text-justify">
                    {getParagraphs(selectedLetter.description).map((para, idx) => (
                      <p key={idx} className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              {selectedLetter.pdfUrl && (
                <div className="p-5 border-t border-white/5 bg-[#081223]/80 flex items-center justify-end">
                  <button
                    onClick={(e) => handleDownload(e, selectedLetter.pdfUrl)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-105"
                  >
                    <FiDownload size={14} />
                    <span>Download Original DOCX</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Recommendations;
