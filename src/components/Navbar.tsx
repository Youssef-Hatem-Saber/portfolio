import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'About', targetId: 'about-section' },
  { label: 'Academic', targetId: 'gpa-section' },
  { label: 'Courses', targetId: 'courses-section' },
  { label: 'Experience', targetId: 'experience-section' },
  { label: 'Projects', targetId: 'projects-section' },
  { label: 'Letters', targetId: 'recommendations-section' },
  { label: 'Awards', targetId: 'competitions-section' },
  { label: 'Skills', targetId: 'skills-section' },
  { label: 'Contact', targetId: 'contact-section' },
];

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about-section');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Background shift on scroll
      setIsScrolled(window.scrollY > 20);

      // Active section highlight logic
      const scrollPosition = window.scrollY + 200;
      for (const item of navItems) {
        const el = document.getElementById(item.targetId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.targetId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (targetId: string) => {
    setIsOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-[#0B1E3A]/80 backdrop-blur-md border-b border-white/5 shadow-lg' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between md:justify-start md:gap-12 items-center">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            src="/assets/Y.H logo.png" 
            alt="Y.H Logo" 
            className="h-16 md:h-20 w-auto object-contain hover:scale-105 transition-all duration-300" 
            onError={(e) => {
              // Fallback text if image logo fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <span 
            id="text-logo" 
            className="text-xl md:text-2xl font-extrabold tracking-wider text-white hover:text-blue-400 transition-colors font-heading"
          >
            Youssef<span className="text-gold">Hatem</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 ml-auto md:ml-4">
          {navItems.map((item) => (
            <button
              key={item.targetId}
              onClick={() => handleNavClick(item.targetId)}
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-white relative rounded-full ${
                activeSection === item.targetId ? 'text-gold' : 'text-gray-300'
              }`}
            >
              {item.label}
              {activeSection === item.targetId && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-white/5 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
          <button 
            onClick={() => handleNavClick('contact-section')} // scroll to end or contact
            className="ml-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-105"
          >
            Get In Touch
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-blue-400 focus:outline-none p-1"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B1E3A]/95 backdrop-blur-lg border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.targetId}
                  onClick={() => handleNavClick(item.targetId)}
                  className={`py-2 text-left text-base font-medium transition-colors border-b border-white/5 pb-2 ${
                    activeSection === item.targetId ? 'text-gold pl-2 border-l-2 border-l-gold' : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('contact-section')}
                className="mt-2 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-bold transition-all text-center"
              >
                Get In Touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
