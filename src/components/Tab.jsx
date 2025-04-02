import React from "react";

const Tab = ({ children, active, onClick, innerRef, icon }) => {
  return (
    <li ref={innerRef} className="relative z-10 flex-shrink-0">
      <button
        onClick={onClick}
        className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 whitespace-nowrap flex items-center gap-2 ${
          active ? "text-indigo-950" : "text-indigo-700"
        }`}
      >
        {icon && <span className="hidden md:inline-block">{icon}</span>}
        {children}
      </button>
    </li>
  );
};

export default Tab;
