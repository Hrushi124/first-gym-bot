import React from "react";

const FeatureCard = ({ icon, title, description, listItems, onClick }) => {
  return (
    <div
      className="relative group overflow-hidden bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 backdrop-blur-lg rounded-xl p-6 border border-indigo-300/30 shadow-[0_8px_32px_rgba(80,50,180,0.2)] transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-[0_15px_30px_rgba(80,50,180,0.3)] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center relative z-10">
        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-b from-indigo-200 to-indigo-100 rounded-full shadow-md mb-4">
          {icon}
        </div>
        <h4 className="text-lg font-bold text-indigo-950 mb-2">{title}</h4>
        <div className="w-16 h-px bg-indigo-200 mb-4"></div>
        <p className="text-xs text-indigo-800/60 mb-4 text-center">
          {description}
        </p>
        <div className="bg-white/80 p-3 rounded-lg shadow-md text-indigo-900 text-xs text-center mb-4 w-full">
          <ul className="list-disc px-4 text-left">
            {listItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/90 transition-all duration-300 z-0"></div>
    </div>
  );
};

export default FeatureCard;
