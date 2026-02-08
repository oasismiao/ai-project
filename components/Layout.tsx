
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent-cyan rounded-full organic-blob"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-primary rounded-full organic-blob"></div>
      <div className="fixed top-[20%] right-[10%] w-[300px] h-[300px] bg-accent-pink rounded-full organic-blob"></div>
      <div className="fixed top-1/4 left-10 w-8 h-8 border-2 border-accent-pink rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-1/3 right-12 w-12 h-12 bg-accent-lime rounded-lg rotate-12 opacity-10"></div>
      <div className="fixed top-2/3 left-20 w-16 h-4 bg-accent-cyan rounded-full opacity-10 -rotate-45"></div>

      {/* Abstract Oil Painting Lines */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <path className="oil-stroke" d="M-100,200 C150,100 350,400 600,300 S950,100 1200,250" fill="none" stroke="#5b13ec" strokeWidth="2"></path>
        <path className="oil-stroke" d="M1400,800 C1100,700 800,950 500,850 S100,1000 -100,900" fill="none" stroke="#ff3e8d" strokeWidth="3"></path>
      </svg>

      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
