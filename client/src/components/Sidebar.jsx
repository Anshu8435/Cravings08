import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SiCaterpillar } from "react-icons/si"; // Just a placeholder luxury icon, but let's use a generic elegant shape if possible. Let's just use standard HTML/CSS shapes.

const Sidebar = ({ activeTab, setActiveTab, mainTabs, settingsTab, title = "Cravings", subtitle = "Dashboard", dropdownOptions, selectedDropdownValue, onDropdownChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderTab = (tab) => {
    const isActive = activeTab === tab.value;
    
    return (
      <li
        key={tab.value}
        className={`group relative cursor-pointer flex items-center transition-all duration-500 ease-out ${
          isCollapsed ? "justify-center p-3 w-12 h-12" : "px-4 py-3 w-full gap-4"
        } rounded-sm ${
          isActive
            ? "bg-(--color-primary) text-(--color-primary-content) shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)] ring-1 ring-white/20"
            : "text-(--color-neutral) hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-inner"
        } my-1`}
        onClick={() => setActiveTab(tab.value)}
      >
        {/* Active Indicator Line (Only when expanded for sleekness, or always) */}
        {isActive && !isCollapsed && (
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white/80 rounded-r-full blur-[1px]"></div>
        )}

        <div 
          className={`flex items-center justify-center text-2xl shrink-0 transition-transform duration-500 ${
            isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'
          }`}
        >
          {tab.icon}
        </div>
        
        {!isCollapsed && (
          <span className="font-semibold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300">
            {tab.name}
          </span>
        )}

        {/* Glassmorphic Tooltip */}
        {isCollapsed && (
          <div className="absolute left-full ml-6 px-4 py-2 bg-gray-900/90 backdrop-blur-md text-white text-sm font-medium tracking-wide rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] border border-white/10 scale-95 group-hover:scale-100 origin-left">
            {tab.name}
          </div>
        )}
      </li>
    );
  };

  return (
    <div
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={`relative h-full flex-col bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 dark:border-white/10 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex ${
        isCollapsed ? "w-24 items-center py-8" : "w-72 p-6 z-50 absolute md:relative md:z-auto"
      }`}
    >
      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-(--color-primary) rounded-b-full opacity-50"></div>

      {/* Floating Toggle Button Removed for Hover Behavior */}

      {/* Sidebar Header / Logo Area */}
      <div className={`w-full flex items-center mb-8 ${isCollapsed ? "justify-center" : "px-2"}`}>
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--color-primary) to-orange-400 flex items-center justify-center shadow-lg text-white font-black text-xl shrink-0">
          {title.charAt(0)}
        </div>
        {!isCollapsed && (
          <div className="ml-4 flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-gray-800 to-gray-500 dark:from-white dark:to-gray-300">
              {title}
            </span>
            <span className="text-[10px] font-bold text-(--color-primary) uppercase tracking-widest">
              {subtitle}
            </span>
          </div>
        )}
      </div>

      {dropdownOptions && dropdownOptions.length > 0 && (
        <div className={`mb-6 px-4 ${isCollapsed ? "hidden" : "block"}`}>
          <select 
            value={selectedDropdownValue} 
            onChange={(e) => onDropdownChange(e.target.value)}
            className="w-full bg-white/60 dark:bg-black/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
          >
            {dropdownOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tabs Container */}
      <div className="flex-1 w-full mt-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <ul className={`flex flex-col gap-3 ${isCollapsed ? "items-center" : ""}`}>
          {mainTabs.map(renderTab)}
        </ul>
      </div>
      
      {/* Settings Tab */}
      {settingsTab && (
        <div className={`w-full relative mt-6 pt-6 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          {/* Subtle separator */}
          <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-50"></div>
          <ul className="flex flex-col gap-3">
            {renderTab(settingsTab)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
