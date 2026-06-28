import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiAward, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSearch, 
  FiChevronDown, 
  FiCompass 
} from 'react-icons/fi';
import api from '../utils/api';

interface Competition {
  _id?: string;
  name: string;
  award: string;
  description: string;
  image: string;
  certificateUrl: string;
  date?: string | Date;
  dateStr?: string;
}

const Competitions: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'certificates' | 'medals'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const isMedalItem = (c: Competition) => {
    const imgLower = c.image.toLowerCase();
    const awardLower = c.award ? c.award.toLowerCase() : '';
    const nameLower = c.name ? c.name.toLowerCase() : '';
    return imgLower.includes('59046') || 
           imgLower.includes('medal') || 
           imgLower.includes('ميدالية') || 
           awardLower.includes('medal') || 
           awardLower.includes('ميدالية') ||
           nameLower.includes('medal') || 
           nameLower.includes('ميدالية');
  };
  
  // Lightbox State
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/competitions')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((c: any) => {
            let dateStr = 'Awarded';
            if (c.date) {
              const d = new Date(c.date);
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              dateStr = `${months[d.getMonth()]} ${d.getFullYear()}`;
            }
            return {
              ...c,
              dateStr
            };
          });
          setCompetitions(mapped);
        }
      })
      .catch(err => {
        console.log('Failed to fetch competitions, using empty list.', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter & Sort Logic
  const getFilteredCompetitions = () => {
    let result = [...competitions];

    // Filter by type
    if (filterType === 'certificates') {
      result = result.filter(c => !isMedalItem(c));
    } else if (filterType === 'medals') {
      result = result.filter(c => isMedalItem(c));
    }

    // Filter by search term (name, award, or description)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.award.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
      );
    }

    // Sort chronologically
    result.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  };

  const filteredComps = getFilteredCompetitions();

  // Navigation inside Lightbox
  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx(prev => (prev !== null && prev > 0 ? prev - 1 : filteredComps.length - 1));
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx(prev => (prev !== null && prev < filteredComps.length - 1 ? prev + 1 : 0));
  };

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIdx === null) return;
      if (e.key === 'Escape') setActivePhotoIdx(null);
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx, filteredComps]);

  // Statistics
  const totalMedalsCount = competitions.filter(isMedalItem).length;
  const totalCertificatesCount = competitions.length - totalMedalsCount;

  return (
    <section id="competitions-section" className="py-28 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold uppercase tracking-widest mb-4">
          <FiAward className="text-sm animate-pulse" /> Achievements Gallery
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Awards &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-400 to-yellow-500">Competitions</span>
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-gold to-yellow-500 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Explore a showcase of medals, honors, and certifications won by Youssef Hatem throughout his academic and technical journey.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 max-w-xl mx-auto gap-4 mt-8">
          <div className="glass-panel py-3 px-4 rounded-xl flex flex-col justify-center items-center border border-white/5 bg-white/[0.01]">
            <span className="text-2xl md:text-3xl font-extrabold text-gold">{competitions.length}</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Total Awards</span>
          </div>
          <div className="glass-panel py-3 px-4 rounded-xl flex flex-col justify-center items-center border border-white/5 bg-white/[0.01]">
            <span className="text-2xl md:text-3xl font-extrabold text-amber-500">{totalMedalsCount}</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Medals Won</span>
          </div>
          <div className="glass-panel py-3 px-4 rounded-xl flex flex-col justify-center items-center border border-white/5 bg-white/[0.01]">
            <span className="text-2xl md:text-3xl font-extrabold text-yellow-500">{totalCertificatesCount}</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Certificates</span>
          </div>
        </div>
      </motion.div>

      {/* Control Panel (Search, Filters, Sort) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-4 md:p-6 rounded-2xl mb-12 border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col lg:flex-row gap-4 justify-between items-center shadow-2xl"
      >
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input 
            type="text"
            placeholder="Search award, competition or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-all duration-300 text-sm font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-hidden">
          {(['all', 'certificates', 'medals'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filterType === type 
                  ? 'bg-gradient-to-r from-gold to-yellow-500 text-black shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="relative w-full md:w-auto">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="w-full md:w-auto appearance-none bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-5 py-3 pr-12 text-sm text-gray-300 font-medium focus:outline-none focus:border-gold/50 cursor-pointer transition-all duration-300"
          >
            <option value="newest" className="bg-black text-white">Sort: Newest First</option>
            <option value="oldest" className="bg-black text-white">Sort: Oldest First</option>
          </select>
          <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading awards gallery...</p>
        </div>
      ) : filteredComps.length === 0 ? (
        <div className="text-center py-20 glass-panel border border-white/5 rounded-2xl">
          <FiCompass className="text-5xl text-gray-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2">No Awards Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">We couldn't find any certificates or medals matching your search criteria. Try using different keywords.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredComps.map((comp, idx) => (
              <motion.div
                key={comp._id || idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 15 }}
                whileHover={{ y: -8 }}
                onClick={() => setActivePhotoIdx(idx)}
                className="glass-panel bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-gold/30 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-xl flex flex-col h-full"
              >
                {/* Image Cover container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40 border-b border-white/5">
                  <img 
                    src={comp.image} 
                    alt={comp.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle golden glare overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  {/* Hover indicator */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-4 py-2 rounded-lg bg-gold text-black font-extrabold text-xs uppercase tracking-wider shadow-lg">
                      View Fullscreen
                    </span>
                  </div>

                  {/* Top-Right Badge: Medal Icon */}
                  {isMedalItem(comp) ? (
                    <div className="absolute top-4 right-4 bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      🏅 Medal
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-gold/15 backdrop-blur-md text-gold border border-gold/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      📜 Certificate
                    </div>
                  )}
                </div>

                {/* Card Content details */}
                <div className="p-6 flex flex-col flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <FiCalendar className="text-gray-500" />
                      <span>{comp.dateStr}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-300 mb-1 leading-snug">
                    {comp.name}
                  </h3>

                  {/* Award Rank */}
                  <p className="text-gold font-semibold text-xs tracking-wider uppercase mb-3 flex items-center gap-1">
                    🏆 {comp.award}
                  </p>

                  {/* Description */}
                  <p className="text-gray-400 text-xs leading-relaxed flex-1 line-clamp-3">
                    {comp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox fullscreen overlay */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex flex-col justify-between"
            onClick={() => setActivePhotoIdx(null)}
          >
            {/* Top Toolbar */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-black/55 to-transparent text-white w-full">
              <span className="text-sm font-semibold tracking-wider font-mono bg-white/10 px-3 py-1 rounded-full">
                {activePhotoIdx + 1} / {filteredComps.length}
              </span>
              <button
                onClick={() => setActivePhotoIdx(null)}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-xl transition-all duration-300 hover:rotate-90"
              >
                <FiX />
              </button>
            </div>

            {/* Middle Container (Arrow buttons + Image) */}
            <div className="flex-1 flex items-center justify-between px-4 md:px-10 relative">
              {/* Prev Button */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 md:left-8 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-full text-white text-2xl transition-all duration-300 z-10 shadow-2xl hover:scale-110"
              >
                <FiChevronLeft />
              </button>

              {/* High-res Image display */}
              <div 
                className="max-w-5xl max-h-[70vh] mx-auto w-full h-full flex items-center justify-center p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  key={activePhotoIdx}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={filteredComps[activePhotoIdx].image}
                  alt={filteredComps[activePhotoIdx].name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPhoto}
                className="absolute right-4 md:right-8 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-full text-white text-2xl transition-all duration-300 z-10 shadow-2xl hover:scale-110"
              >
                <FiChevronRight />
              </button>
            </div>

            {/* Bottom details drawer panel */}
            <div 
              className="bg-gradient-to-t from-black via-black/90 to-transparent p-6 md:p-8 text-center text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider mb-3 border border-gold/30">
                  🏅 {filteredComps[activePhotoIdx].award}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white mb-2">
                  {filteredComps[activePhotoIdx].name}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                  {filteredComps[activePhotoIdx].description}
                </p>
                <div className="flex justify-center items-center gap-2 mt-4 text-xs text-gray-500 font-mono">
                  <FiCalendar />
                  <span>Awarded: {filteredComps[activePhotoIdx].dateStr}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Competitions;
