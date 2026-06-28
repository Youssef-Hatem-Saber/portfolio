import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

interface Subject {
  _id?: string;
  year: string;
  name: string;
  grade: string;
  gpa: number | string;
}

const defaultSubjects: Subject[] = [
  { year: 'Year One', name: 'Programming', grade: 'A+', gpa: '4.0' },
  { year: 'Year One', name: 'Physics', grade: 'A+', gpa: '4.0' },
  { year: 'Year One', name: 'Math', grade: 'A+', gpa: '4.0' },
  { year: 'Year One', name: 'Electronics', grade: 'A', gpa: '3.8' },
  { year: 'Year One', name: 'Algorithms', grade: 'A+', gpa: '4.0' },
];

const yearDisplayMap: Record<string, string> = {
  'Year One': 'First Year',
  'Year Two': 'Second Year',
  'Year Three': 'Third Year',
  'Year Four': 'Fourth Year',
  'Year Five': 'Fifth Year'
};

const GPA: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [overallGPA, setOverallGPA] = useState('4.0');
  const [expandedYear, setExpandedYear] = useState<string | null>('Year One');

  useEffect(() => {
    // Fetch subjects from backend
    api.get('/subjects')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setSubjects(res.data);
          // Calculate overall GPA dynamically
          const sum = res.data.reduce((acc: number, cur: any) => acc + (Number(cur.gpa) || 0), 0);
          const avg = (sum / res.data.length).toFixed(2);
          setOverallGPA(avg);
        }
      })
      .catch(err => {
        console.log('Failed to fetch subjects, using default grades.', err);
      });
  }, []);

  const handleRequestGPA = () => {
    window.location.href = "mailto:youssef@youssefhatem.com?subject=GPA Documentation Request&body=Hello,%0D%0A%0D%0AI would like to request your official GPA documentation.%0D%0A%0D%0AThank you.";
  };

  // Group subjects by year
  const years = ['Year One', 'Year Two', 'Year Three', 'Year Four'];
  const subjectsByYear = years.reduce((acc, y) => {
    acc[y] = subjects.filter(s => s.year === y);
    return acc;
  }, {} as Record<string, Subject[]>);

  // Calculate GPA for a specific year
  const calculateYearGPA = (yearSubjects: Subject[]) => {
    if (yearSubjects.length === 0) return '4.0';
    const sum = yearSubjects.reduce((acc, s) => acc + (Number(s.gpa) || 0), 0);
    return (sum / yearSubjects.length).toFixed(2);
  };

  const toggleYear = (year: string) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <section id="gpa-section" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Academic <span className="text-gold">Excellence</span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-gold to-yellow-500 mx-auto rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Large GPA Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-1 md:sticky md:top-28"
        >
          <div className="glass-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-3xl mb-6 border border-gold/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              🎓
            </div>
            <h3 className="text-xl text-gray-300 font-medium mb-4 relative z-10">Overall Cumulative GPA</h3>
            <div className="text-6xl font-extrabold text-white mb-2 relative z-10">
              {overallGPA} <span className="text-2xl text-gray-500 font-normal">/ 4.0</span>
            </div>
            <p className="text-gold font-bold uppercase tracking-wider text-sm mt-4 relative z-10 bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20">
              Top of the Class
            </p>
          </div>
        </motion.div>

        {/* Subjects Accordion Container */}
        <div className="md:col-span-2 space-y-4">
          {years.map((year, idx) => {
            const yearSubjects = subjectsByYear[year] || [];
            const displayTitle = yearDisplayMap[year] || year;
            const yearGPA = calculateYearGPA(yearSubjects);
            const isExpanded = expandedYear === year;

            return (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel overflow-hidden rounded-2xl border border-white/5"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isExpanded ? 'bg-gold text-primary' : 'bg-white/5 text-gold border border-gold/20'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-lg font-bold text-white tracking-tight">{displayTitle}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-gray-300 mr-2">
                      GPA: <span className="text-gold font-extrabold">{yearGPA}</span>
                    </div>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-400 text-lg"
                    >
                      ▼
                    </motion.span>
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-white/[0.01]">
                        {yearSubjects.length === 0 ? (
                          <p className="text-sm text-gray-500 py-4">No subjects added for this year.</p>
                        ) : (
                          <div className="overflow-x-auto mt-2">
                            <table className="w-full text-left">
                              <thead className="border-b border-white/5 text-gray-400">
                                <tr>
                                  <th className="pb-3 font-semibold text-xs uppercase tracking-wider">Subject Name</th>
                                  <th className="pb-3 font-semibold text-xs uppercase tracking-wider w-24">Grade</th>
                                  <th className="pb-3 font-semibold text-xs uppercase tracking-wider w-20">GPA</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {yearSubjects.map((sub, i) => (
                                  <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3 text-sm font-bold text-white">{sub.name}</td>
                                    <td className="py-3"><span className="text-blue-400 font-extrabold bg-blue-500/10 px-2 py-0.5 rounded text-xs border border-blue-500/20">{sub.grade}</span></td>
                                    <td className="py-3 text-gold font-extrabold text-sm">{Number(sub.gpa).toFixed(1)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <button 
          onClick={handleRequestGPA}
          className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-950 hover:scale-105 active:scale-95 px-8 py-4 rounded-full font-extrabold transition-all shadow-[0_0_25px_rgba(251,191,36,0.35)]"
        >
          Request Official GPA Documentation
        </button>
      </motion.div>

    </section>
  );
};

export default GPA;
