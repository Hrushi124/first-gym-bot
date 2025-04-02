import React, { useState, useEffect, useRef, memo } from "react";
import {
  Menu,
  X,
  Home,
  Dumbbell,
  Utensils,
  BarChart2,
  User,
} from "lucide-react";
import Motion from "./Motion";
import Tab from "./Tab";
import MobileNavMenu from "./MobileNavMenu";

const Navbar = ({ activePage = "Home", onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pages = ["Home", "Workout", "Diet", "Analytics", "Profile"];
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef(null);
  const tabRefs = useRef(pages.map(() => React.createRef()));

  const icons = {
    Home: <Home size={18} />,
    Workout: <Dumbbell size={18} />,
    Diet: <Utensils size={18} />,
    Analytics: <BarChart2 size={18} />,
    Profile: <User size={18} />,
  };

  useEffect(() => {
    setIsMounted(true);

    // More efficient resize handler
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };

    checkMobile();

    const resizeHandler = () => {
      requestAnimationFrame(checkMobile);
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    if (!isMobile) return; // Only add event listener if mobile

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const handlePageChange = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 mx-auto my-4 px-4 max-w-7xl z-30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="ml-3 font-bold text-indigo-900 text-lg hidden md:block">
              FitAI
            </span>
          </div>

          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-white text-indigo-800 shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 z-20"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          {!isMobile && (
            <div className="flex justify-center flex-1">
              <ul className="relative flex flex-row w-fit p-1 rounded-full bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 shadow-[0_4px_12px_-5px_rgba(80,50,180,0.3)]">
                {pages.map((page, index) => (
                  <Tab
                    key={page}
                    innerRef={tabRefs.current[index]}
                    active={page === activePage}
                    onClick={() => handlePageChange(page)}
                    icon={icons[page]}
                  >
                    {page}
                  </Tab>
                ))}
                {isMounted && (
                  <Motion
                    initial={false} // Remove initial animation to improve performance
                    animate={{
                      left:
                        tabRefs.current[pages.indexOf(activePage)]?.current
                          ?.offsetLeft || 0,
                      width:
                        tabRefs.current[pages.indexOf(activePage)]?.current
                          ?.offsetWidth || 0,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute z-0 h-8 rounded-full bg-white/90 shadow-[0_2px_8px_0px_rgba(99,102,241,0.25)]"
                  />
                )}
              </ul>
            </div>
          )}

          <div className="w-10 md:flex items-center justify-end">
            {!isMobile && (
              <button className="px-4 py-1.5 bg-white text-indigo-800 rounded-full shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 text-sm font-medium">
                Login
              </button>
            )}
          </div>
        </div>

        {isMobile && isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 rounded-2xl shadow-lg border border-white/30 backdrop-blur-md transition-all duration-300 opacity-100 visible">
            <ul className="flex flex-col w-full p-4">
              {pages.map((page) => (
                <li key={page} className="py-1">
                  <button
                    onClick={() => {
                      handlePageChange(page);
                      setIsOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                      activePage === page
                        ? "bg-white text-indigo-900 shadow-md"
                        : "text-indigo-700 hover:bg-white/50"
                    }`}
                  >
                    <span className="mr-3">{icons[page]}</span>
                    <span className="font-medium">{page}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {isMobile && !isOpen && (
        <MobileNavMenu
          pages={pages}
          activePage={activePage}
          setActivePage={handlePageChange}
          setIsOpen={setIsOpen}
          icons={icons}
        />
      )}
    </>
  );
};

export default memo(Navbar);
