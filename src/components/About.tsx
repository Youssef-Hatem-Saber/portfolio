import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiBook, FiBriefcase, FiCode, FiStar } from 'react-icons/fi';
import api from '../utils/api';

const About: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('/assets/Youssef pic.jpeg');
  
  // Dynamic stats states
  const [yearsOfExp, setYearsOfExp] = useState<string>('4+');
  const [projectsCount, setProjectsCount] = useState<number>(25);
  const [awardsCount, setAwardsCount] = useState<number>(72);
  const [coursesCount, setCoursesCount] = useState<number>(19);
  const [badgesCount, setBadgesCount] = useState<number>(17);

  useEffect(() => {
    // 1. Fetch About biography and experience
    api.get('/about')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const ab = res.data[0];
          setYearsOfExp(ab.yearsOfExperience !== undefined ? `${ab.yearsOfExperience}+` : '4+');
          setDescription(ab.description || '');
        }
      })
      .catch(err => console.log('Failed to fetch about biography.', err));

    // 2. Fetch Projects count
    api.get('/projects')
      .then(res => {
        if (res.data) setProjectsCount(res.data.length);
      })
      .catch(err => console.log('Failed to fetch projects count.', err));

    // 3. Fetch Awards/Competitions count
    api.get('/competitions')
      .then(res => {
        if (res.data) setAwardsCount(res.data.length);
      })
      .catch(err => console.log('Failed to fetch awards count.', err));

    // 4. Fetch Courses count
    api.get('/courses')
      .then(res => {
        if (res.data) setCoursesCount(res.data.length);
      })
      .catch(err => console.log('Failed to fetch courses count.', err));

    // 5. Fetch Badges count
    api.get('/badges')
      .then(res => {
        if (res.data) setBadgesCount(res.data.length);
      })
      .catch(err => console.log('Failed to fetch badges count.', err));

    // Fetch hero image to keep profile picture synced
    api.get('/heroes')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProfilePic(res.data[0].profilePicture || '/assets/Youssef pic.jpeg');
        }
      })
      .catch(err => console.log('Failed to fetch profile picture for about.', err));
  }, []);

  // Parse markdown bold text to beautiful JSX
  const renderRichText = (text: string) => {
    if (!text) return null;
    return text.split('\n').filter(p => p.trim() !== '').map((para, paraIdx) => {
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={paraIdx} className="text-gray-300 text-sm md:text-base leading-relaxed font-light mb-4 last:mb-0">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={i} className="font-bold text-white bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  const handleStatClick = (label: string) => {
    if (label === 'Years of Experience') {
      document.getElementById('experience-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (label === 'Projects Completed') {
      document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (label === 'Awards & Medals') {
      document.getElementById('competitions-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (label === 'Completed Courses') {
      window.dispatchEvent(new CustomEvent('change-courses-tab', { detail: 'certificates' }));
      document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (label === 'Earned Badges') {
      window.dispatchEvent(new CustomEvent('change-courses-tab', { detail: 'badges' }));
      document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { label: 'Years of Experience', value: yearsOfExp, icon: <FiBriefcase className="text-blue-400" /> },
    { label: 'Projects Completed', value: `${projectsCount}+`, icon: <FiCode className="text-emerald-400" /> },
    { label: 'Awards & Medals', value: `${awardsCount}+`, icon: <FiAward className="text-gold" /> },
    { label: 'Completed Courses', value: `${coursesCount}`, icon: <FiBook className="text-yellow-400" /> },
    { label: 'Earned Badges', value: `${badgesCount}`, icon: <FiStar className="text-purple-400" /> },
  ];

  return (
    <section id="about-section" className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

      {/* Grid Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        
        {/* Left Column: Image Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-4 flex justify-center"
        >
          <div className="relative group">
            {/* Outer spinning rotating neon glow borders */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-gold to-blue-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            <div className="relative bg-secondary-dark p-3 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <img 
                src={profilePic} 
                alt="Youssef Hatem" 
                className="w-64 h-80 rounded-[2rem] object-cover object-center bg-black/40"
                onError={(e) => {
                  e.currentTarget.src = '/assets/Youssef pic.jpeg';
                }}
              />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#091527]/90 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg min-w-[200px] justify-center">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-bold text-white tracking-wider uppercase">Republic Rank #1</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Bio description */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8 space-y-6 text-left"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">
              ⚡ Profile Introduction
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-gold">Me</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-gold rounded-full mt-3"></div>
          </div>

          <div className="prose prose-invert max-w-none">
            {renderRichText(description)}
          </div>
        </motion.div>
      </div>

      {/* Dynamic Statistics Panel (5 columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => handleStatClick(stat.label)}
            className={`glass-panel p-6 text-center rounded-2xl cursor-pointer border border-white/5 bg-[#0B1E3A]/20 hover:bg-[#0B1E3A]/40 backdrop-blur-sm transition-all duration-300 shadow-xl flex flex-col justify-between items-center ${
              idx === 4 && 'col-span-2 md:col-span-1' // stretch last stat on small screens
            }`}
          >
            {/* Stat Icon */}
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg mb-3 shadow-inner">
              {stat.icon}
            </div>

            {/* Stat Value */}
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-1">
              {stat.value}
            </h3>

            {/* Stat Label */}
            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider leading-snug">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About;
