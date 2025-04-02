import React, { memo } from "react";
import { Home, Dumbbell, Utensils, BarChart2, User } from "lucide-react";

const MobileNavMenu = ({ pages, activePage, setActivePage, setIsOpen }) => {
  const icons = {
    Home: <Home size={18} />,
    Workout: <Dumbbell size={18} />,
    Diet: <Utensils size={18} />,
    Analytics: <BarChart2 size={18} />,
    Profile: <User size={18} />,
  };

  const handlePageChange = (page) => {
    if (setActivePage) {
      setActivePage(page);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-100/95 to-indigo-100/80 backdrop-blur-md border-t border-indigo-200 shadow-[0_-2px_10px_rgba(99,102,241,0.15)] z-40">
      <ul className="flex justify-around items-center py-2">
        {pages.map((page) => (
          <li key={page} className="relative">
            <button
              onClick={() => handlePageChange(page)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ${
                activePage === page
                  ? "bg-white text-indigo-900 shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                  : "text-indigo-700"
              }`}
            >
              {icons ? icons[page] : null}
              <span className="text-xs mt-1 font-medium">{page}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(MobileNavMenu);
