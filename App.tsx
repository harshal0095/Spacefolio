
import React, { useEffect, useRef } from 'react';
import SpaceScene from './components/SpaceScene';
import Navbar from './components/Navbar';
import { CONTENT_SECTIONS } from './constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text parallax
      gsap.to('.hero-title', {
        scrollTrigger: {
          trigger: '.hero-container',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: -200,
        opacity: 0,
        filter: 'blur(10px)',
      });

      gsap.to('.hero-subtitle', {
        scrollTrigger: {
          trigger: '.hero-container',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: -120,
        opacity: 0,
      });

      // Story-style Section animations
      gsap.utils.toArray<HTMLElement>('.content-section').forEach((section) => {
        const elements = section.querySelectorAll('.animate-item');
        
        gsap.fromTo(elements, 
          { 
            y: 60, 
            opacity: 0,
            filter: 'blur(5px)'
          },
          {
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1.2,
              toggleActions: 'play none none reverse',
            },
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.2,
          }
        );

        // Exit animation for "story" feel
        gsap.to(elements, {
          scrollTrigger: {
            trigger: section,
            start: 'bottom 40%',
            end: 'bottom top',
            scrub: true,
          },
          y: -60,
          opacity: 0,
          filter: 'blur(10px)',
          stagger: 0.1,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <SpaceScene />
      <Navbar />

      <main className="relative z-10 overflow-hidden">
        {/* Hero Section */}
        <section className="hero-container h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-5xl">
            <h1 className="hero-title text-5xl md:text-8xl lg:text-9xl font-thin tracking-[0.2em] uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-6">
              Journey <br />
              <span className="font-bold tracking-[0.4em] ml-[0.2em]">Beyond</span>
            </h1>
            <p className="hero-subtitle text-xs md:text-sm tracking-[0.8em] uppercase text-white/50 mb-12">
              Explore the infinite silence of the cosmos
            </p>
            <div className="flex justify-center hero-subtitle">
              <button className="px-10 py-3 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-[0.5em] transition-all duration-500 backdrop-blur-sm group overflow-hidden relative">
                <span className="relative z-10">Initiate Protocol</span>
                <div className="absolute inset-0 w-full h-full bg-blue-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 opacity-30 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.5em]">Scroll</span>
          </div>
        </section>

        {/* Content Sections */}
        {CONTENT_SECTIONS.map((section) => (
          <section 
            key={section.id} 
            id={section.id}
            className="content-section min-h-screen flex items-center px-8 md:px-24 lg:px-48 py-32"
          >
            <div className="max-w-2xl">
              <div className="animate-item w-12 h-px bg-blue-500 mb-8" />
              <h2 className="animate-item text-xs uppercase tracking-[0.6em] text-blue-400 mb-4">
                {section.subtitle}
              </h2>
              <h3 className="animate-item text-3xl md:text-5xl font-thin tracking-widest text-white mb-8 leading-tight">
                {section.title}
              </h3>
              <p className="animate-item text-lg text-white/40 leading-relaxed font-light mb-12">
                {section.body}
              </p>
              <button className="animate-item group text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-blue-400 transition-colors flex items-center space-x-4">
                <span>View Details</span>
                <div className="w-8 h-px bg-white/20 group-hover:bg-blue-400 transition-colors" />
              </button>
            </div>
          </section>
        ))}

        {/* Space Spacer for Planet reveal depth */}
        <section className="h-[200vh] pointer-events-none" />

        {/* Footer */}
        <footer className="py-24 px-8 border-t border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <span className="text-xl font-thin tracking-[0.5em] uppercase">Cosmos</span>
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                © 2024 Planetary Exploration Society
              </p>
            </div>
            
            <div className="flex space-x-12">
              {['Twitter', 'Instagram', 'Discord'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>

      {/* Decorative Overlays */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {/* Grain effect overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </div>
  );
};

export default App;
