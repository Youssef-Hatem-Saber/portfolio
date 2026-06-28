import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub, FiExternalLink } from 'react-icons/fi';
import api from '../utils/api';

interface Project {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  gallery?: string[];
  article?: string;
  order?: number;
}

const defaultProjects: Project[] = [
  {
    title: 'E-Learning Platform',
    description: 'A full-stack modern e-learning solution with video streaming and interactive quizzes.',
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
    githubUrl: '#',
    liveUrl: '#',
    gallery: [],
    article: '### Project Overview\nA complete full-stack e-learning system.'
  }
];

// Helper to parse simple markdown to JSX
const parseArticle = (text?: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    if (!cleanLine) return <div key={idx} className="h-2" />;

    // Headings
    if (cleanLine.startsWith('### ')) {
      return (
        <h4 key={idx} className="text-xl font-bold text-blue-400 mt-6 mb-3 border-b border-white/5 pb-1 text-left">
          {cleanLine.substring(4)}
        </h4>
      );
    }
    if (cleanLine.startsWith('## ')) {
      return (
        <h3 key={idx} className="text-2xl font-bold text-white mt-8 mb-4 text-left">
          {cleanLine.substring(3)}
        </h3>
      );
    }

    // List items
    if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
      return (
        <li key={idx} className="text-gray-300 ml-4 mb-2 list-disc pl-1 leading-relaxed text-sm text-left">
          {parseBoldText(cleanLine.substring(2))}
        </li>
      );
    }

    // Regular paragraphs
    return (
      <p key={idx} className="text-gray-300 mb-4 leading-relaxed text-sm text-left">
        {parseBoldText(cleanLine)}
      </p>
    );
  });
};

// Helper to parse **bold** text
const parseBoldText = (text: string) => {
  const parts = text.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-blue-300 font-semibold">{part}</strong>;
    }
    return part;
  });
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((p: any) => ({
            ...p,
            technologies: Array.isArray(p.technologies) ? p.technologies : (p.technologies ? p.technologies.split(',') : [])
          }));
          mapped.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          setProjects(mapped);
        }
      })
      .catch(err => {
        console.log('Failed to fetch projects, using defaults.', err);
      });
  }, []);

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setActiveImgIdx(0);
  };

  const nextImage = (e: React.MouseEvent, galleryLength: number) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % galleryLength);
  };

  const prevImage = (e: React.MouseEvent, galleryLength: number) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + galleryLength) % galleryLength);
  };

  return (
    <section id="projects-section" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Featured <span className="text-blue-400">Projects</span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-400 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-400 font-light">Click on any project to explore detailed case studies and screenshot galleries.</p>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project._id || idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            onClick={() => openProjectDetails(project)}
            className="glass-panel p-8 rounded-2xl flex flex-col cursor-pointer border border-white/5 hover:border-blue-500/30 transition-all group"
          >
            {/* Tech Cover Accent */}
            <div className="flex justify-between items-start mb-6">
              <span className="text-2xl">
                {project.title.includes('Road') || project.title.includes('Siren') ? '🚗' : 
                 project.title.includes('Eye') || project.title.includes('Diagnosis') ? '👁️' :
                 project.title.includes('Nuclear') || project.title.includes('Tapea') ? '⚡' : 
                 project.title.includes('Loyalty') ? '💳' : '💻'}
              </span>
              <span className="text-xs text-blue-400 bg-blue-950/40 border border-blue-500/20 px-3 py-1 rounded-full group-hover:bg-blue-900/50 transition-colors">
                Case Study
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 text-left group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            
            <p className="text-gray-300 mb-6 flex-1 text-sm leading-relaxed text-left">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <span key={i} className="text-xs text-blue-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/10">
                  {tech.trim()}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                  +{project.technologies.length - 4} more
                </span>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-blue-400 group-hover:text-blue-300 text-sm font-semibold transition-colors">
              <span>Read Full Case Study</span>
              <span className="ml-1 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex justify-center overflow-y-auto p-4 md:p-10 bg-black/85 backdrop-blur-md">
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="my-auto bg-[#0B1528] border border-blue-500/20 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/80 hover:scale-105 text-white rounded-full p-2 transition-all cursor-pointer border border-white/10"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Modal Content Scroll */}
              <div className="overflow-y-auto flex-1 flex flex-col md:flex-row">
                
                {/* Left Side: Images Gallery */}
                {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                  <div className="w-full md:w-1/2 bg-[#060D1A] flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-white/10 min-h-[300px] md:min-h-0">
                    <img
                      src={selectedProject.gallery[activeImgIdx]}
                      alt={`${selectedProject.title} detail ${activeImgIdx + 1}`}
                      className="w-full h-full object-contain max-h-[350px] md:max-h-none p-4"
                    />

                    {/* Navigation Arrows */}
                    {selectedProject.gallery.length > 1 && (
                      <>
                        <button
                          onClick={(e) => prevImage(e, selectedProject.gallery!.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all z-20 cursor-pointer border border-white/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                          onClick={(e) => nextImage(e, selectedProject.gallery!.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all z-20 cursor-pointer border border-white/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                        </button>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/50 px-3.5 py-1.5 rounded-full border border-white/10">
                          {selectedProject.gallery.map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImgIdx(i);
                              }}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImgIdx ? 'bg-blue-400 scale-125' : 'bg-white/40'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Right Side: Detailed Article */}
                <div className={`p-6 md:p-10 overflow-y-auto flex-1 flex flex-col ${!(selectedProject.gallery && selectedProject.gallery.length > 0) ? 'w-full' : 'w-full md:w-1/2'}`}>
                  <h3 className="text-3xl font-extrabold text-white mb-2 leading-tight text-left">
                    {selectedProject.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.technologies.map((tech, i) => (
                      <span key={i} className="text-xs text-blue-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/10">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="prose prose-invert max-w-none flex-1">
                    {parseArticle(selectedProject.article || selectedProject.description)}
                  </div>

                  {/* Links Footer */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4">
                    {selectedProject.githubUrl && selectedProject.githubUrl !== '#' && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10"
                      >
                        <FiGithub className="w-4 h-4" />
                        <span>View Source Code</span>
                      </a>
                    )}
                    {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/15"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
