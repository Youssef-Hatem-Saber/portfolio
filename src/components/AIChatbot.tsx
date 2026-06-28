import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot'|'user', text: string}[]>([
    { role: 'bot', text: 'Hi! I am the AI Assistant for Eng. Youssef. How can I help you? Try asking: "Show GPA", "Contact details", "List his projects", or "Tell me about his awards".' }
  ]);
  const [input, setInput] = useState('');

  // Live Database States
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [dbExperiences, setDbExperiences] = useState<any[]>([]);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [dbCompetitions, setDbCompetitions] = useState<any[]>([]);
  const [dbLetters, setDbLetters] = useState<any[]>([]);

  // Fetch live portfolio data on mount
  useEffect(() => {
    // Projects
    api.get('/projects')
      .then(res => setDbProjects(res.data || []))
      .catch(err => console.log('Chatbot failed to fetch projects', err));

    // Experiences
    api.get('/experiences')
      .then(res => setDbExperiences(res.data || []))
      .catch(err => console.log('Chatbot failed to fetch experiences', err));

    // Courses
    api.get('/courses')
      .then(res => setDbCourses(res.data || []))
      .catch(err => console.log('Chatbot failed to fetch courses', err));

    // Competitions
    api.get('/competitions')
      .then(res => setDbCompetitions(res.data || []))
      .catch(err => console.log('Chatbot failed to fetch competitions', err));

    // Recommendation Letters
    api.get('/recommendationletters')
      .then(res => setDbLetters(res.data || []))
      .catch(err => console.log('Chatbot failed to fetch letters', err));
  }, []);

  const formatMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      const parts = line.split('**');
      const parsedLine = parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="text-blue-300 font-bold">{part}</strong>;
        }
        return part;
      });
      return (
        <React.Fragment key={lineIdx}>
          {parsedLine}
          {lineIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');

    // RAG-like intent classification and dynamic content formulation
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botResponse = "";

      // 1. Specific project detail request
      const matchedProject = dbProjects.find(proj => {
        const titleLower = proj.title.toLowerCase();
        return (lower.includes(titleLower) || 
                (titleLower.includes('road') && lower.includes('road')) ||
                (titleLower.includes('eye') && lower.includes('eye')) ||
                (titleLower.includes('motonix') && lower.includes('motonix')) ||
                (titleLower.includes('tabea') && lower.includes('tabea')) ||
                (titleLower.includes('diagnosis') && lower.includes('diagnosis')) ||
                (titleLower.includes('siren') && lower.includes('siren')) ||
                (titleLower.includes('hygiene') && lower.includes('green minds')) ||
                (titleLower.includes('zzz') && lower.includes('zzz')));
      });

      if (matchedProject) {
        const techs = Array.isArray(matchedProject.technologies) 
          ? matchedProject.technologies.join(', ') 
          : matchedProject.technologies;
        botResponse = `Youssef developed **${matchedProject.title}**. Here is a detailed summary:\n\n` +
                      `📝 *Overview*: ${matchedProject.description}\n\n` +
                      `⚙️ *Technologies*: ${techs || 'N/A'}\n\n` +
                      (matchedProject.githubUrl && matchedProject.githubUrl !== '#' ? `💻 *GitHub*: ${matchedProject.githubUrl}\n` : '') +
                      "You can click on this project card in the **Projects** section to read the full case study and view screenshots!";
      }
      // 2. General projects list request
      else if (lower.includes('project') || lower.includes('work') || lower.includes('portfolio') || lower.includes('built') || lower.includes('developed') || lower.includes('مشاريع') || lower.includes('مشروع')) {
        if (dbProjects.length > 0) {
          const list = dbProjects.map((p) => `🚗 **${p.title}** - ${p.description}`).slice(0, 5).join('\n\n');
          botResponse = `Youssef Hatem has built several high-impact software and IoT solutions. Here are some of them:\n\n${list}\n\nWould you like to know more about a specific project? Just type its name!`;
        } else {
          botResponse = "Youssef has developed multiple systems including a Smart Road Flow Controller, Eye Cam gaze accessibility app, and Tabea utilities tracker. Scroll to the **Projects** section to see them!";
        }
      }
      // 3. GPA & Education
      else if (lower.includes('gpa') || lower.includes('grade') || lower.includes('score') || lower.includes('marks') || lower.includes('school') || lower.includes('study') || lower.includes('nuclear') || lower.includes('درجة') || lower.includes('معدل') || lower.includes('تعليم') || lower.includes('مدرسة') || lower.includes('الضبعة')) {
        botResponse = "Eng. Youssef Hatem has a stellar academic record. He scored a perfect **GPA of 4.0/4.0** at the Advanced Technical School for Applied Technology and Nuclear Energy in El-Dabaa. He bridges core nuclear engineering concepts with advanced computer science and software development.";
      }
      // 4. Recommendation Letters
      else if (lower.includes('recommendation') || lower.includes('letter') || lower.includes('teacher') || lower.includes('manager') || lower.includes('endorse') || lower.includes('توصية') || lower.includes('خطاب')) {
        if (dbLetters.length > 0) {
          const list = dbLetters.map(l => `• **${l.title}** (${l.category})`).join('\n');
          botResponse = `Youssef is highly recommended by academic instructors and managers. He has official recommendation letters from:\n\n${list}\n\nYou can click on any letter in the **Letters** section to read their full statements (Mahmoud Ragab's Russian teacher letter displays English and Russian side-by-side!).`;
        } else {
          botResponse = "Youssef has received official letters of recommendation from his school managers and Russian language instructor, highlighting his work ethic, leadership, and technical coaching capability.";
        }
      }
      // 5. Awards / Medals
      else if (lower.includes('award') || lower.includes('medal') || lower.includes('worldskills') || lower.includes('competition') || lower.includes('win') || lower.includes('egypt') || lower.includes('جمهورية') || lower.includes('ميدالية') || lower.includes('مسابقة')) {
        if (dbCompetitions.length > 0) {
          const list = dbCompetitions.map(c => `🥇 **${c.name}** - ${c.award || 'Winner'} (${c.description})`).slice(0, 4).join('\n\n');
          botResponse = `Youssef is an award-winning developer. Here are his top titles:\n\n${list}\n\nScroll to the **Awards & Medals** section to view certificates and photos of Youssef holding these republican medals!`;
        } else {
          botResponse = "Youssef won **First Place in Egypt in Software Development** at the **International Skills Competition (WorldSkills Egypt)**, along with first place in the CCSTN Cisco security competition.";
        }
      }
      // 6. Experience & Training
      else if (lower.includes('experience') || lower.includes('job') || lower.includes('role') || lower.includes('company') || lower.includes('work history') || lower.includes('trainer') || lower.includes('mentoring') || lower.includes('تدريب') || lower.includes('خبرة') || lower.includes('توظيف')) {
        if (dbExperiences.length > 0) {
          const list = dbExperiences.map(e => `💼 **${e.title}** at *${e.company || 'Freelance'}*\n   ${e.description}`).slice(0, 4).join('\n\n');
          botResponse = `Here is Youssef's professional experience:\n\n${list}\n\nHe is also an **International Programming Trainer**, instructing competitive programming, data structures, and algorithms to students globally.`;
        } else {
          botResponse = "Youssef Hatem is an International Programming Trainer and Software Developer. He has coached dozens of students in competitive programming and builds commercial Flutter, Supabase, and React applications.";
        }
      }
      // 7. Courses / Certificates
      else if (lower.includes('course') || lower.includes('certificat') || lower.includes('study') || lower.includes('شهادة') || lower.includes('كورسات')) {
        if (dbCourses.length > 0) {
          const list = dbCourses.map(c => `📜 **${c.title}** (${c.duration || 'Certified'})`).slice(0, 6).join('\n');
          botResponse = `Youssef has completed several professional courses:\n\n${list}\n\nScroll to the **Courses** section to inspect certificate validation links!`;
        } else {
          botResponse = "Youssef holds certifications in software engineering, competitive programming, and Cisco networking (CCSTN). Check out the **Courses** section for direct credentials.";
        }
      }
      // 8. Skills & Stack
      else if (lower.includes('skill') || lower.includes('tech') || lower.includes('language') || lower.includes('react') || lower.includes('flutter') || lower.includes('python') || lower.includes('c++') || lower.includes('node') || lower.includes('مهارات') || lower.includes('لغات')) {
        botResponse = "Youssef's technical skills include:\n\n" +
                      "💻 **Languages & Frameworks**: Flutter (Dart), React.js (TypeScript), Node.js, Python (OpenCV/TensorFlow), C++, and Java/Kotlin.\n" +
                      "🗄️ **Databases**: Supabase, MongoDB, Firebase, and relational database architecture.\n" +
                      "💼 **Business**: Sales Negotiation, Meta/Google/LinkedIn Paid Ads, content strategy, and client acquisition.";
      }
      // 9. Contact / Hire
      else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('whatsapp') || lower.includes('reach') || lower.includes('hire') || lower.includes('تواصل') || lower.includes('رقم') || lower.includes('ايميل')) {
        botResponse = "You can contact Youssef directly:\n\n" +
                      "📧 **Email**: youssef@youssefhatem.com\n" +
                      "📞 **Phone/WhatsApp**: +201553514081\n" +
                      "💻 **GitHub**: https://github.com/Youssef-Hatem-Saber\n\n" +
                      "Feel free to submit a message using the **Contact Form** at the bottom of this page. He will reply to you immediately!";
      }
      // 10. CV
      else if (lower.includes('cv') || lower.includes('resume') || lower.includes('سيرة') || lower.includes('ذاتية')) {
        botResponse = "You can download Youssef Hatem's complete CV by clicking the **Download CV** button in the main Hero section at the top of the page!";
      }
      // 11. Greetings
      else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('أهلاً') || lower.includes('مرحبا') || lower.includes('سلام')) {
        botResponse = "Hello! I am Youssef Hatem's AI assistant. I have live access to his portfolio records.\n\n" +
                      "Feel free to ask me anything about his:\n" +
                      "• 🎓 GPA & Nuclear Education\n" +
                      "• 🚗 Projects (Smart Road, Eye Cam, etc.)\n" +
                      "• 🏆 Awards & Medals (WorldSkills Egypt)\n" +
                      "• 💼 Experience & Courses\n" +
                      "• 📞 Contact details\n\n" +
                      "What would you like to know?";
      }
      // 12. Fallback
      else {
        botResponse = "Youssef Hatem is a Nuclear Engineering Student, Software Developer, and International Programming Trainer with a 4.0/4.0 GPA. He won 1st Place in Egypt in Software Development at WorldSkills Egypt.\n\n" +
                      "For specific questions or opportunities, you can email Youssef directly at **youssef@youssefhatem.com** or send a message using the **Contact Form** at the bottom of this page!";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:bg-blue-500 transition-colors z-40 ${isOpen ? 'hidden' : 'block'}`}
      >
        <span className="text-2xl text-white">💬</span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: '500px', height: '80vh' }}
          >
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <div className="font-bold flex items-center gap-2">
                <span className="text-xl">🤖</span> AI Assistant
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                ✕
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-950">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
                    {formatMessageText(msg.text)}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask something about Youssef..."
                className="flex-1 bg-gray-800 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded text-sm font-medium">
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;

