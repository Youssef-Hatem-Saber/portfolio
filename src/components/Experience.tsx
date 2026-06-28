import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

interface Experience {
  _id?: string;
  title: string;
  company: string;
  description: string;
  startDate?: string;
  endDate?: string;
  dateStr?: string; // formatted date range
}

const defaultExperiences: Experience[] = [
  {
    title: 'Founder & CEO',
    company: 'Hiretopia, Egypt',
    dateStr: '2025-09 – current',
    description: '• Founded a recruitment and business solutions company providing talent acquisition and HR services to clients across multiple industries.\n• Built and managed a team of recruiters, driving business growth through client acquisition and long-term partnerships.\n• Developed and implemented digital marketing and sales strategies to enhance brand visibility and generate sustainable revenue.'
  },
  {
    title: 'Team Leader – HR Recruitment & Business Developer',
    company: 'Mosla Pioneers, Egypt',
    dateStr: '2025-08 – Present (part time)',
    description: '• Leading a team of recruiters, monitoring performance, and providing continuous coaching and training.\n• Overseeing the full recruitment lifecycle (sourcing, screening, interviewing, and onboarding).\n• Managing client relationships and ensuring timely delivery of high-quality candidates.\n• Driving business development by acquiring new clients and maintaining long-term partnerships.\n• Contributing to company growth as a trusted recruitment partner for major clients.'
  },
  {
    title: 'Founder & chairman',
    company: 'B.A.S, Egypt',
    dateStr: '2025-06 – current (volunteer)',
    description: '• Founded a non-profit, student-led volunteer team to teach STEM subjects and support peers in academic and personal development.\n• Organized workshops and mentorship sessions to enhance scientific thinking and practical skills among students.\n• Promoted community engagement by leading initiatives focused on educational empowerment and equal learning opportunities.'
  },
  {
    title: 'Recruiter',
    company: 'Mosla Pioneers, Egypt',
    dateStr: '2024-12 – 2025-03 (part time)',
    description: '• Conducted sourcing and outreach to potential candidates through recruitment platforms.\n• Performed initial screenings and shortlisted qualified candidates for open roles.\n• Supported candidates throughout the hiring process until placement.\n• Assisted in building and maintaining a strong talent database.'
  },
  {
    title: 'Cold Caller',
    company: 'Mountain Solution, Egypt',
    dateStr: '2024-07 – 2025-02',
    description: '• Conducted outbound calls to potential clients, introducing the company’s services and scheduling free roof inspections.\n• Developed strong persuasion and communication skills through daily client interactions over the phone.\n• Gained hands-on experience in objection handling, CRM tools, and lead qualification.'
  },
  {
    title: 'Sales',
    company: 'El Salam International for Supplies and Contracting Company',
    dateStr: 'May 2024 - November 2024',
    description: '• Managed sales processes and client relationships for supplies and contracting projects.\n• Negotiated terms and secured orders with B2B clients.\n• Maintained service standards and customer satisfaction.'
  },
  {
    title: 'Head of Marketing',
    company: 'Sunrise Academy, Egypt',
    dateStr: '2023-06 - 2024-11 (volunteer)',
    description: '• Developed technical and non-technical marketing presentations, public relations campaigns, articles, and newsletters.\n• Developed and executed marketing programs to expand business solutions resulting in increased revenue.\n• Enhanced brand visibility through social media channels.'
  },
  {
    title: 'Professional International Trainer',
    company: 'Al-Sharif Center for Consulting & Training / Global Center for Peace & Development',
    dateStr: '2022-08 – 2023-12',
    description: '• Delivered professional international training programs and consulting services in leadership, self-development, and educational methods.\n• Empowered diverse student groups and professionals through structured training workshops.'
  },
  {
    title: 'Head of Marketing',
    company: 'KF, Egypt',
    dateStr: '2022-06 - 2023-06 (volunteer)',
    description: '• Managed partnerships and strategic business relationships by negotiating contract terms and handling conflicts.\n• Cultivated forward-thinking, inclusive, and performance-oriented business culture to lead employees in improving and achieving personal and team productivity goals.\n• Developed organizational initiatives to drive and maintain substantial business growth.'
  },
  {
    title: 'Head of Social Media',
    company: 'IES Physics Club, Egypt',
    dateStr: '2022-03 - 2022-05 (volunteer)',
    description: '• Analyzed and reported social media and online marketing campaign results.\n• Monitored online presence of company’s brand to engage with users and strengthen customer relationships.\n• Designed and implemented social media strategies to align with business goals.'
  },
  {
    title: 'Head of Social Media',
    company: 'Student Door, Egypt',
    dateStr: '2022-02 - 2022-04 (volunteer)',
    description: '• Increased customer engagement through social media.\n• Developed marketing content such as blogs, promotional materials, and advertisements for social media.\n• Designed and implemented social media strategies to align with business goals.'
  }
];

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);

  useEffect(() => {
    api.get('/experiences')
      .then(res => {
        if (res.data && res.data.length > 0) {
          // Sort by startDate descending (latest first)
          const sorted = [...res.data].sort((a: any, b: any) => {
            const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return timeB - timeA;
          });

          const mapped = sorted.map((exp: any) => {
            const start = exp.startDate ? new Date(exp.startDate).getFullYear() : '';
            const end = exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present';
            return {
              ...exp,
              dateStr: exp.dateStr || (start ? `${start} - ${end}` : 'Present'),
              // map schema 'title' to component role
              role: exp.title,
            };
          });
          setExperiences(mapped);
        }
      })
      .catch(err => {
        console.log('Failed to fetch experiences, using default timeline.', err);
      });
  }, []);

  return (
    <section id="experience-section" className="py-24 px-6 max-w-4xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Professional <span className="text-blue-400">Experience</span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-400 mx-auto rounded-full"></div>
      </motion.div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {experiences.map((exp: any, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-primary bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="text-white text-xs">💼</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-6 rounded-2xl">
              <div className="flex flex-col mb-2">
                <span className="text-gold font-bold text-sm mb-1">{exp.dateStr}</span>
                <h3 className="text-xl font-bold text-white">{exp.role || exp.title}</h3>
                <h4 className="text-blue-400 font-semibold">{exp.company}</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
