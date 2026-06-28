import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  school: string;
  gpa: string;
  profilePicture: string;
  resumeUrl: string;
}

const Hero: React.FC = () => {
  const cleanName = (name: string) => name.replace(/^(Eng\.|Eng)\s+/i, '');

  const [data, setData] = useState<HeroData>({
    name: 'Youssef Hatem',
    title: 'Nuclear Engineering Student & Software Developer',
    subtitle: 'Passionate about building highly optimized software systems and exploring advanced nuclear engineering principles.',
    school: 'El-Dabaa Nuclear School',
    gpa: '4.0 / 4.0',
    profilePicture: '/assets/Youssef pic.jpeg',
    resumeUrl: '#'
  });

  useEffect(() => {
    api.get('/heroes')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const hero = res.data[0];
          setData({
            name: cleanName(hero.name || 'Youssef Hatem'),
            title: hero.title || 'Nuclear Engineering Student & Software Developer',
            subtitle: hero.subtitle || 'Passionate about building highly optimized software systems and exploring advanced nuclear engineering principles.',
            school: hero.school || 'El-Dabaa Nuclear School',
            gpa: hero.gpa || '4.0 / 4.0',
            profilePicture: hero.profilePicture || '/assets/Youssef pic.jpeg',
            resumeUrl: hero.resumeUrl || '#'
          });
        }
      })
      .catch(err => {
        console.log('Failed to fetch hero, using default branding data.', err);
      });
  }, []);

  const scrollToGPA = () => {
    document.getElementById('gpa-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCV = () => {
    if (data.resumeUrl && data.resumeUrl !== '#') {
      window.open(data.resumeUrl, '_blank');
    } else {
      alert('Resume not uploaded yet. You can contact Youssef directly!');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-28 pb-12 px-6 relative">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl text-blue-400 font-semibold mb-2 tracking-wide uppercase">Hello, I am</h2>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              {data.name.split(' ').slice(0, 2).join(' ')} <span className="text-gradient">{data.name.split(' ').slice(2).join(' ') || 'Hatem'}</span>
            </h1>
            <h3 className="text-2xl text-gray-200 font-light leading-relaxed">
              {data.title}
            </h3>
            <p className="text-gray-400 mt-4 text-base font-normal leading-relaxed max-w-lg">
              {data.subtitle}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 py-4"
          >
            <div className="glass-panel px-6 py-4 cursor-pointer rounded-2xl" onClick={scrollToGPA}>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Current GPA</p>
              <p className="text-2xl font-bold text-gold">{data.gpa}</p>
            </div>
            <div className="glass-panel px-6 py-4 rounded-2xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">School</p>
              <p className="text-base font-bold text-white">{data.school}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              View Portfolio
            </button>
            <button 
              onClick={handleDownloadCV}
              className="glass-panel hover:bg-white/10 hover:scale-105 active:scale-95 text-white px-8 py-3.5 rounded-full font-bold transition-all"
            >
              Download CV
            </button>
            <button 
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:scale-105 active:scale-95 px-8 py-3.5 rounded-full font-bold transition-all"
            >
              Contact Me
            </button>
          </motion.div>

          {/* National Championship Titles */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-6 border-t border-white/5 space-y-4"
          >
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              National Championships &amp; Titles (مراكز جمهورية)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-panel p-4 rounded-xl flex items-center gap-3 bg-white/[0.01] border border-white/5 hover:border-gold/30 transition-all duration-300 group">
                <span className="text-2xl group-hover:scale-110 transition-transform">🥇</span>
                <div>
                  <h4 className="text-xs text-gold font-bold uppercase tracking-wider">WorldSkills Egypt</h4>
                  <p className="text-xs text-white font-medium">1st Place Republic Level</p>
                  <p className="text-[10px] text-gray-500 font-medium">المركز الأول على مستوى الجمهورية</p>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-xl flex items-center gap-3 bg-white/[0.01] border border-white/5 hover:border-gold/30 transition-all duration-300 group">
                <span className="text-2xl group-hover:scale-110 transition-transform">🥇</span>
                <div>
                  <h4 className="text-xs text-gold font-bold uppercase tracking-wider">Cisco CCST Networking</h4>
                  <p className="text-xs text-white font-medium">Cisco Certified Support Tech</p>
                  <p className="text-[10px] text-gray-500 font-medium">شهادة معتمدة من شركة سيسكو العالمية</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Image Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-15"></div>
          <img 
            src={data.profilePicture} 
            alt={data.name} 
            className="w-72 md:w-96 h-96 rounded-[2rem] shadow-2xl object-cover border-4 border-white/5 z-10"
            onError={(e) => {
              e.currentTarget.src = '/assets/Youssef pic.jpeg';
            }}
          />
          {/* Floating badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute -bottom-4 -right-2 glass-panel p-4 z-20 flex items-center gap-3 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <p className="text-xs text-gold font-bold uppercase tracking-wider">International</p>
              <p className="text-sm font-bold text-white">Programming Trainer</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
