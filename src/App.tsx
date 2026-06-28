import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import GPA from './components/GPA';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Recommendations from './components/Recommendations';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Courses from './components/Courses';
import Competitions from './components/Competitions';
import AIChatbot from './components/AIChatbot';
import './index.css';

function App() {
  return (
    <div className="bg-primary min-h-screen selection:bg-blue-500/30 text-white relative overflow-hidden">
      {/* Background Decorative Mesh Glows */}
      <div className="absolute top-[10%] left-[-10%] glow-blob bg-blue-600"></div>
      <div className="absolute top-[30%] right-[-10%] glow-blob bg-gold"></div>
      <div className="absolute top-[60%] left-[-5%] glow-blob bg-blue-500"></div>
      <div className="absolute top-[80%] right-[-5%] glow-blob bg-gold"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>

      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <GPA />
        <Courses />
        <Experience />
        <Projects />
        <Recommendations />
        <Competitions />
        <Skills />
        <Contact />
      </main>
      
      <AIChatbot />
      
      <footer className="relative z-10 py-10 text-center text-gray-500 border-t border-white/5 mt-20 bg-[#071426]/50 backdrop-blur-sm">
        <p className="font-medium text-gray-400">© {new Date().getFullYear()} Eng. Youssef Hatem. All rights reserved.</p>
        <p className="text-sm mt-2 text-gray-500">Email: <a href="mailto:youssef@youssefhatem.com" className="hover:text-gold transition-colors">youssef@youssefhatem.com</a> | Phone: 01553514081</p>
      </footer>
    </div>
  );
}

export default App;
