import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  rating: number; // 1 to 5
}

interface SkillGroup {
  category: string;
  items: Skill[];
  icon: string;
}

const skillGroups: SkillGroup[] = [
  {
    category: 'Business & Management',
    icon: '💼',
    items: [
      { name: 'Business Development & Client Acquisition', rating: 5 },
      { name: 'Recruitment & Talent Acquisition', rating: 5 },
      { name: 'Sales Strategy & Negotiation', rating: 5 },
      { name: 'Digital Marketing & Paid Campaigns (Meta, Google, LinkedIn)', rating: 4 },
      { name: 'Social Media Strategy & Content Creation', rating: 4 },
      { name: 'Marketing Analytics & Reporting', rating: 4 },
      { name: 'Brand Management & Storytelling', rating: 4 }
    ]
  },
  {
    category: 'Technical & Development',
    icon: '💻',
    items: [
      { name: 'Mobile App Development (Flutter, Dart)', rating: 4 },
      { name: 'Backend & Database (Firebase, REST APIs, Supabase)', rating: 4 },
      { name: 'Full-Stack Development (React, Node.js, MongoDB)', rating: 4 },
      { name: 'Computer Networking (TCP/IP, Cisco IOS CLI)', rating: 4 },
      { name: 'AI & Machine Learning Fundamentals', rating: 4 },
      { name: 'Java & Kotlin Programming', rating: 4 },
      { name: 'UI/UX Design (Figma)', rating: 4 },
      { name: 'Python Programming', rating: 3 }
    ]
  },
  {
    category: 'Soft Skills',
    icon: '🤝',
    items: [
      { name: 'Communication & Persuasion', rating: 5 },
      { name: 'Leadership & Team Management', rating: 5 },
      { name: 'Presentation & Public Speaking', rating: 5 },
      { name: 'Project Management & Targeting', rating: 4 },
      { name: 'Problem-Solving & Critical Thinking', rating: 4 }
    ]
  },
  {
    category: 'Tools & Platforms',
    icon: '🛠️',
    items: [
      { name: 'CRM Tools', rating: 4 },
      { name: 'Ads Managers (Meta, Google, LinkedIn Ads)', rating: 4 },
      { name: 'Collaboration Tools (Trello, Asana, Notion)', rating: 4 },
      { name: 'Git & Version Control', rating: 3 }
    ]
  }
];

const Skills: React.FC = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-base leading-none ${i <= rating ? 'text-gold' : 'text-gray-700'}`}
        >
          ★
        </span>
      );
    }
    return <div className="flex gap-0.5 select-none">{stars}</div>;
  };

  return (
    <section id="skills-section" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Professional <span className="text-gold">Skills</span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-gold to-yellow-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-400 font-light">A curated collection of my core competencies, technical stack, and business expertise.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {skillGroups.map((group, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="glass-panel p-8 rounded-3xl flex flex-col h-full bg-[#0B1E3A]/40 border border-white/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3.5 mb-6 border-b border-white/5 pb-4">
              <span className="text-3xl">{group.icon}</span>
              <h3 className="text-xl font-bold text-white tracking-tight font-heading">{group.category}</h3>
            </div>
            
            <div className="space-y-3.5 flex-1">
              {group.items.map((skill, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 px-4 py-3 rounded-2xl transition-all duration-300 group"
                >
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{skill.name}</span>
                  {renderStars(skill.rating)}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
