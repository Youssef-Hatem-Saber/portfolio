import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

interface Course {
  _id?: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  image: string;
  certificateUrl?: string;
}

interface Badge {
  _id?: string;
  title: string;
  issuer?: string;
  description?: string;
  image?: string;
  date?: string | Date;
}

const fallbackCourses: Course[] = [
  {
    title: 'AI Fundamentals with IBM SkillsBuild',
    description: 'Professional certification in Artificial Intelligence foundations, cognitive concepts, and real-world application pipelines.',
    duration: '22 Hours',
    skills: ['AI', 'Machine Learning', 'Cognitive Science'],
    certificateUrl: '/assets/documents/AI_Fundamentals_with_IBM_SkillsBuild_certificate_youssefhatem158-gmail-com_f06f9d93-f2be-45fa-bf69-e082163d51bd.pdf',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Cyber Threat Management',
    description: 'Specialized training by Cisco Networking Academy in threat defense, network security monitoring, and endpoint vulnerability scanning.',
    duration: '22 Hours',
    skills: ['Cybersecurity', 'Threat Analysis', 'Security Operations'],
    certificateUrl: '/assets/documents/Cyber_Threat_Management_certificate_youssefhatem158-gmail-com_516caea1-bd17-4f26-b8e0-83e67433ef0c.pdf',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Dart 101 Certificate',
    description: 'Foundational programming concepts in Dart language, object-oriented code, generic collections, and memory management.',
    duration: '10 Hours',
    skills: ['Dart', 'Programming', 'OOP'],
    certificateUrl: '/assets/documents/Dart 101.pdf',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Endpoint Security Certification',
    description: 'Cisco security course covering security endpoints, malware protection mechanisms, encryption systems, and secure device connections.',
    duration: '22 Hours',
    skills: ['Security', 'Endpoints', 'Network Defense'],
    certificateUrl: '/assets/documents/Endpoint_Security_certificate_youssefhatem158-gmail-com_53be52ba-eced-4d83-932f-1f02feb3f23a.pdf',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'English for IT 1',
    description: 'Language training focusing on communications, vocabulary, and tech reporting inside software teams.',
    duration: '22 Hours',
    skills: ['English', 'IT Communication'],
    certificateUrl: '/assets/documents/English_for_IT_1_certificate_youssefhatem158-gmail-com_a178ef2e-315c-4f8c-be23-6a99fac8ac94.pdf',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'English for IT 2',
    description: 'Advanced course focusing on technical presentations, software specifications, and customer-facing interactions in English.',
    duration: '22 Hours',
    skills: ['English', 'Advanced IT Communication'],
    certificateUrl: '/assets/documents/English_for_IT_2_certificate_youssefhatem158-gmail-com_8b632220-4bf1-48ff-9cfd-4da71d1a9487.pdf',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Flutter 101 Certificate',
    description: 'Introduction to building Android and iOS hybrid applications using Flutter and Dart from scratch.',
    duration: '20 Hours',
    skills: ['Flutter', 'Mobile Dev', 'Dart'],
    certificateUrl: '/assets/documents/Flutter 101.pdf',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Flutter 102 Certificate',
    description: 'Advanced Flutter developer training focusing on custom paints, local caching, state management patterns, and REST integration.',
    duration: '25 Hours',
    skills: ['Flutter', 'State Management', 'APIs'],
    certificateUrl: '/assets/documents/Flutter 102.pdf',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Introduction to Cybersecurity',
    description: 'Overview of threat vectors, cryptography, digital security principles, and host vulnerability mitigation.',
    duration: '22 Hours',
    skills: ['Cybersecurity', 'Encryption', 'Security Policies'],
    certificateUrl: '/assets/documents/Introduction_to_Cybersecurity_certificate_youssefhatem158-gmail-com_496122eb-becb-4301-b41f-f0bfd81c6749.pdf',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Introduction to Modern AI',
    description: 'Basic introduction to generative pre-trained transformers, LLM prompt engineering, and modern AI development frameworks.',
    duration: '22 Hours',
    skills: ['AI', 'LLMs', 'Prompt Engineering'],
    certificateUrl: '/assets/documents/Introduction_to_Modern_AI_certificate_youssefhatem158-gmail-com_97333307-8b8d-4701-8522-7a0ee3f9e887.pdf',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Kotlin 101 Certificate',
    description: 'Introduction to Kotlin programming language, basic syntax, variables, conditionals, and loops.',
    duration: '12 Hours',
    skills: ['Kotlin', 'Programming'],
    certificateUrl: '/assets/documents/Kotlin 101.pdf',
    image: '/assets/documents/Kotlin Course.png'
  },
  {
    title: 'Kotlin 102 Certificate',
    description: 'Object-oriented programming, inheritance, polymorphism, interfaces, and null safety in Kotlin.',
    duration: '15 Hours',
    skills: ['Kotlin', 'OOP', 'Null Safety'],
    certificateUrl: '/assets/documents/Kotlin 102.pdf',
    image: '/assets/documents/Kotlin Course (1).png'
  },
  {
    title: 'Kotlin 103 Certificate',
    description: 'Advanced functional programming, lambda expressions, coroutines, and asynchronous programming in Kotlin.',
    duration: '20 Hours',
    skills: ['Kotlin', 'Coroutines', 'Async'],
    certificateUrl: '/assets/documents/kotlin 103.pdf',
    image: '/assets/documents/Kotlin Course (2).png'
  },
  {
    title: 'Network Addressing & Basic Troubleshooting',
    description: 'Training covering IPv4/IPv6 address design, subnet calculation, and network device diagnosis protocols.',
    duration: '22 Hours',
    skills: ['Networking', 'Subnetting', 'Troubleshooting'],
    certificateUrl: '/assets/documents/Network_Addressing_and_Basic_Troubleshooting_certificate_youssefhatem158-gmail-com_58a88573-7be5-4e45-9815-7494be66807a.pdf',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Network Defense Certification',
    description: 'Defense topologies, VPN setups, firewalls, and network vulnerability management.',
    duration: '22 Hours',
    skills: ['Network Security', 'Firewalls', 'VPNs'],
    certificateUrl: '/assets/documents/Network_Defense_certificate_youssefhatem158-gmail-com_dcb504f1-dfff-4f71-9365-3ec7face193d.pdf',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Network Support and Security',
    description: 'Techniques and support protocols to ensure data integrity and network performance security.',
    duration: '22 Hours',
    skills: ['Support', 'Network Security'],
    certificateUrl: '/assets/documents/Network_Support_and_Security_certificate_youssefhatem158-gmail-com_48fc76ef-a877-47b4-855c-b8f3e7cc054b.pdf',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Networking Basics',
    description: 'Introduction to routers, switches, physical cables, network addresses, and OSI model structures.',
    duration: '22 Hours',
    skills: ['Networking', 'TCP/IP', 'OSI Model'],
    certificateUrl: '/assets/documents/Networking_Basics_certificate_youssefhatem158-gmail-com_417918ce-e8a5-447b-af70-20a3091a1c48.pdf',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Networking Devices & Initial Configuration',
    description: 'Configuring IOS Cisco devices, basic passwords setup, SSH access, and local subnet configuration.',
    duration: '22 Hours',
    skills: ['Cisco iOS', 'Initial Configuration', 'Cisco CLI'],
    certificateUrl: '/assets/documents/Networking_Devices_and_Initial_Configuration_certificate_youssefhatem158-gmail-com_eca9533d-aca6-4620-9e29-bfee0c29bdee.pdf',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'TOT (Training of Trainers)',
    description: 'Professional training program focused on instructional design, public speaking, classroom management, and adult learning principles.',
    duration: '40 Hours',
    skills: ['Instructional Design', 'Public Speaking', 'Adult Learning'],
    certificateUrl: '/assets/documents/TOT.jpeg',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
  }
];

const fallbackBadges: Badge[] = [
  {
    title: 'Java Competency Badge',
    issuer: 'Oracle Academy',
    description: 'Recognizes professional-level competency in Java structures, multithreading, databases, and OOP.',
    image: '/assets/documents/وسام Java.png',
    date: '2024-05-10'
  },
  {
    title: 'Saudi National Day 92 Badge',
    issuer: 'National Technology Hub',
    description: 'Participation and organization badge for technical workshops held during the 92nd National Day.',
    image: '/assets/documents/اليوم الوطني ٩٢.png',
    date: '2022-09-23'
  },
  {
    title: 'TOT (Training of Trainers) Certification',
    issuer: 'International Training Center',
    description: 'Awarded for demonstrating mastery in pedagogical methods, technical course planning, public speaking, and interactive training.',
    image: '/assets/documents/TOT.jpeg',
    date: '2023-11-15'
  },
  {
    title: 'Cisco Certified Support Technician Networking (CCST Networking)',
    issuer: 'Cisco',
    description: 'Demonstrates entry-level routing and switching, cybersecurity, and networking support skills.',
    image: 'https://images.credly.com/images/c60f9007-64bb-42ed-869b-e1f05d6d77f2/image.png',
    date: '2025-01-01'
  },
  {
    title: 'AI Fundamentals with IBM SkillsBuild',
    issuer: 'IBM SkillsBuild',
    description: 'Professional certification in Artificial Intelligence foundations, cognitive concepts, and real-world application pipelines.',
    image: 'https://images.credly.com/images/26c21273-c0ab-485b-98a7-f1212dcb82b8/image.png',
    date: '2025-01-01'
  },
  {
    title: 'Artificial Intelligence Fundamentals',
    issuer: 'IBM SkillsBuild',
    description: 'Foundational knowledge of AI concepts, neural networks, machine learning, and AI ethics.',
    image: 'https://images.credly.com/images/82b908e1-fdcd-4785-9d32-97f11ccbcf08/image.png',
    date: '2025-01-01'
  },
  {
    title: 'Endpoint Security',
    issuer: 'Cisco Networking Academy',
    description: 'Covers malware protection, device encryption, and secure network endpoint defenses.',
    image: 'https://images.credly.com/images/0ca5f542-fb5e-4a22-9b7a-c1a1ce4c3db7/EndpointSecurity.png',
    date: '2025-01-01'
  },
  {
    title: 'Network Defense',
    issuer: 'Cisco Networking Academy',
    description: 'Validates skills in defense topologies, VPN setups, firewalls, and network vulnerability management.',
    image: 'https://images.credly.com/images/51526f76-711b-4caf-b04d-27f89512b112/NetworkDefense_v1_091721.png',
    date: '2025-01-01'
  },
  {
    title: 'Network Addressing and Basic Troubleshooting',
    issuer: 'Cisco Networking Academy',
    description: 'Covers IPv4/IPv6 address design, subnet calculation, and network device diagnosis protocols.',
    image: 'https://images.credly.com/images/49c099bd-8542-4f48-8c03-f21799dcaf51/image.png',
    date: '2025-01-01'
  },
  {
    title: 'Networking Basics',
    issuer: 'Cisco Networking Academy',
    description: 'Covers routers, switches, physical cables, network addresses, and OSI model structures.',
    image: 'https://images.credly.com/images/5bdd6a39-3e03-4444-9510-ecff80c9ce79/image.png',
    date: '2025-01-01'
  },
  {
    title: 'Cyber Threat Management',
    issuer: 'Cisco Networking Academy',
    description: 'Covers threat defense, network security monitoring, and endpoint vulnerability scanning.',
    image: 'https://images.credly.com/images/5d5ac32b-d239-42b8-9665-8a921dc3ab47/image.png',
    date: '2025-01-01'
  },
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    description: 'Overview of threat vectors, cryptography, digital security principles, and host vulnerability mitigation.',
    image: 'https://images.credly.com/images/af8c6b4e-fc31-47c4-8dcb-eb7a2065dc5b/I2CS__1_.png',
    date: '2025-01-01'
  },
  {
    title: 'Networking Devices and Initial Configuration',
    issuer: 'Cisco Networking Academy',
    description: 'Covers configuring Cisco IOS devices, passwords, SSH access, and local subnet configuration.',
    image: 'https://images.credly.com/images/88316fe8-5651-4e61-a6be-5be1558f049e/image.png',
    date: '2025-01-01'
  },
  {
    title: 'Network Support and Security',
    issuer: 'Cisco Networking Academy',
    description: 'Covers techniques and support protocols to ensure data integrity and network performance security.',
    image: 'https://images.credly.com/images/a4dd891f-7bf5-4938-8241-50dc81e8cc00/image.png',
    date: '2025-01-01'
  },
  {
    title: 'Introduction to Modern AI',
    issuer: 'IBM SkillsBuild',
    description: 'Basic introduction to generative pre-trained transformers, LLM prompt engineering, and modern AI development frameworks.',
    image: 'https://images.credly.com/images/e2d12302-10f9-40d4-8ff1-066a7008b61d/blob',
    date: '2025-01-01'
  },
  {
    title: 'English for IT 1',
    issuer: 'Cisco Networking Academy',
    description: 'Language training focusing on communications, vocabulary, and tech reporting inside software teams.',
    image: 'https://images.credly.com/images/77b1ea15-6287-4d97-8ecd-c5afa2d137ea/image.png',
    date: '2025-01-01'
  },
  {
    title: 'English for IT 2',
    issuer: 'Cisco Networking Academy',
    description: 'Advanced course focusing on technical presentations, software specifications, and customer-facing interactions in English.',
    image: 'https://images.credly.com/images/ca317486-3494-488b-b2a7-b49270d98f21/image.png',
    date: '2025-01-01'
  }
];

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);
  const [badges, setBadges] = useState<Badge[]>(fallbackBadges);
  const [activeTab, setActiveTab] = useState<'certificates' | 'badges'>('certificates');

  const totalHours = courses.reduce((acc, course) => {
    const hours = parseInt(course.duration);
    return isNaN(hours) ? acc : acc + hours;
  }, 0);

  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<'certificates' | 'badges'>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('change-courses-tab', handleTabChange);
    return () => window.removeEventListener('change-courses-tab', handleTabChange);
  }, []);

  useEffect(() => {
    // Fetch courses
    api.get('/courses')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((c: any) => ({
            ...c,
            skills: Array.isArray(c.skills) ? c.skills : (c.skills ? c.skills.split(',') : []),
            image: c.image || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'
          }));
          setCourses(mapped);
        }
      })
      .catch(err => {
        console.log('Failed to fetch courses, using fallback data.', err);
      });

    // Fetch badges
    api.get('/badges')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setBadges(res.data);
        }
      })
      .catch(err => {
        console.log('Failed to fetch badges, using fallback data.', err);
      });
  }, []);

  const handleViewDocument = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    } else {
      alert('Document not uploaded yet.');
    }
  };

  return (
    <section id="courses-section" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 animate-fade-in"
      >
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Learning & <span className="text-blue-400">Certifications</span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-400 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-400 font-light mb-4">Continuous professional development, verified courses, and technical honors.</p>
        <div className="inline-flex items-center gap-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:scale-105 transition-transform duration-300">
          <span>⏱️</span>
          <span>Total Training Hours: <span className="text-white font-extrabold">{totalHours} Hours</span></span>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-16">
        <div className="bg-[#0B1E3A]/60 backdrop-blur p-1.5 rounded-full border border-white/10 flex gap-2 shadow-inner">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Certificates ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Badges & Honors ({badges.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'certificates' ? (
          <motion.div
            key="certificates-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.map((course, idx) => (
              <motion.div
                key={course._id || idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="glass-panel overflow-hidden group flex flex-col rounded-2xl border border-white/5 bg-[#0B1E3A]/40 backdrop-blur-sm"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-gray-950/80 backdrop-blur text-gold text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                    {course.duration}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-gray-400 mb-4 flex-1 text-sm leading-relaxed line-clamp-3">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.skills.map((skill, i) => (
                      <span key={i} className="text-xs text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/10">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleViewDocument(course.certificateUrl)}
                    className="w-full bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 py-2.5 rounded-xl transition-all duration-300 font-bold active:scale-95 text-sm cursor-pointer"
                  >
                    View Certificate
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="badges-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {badges.map((badge, idx) => (
              <motion.div
                key={badge._id || idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="glass-panel overflow-hidden group flex flex-col items-center p-8 text-center rounded-2xl border border-white/5 bg-[#0B1E3A]/40 backdrop-blur-sm"
              >
                <div className="w-32 h-32 relative mb-6 rounded-full overflow-hidden border-2 border-gold/30 bg-gray-900/50 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.1)] group-hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] transition-all duration-500">
                  <img 
                    src={badge.image} 
                    alt={badge.title} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{badge.title}</h3>
                <span className="text-xs text-gold font-semibold uppercase tracking-wider mb-4 bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                  {badge.issuer}
                </span>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {badge.description}
                </p>
                {badge.date && (
                  <span className="text-xs text-gray-500 mt-auto">
                    Issued: {new Date(badge.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Courses;
