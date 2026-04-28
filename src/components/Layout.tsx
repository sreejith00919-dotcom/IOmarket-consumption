import React from 'react';

export const FairgateShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Top Navigation */}
      <nav className="bg-[#2c3e50] h-[48px] flex items-center px-4 shrink-0">
        <div className="flex items-center mr-8">
          <span className="text-white text-lg font-bold">fair</span>
          <span className="text-[#3dbdaf] text-lg font-bold">gate</span>
          <span className="admin-pill">ADMIN-UI</span>
        </div>
        
        <div className="flex h-full">
          {[
            { name: 'Dashboard', active: false },
            { name: 'Clubs', active: false },
            { name: 'Sales/CRM', active: true },
            { name: 'Reports', active: false },
            { name: 'Settings', active: false }
          ].map((item) => (
            <div 
              key={item.name} 
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </nav>

      {/* Breadcrumb Bar */}
      <div className="bg-white h-[34px] flex items-center px-4 border-b border-[#ddd] shrink-0 text-[11px] text-[#888]">
        <span>Home</span>
        <span className="mx-2 font-mono">/</span>
        <span>Sales/CRM</span>
        <span className="mx-2 font-mono">/</span>
        <span className="text-[#333]">eBill and PaperMailing Consumption</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-[16px] max-w-[1400px] w-full mx-auto overflow-y-auto flex flex-col gap-3">
        <h1 className="text-[18px] font-normal text-[#333] mb-1">eBill & PaperMailing Consumption</h1>
        {children}
      </main>
    </div>
  );
};
