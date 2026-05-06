import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark-950 flex font-sans">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] flex flex-col min-w-0">
        <Header />
        
        <main className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <footer className="mt-auto p-8 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">
            VanityCloakSeed &copy; 2026 • Private • Local • Secure
          </p>
        </footer>
      </div>
    </div>
  );
}
