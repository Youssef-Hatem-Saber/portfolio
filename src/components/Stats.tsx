import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Stats: React.FC = () => {
  const [coursesCount, setCoursesCount] = useState<number>(18);
  const [badgesCount, setBadgesCount] = useState<number>(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesRes = await api.get('/courses');
        if (coursesRes.data && coursesRes.data.length > 0) {
          setCoursesCount(coursesRes.data.length);
        }

        // Fetch badges
        const badgesRes = await api.get('/badges');
        if (badgesRes.data && badgesRes.data.length > 0) {
          setBadgesCount(badgesRes.data.length);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchData();
  }, []);

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 mt-12 mb-20 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Course Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => scrollToSection('courses-section')}
          className="glass-panel p-8 rounded-3xl flex items-center justify-between group cursor-pointer border border-white/5 bg-[#0B1E3A]/40 backdrop-blur-sm"
        >
          <div className="space-y-3">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Verified Certifications</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-5xl font-black text-gradient">
                {coursesCount}
              </h4>
              <span className="text-lg font-light text-gray-500">Completed Courses</span>
            </div>
            <p className="text-xs text-blue-400 group-hover:underline transition-all flex items-center gap-1">
              View all certificates →
            </p>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]">
            📚
          </div>
        </motion.div>

        {/* Badge Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => scrollToSection('courses-section')}
          className="glass-panel p-8 rounded-3xl flex items-center justify-between group cursor-pointer border border-white/5 bg-[#0B1E3A]/40 backdrop-blur-sm"
        >
          <div className="space-y-3">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Honors & Achievements</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-5xl font-black text-gradient">
                {badgesCount}
              </h4>
              <span className="text-lg font-light text-gray-500">Earned Badges</span>
            </div>
            <p className="text-xs text-gold group-hover:underline transition-all flex items-center gap-1">
              View all badges →
            </p>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-gold/10 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-gold transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.15)] group-hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]">
            🏆
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Stats;
