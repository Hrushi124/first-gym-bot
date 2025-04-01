import React, { useState, useRef, useEffect } from "react";
import "./animations.css";
import {
  Menu,
  X,
  Dumbbell,
  Utensils,
  BarChart2,
  User,
  Home,
} from "lucide-react";

// Motion component for animated elements
const Motion = ({ children, initial, animate, transition, className }) => {
  const [style, setStyle] = useState(initial);

  useEffect(() => {
    setStyle(animate);
  }, [animate]);

  return (
    <li
      style={{
        ...style,
        transition: `left ${
          transition.type === "spring" ? "0.3s" : "0s"
        } ease-out, width ${
          transition.type === "spring" ? "0.3s" : "0s"
        } ease-out`,
        position: "absolute",
      }}
      className={className}
    >
      {children}
    </li>
  );
};

// Tab component for navigation items
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

// MobileNavMenu component for bottom tab navigation on mobile
const MobileNavMenu = ({ pages, activePage, setActivePage, setIsOpen }) => {
  const icons = {
    Home: <Home size={18} />,
    Workout: <Dumbbell size={18} />,
    Diet: <Utensils size={18} />,
    Analytics: <BarChart2 size={18} />,
    Profile: <User size={18} />,
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-100/95 to-indigo-100/80 backdrop-blur-md border-t border-indigo-200 shadow-[0_-2px_10px_rgba(99,102,241,0.15)] z-40">
      <ul className="flex justify-around items-center py-2">
        {pages.map((page) => (
          <li key={page} className="relative">
            <button
              onClick={() => {
                setActivePage(page);
                setIsOpen(false);
              }}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ${
                activePage === page
                  ? "bg-white text-indigo-900 shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                  : "text-indigo-700"
              }`}
            >
              {icons[page]}
              <span className="text-xs mt-1 font-medium">{page}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Enhanced Navbar component with improved mobile experience
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pages = ["Home", "Workout", "Diet", "Analytics", "Profile"];
  const [activePage, setActivePage] = useState("Home");
  const tabRefs = useRef(pages.map(() => useRef()));
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef(null);

  const icons = {
    Home: <Home size={18} />,
    Workout: <Dumbbell size={18} />,
    Diet: <Utensils size={18} />,
    Analytics: <BarChart2 size={18} />,
    Profile: <User size={18} />,
  };

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        isMobile
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 mx-auto my-4 px-4 max-w-7xl z-30"
      >
        <div className="flex items-center justify-between">
          {/* Logo area - visible on both mobile and desktop */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="ml-3 font-bold text-indigo-900 text-lg hidden md:block">
              FitAI
            </span>
          </div>

          {/* Mobile menu toggle */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-white text-indigo-800 shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 z-20"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          {/* Desktop horizontal menu */}
          {!isMobile && (
            <div className="flex justify-center flex-1">
              <ul className="relative flex flex-row w-fit p-1 rounded-full bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 shadow-[0_4px_12px_-5px_rgba(80,50,180,0.3)]">
                {pages.map((page, index) => (
                  <Tab
                    key={page}
                    innerRef={tabRefs.current[index]}
                    active={page === activePage}
                    onClick={() => {
                      setActivePage(page);
                    }}
                    icon={icons[page]}
                  >
                    {page}
                  </Tab>
                ))}
                {isMounted && (
                  <Motion
                    initial={{
                      left:
                        tabRefs.current[pages.indexOf("Home")]?.current
                          ?.offsetLeft || 0,
                      width:
                        tabRefs.current[pages.indexOf("Home")]?.current
                          ?.offsetWidth || 0,
                    }}
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

          {/* Right side empty space or action button */}
          <div className="w-10 md:flex items-center justify-end">
            {!isMobile && (
              <button className="px-4 py-1.5 bg-white text-indigo-800 rounded-full shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 text-sm font-medium">
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobile && isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 rounded-2xl shadow-lg border border-white/30 backdrop-blur-md transition-all duration-300 opacity-100 visible">
            <ul className="flex flex-col w-full p-4">
              {pages.map((page) => (
                <li key={page} className="py-1">
                  <button
                    onClick={() => {
                      setActivePage(page);
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

      {/* Bottom mobile tab bar - alternative to dropdown */}
      {isMobile && !isOpen && (
        <MobileNavMenu
          pages={pages}
          activePage={activePage}
          setActivePage={setActivePage}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
};

// Main application component
const AIWorkoutDietPlatform = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Enhanced Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 via-purple-200 to-indigo-200 z-0 overflow-hidden">
        {/* Background decorative elements could go here */}
      </div>

      {/* Scrollable Content */}
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <div
          className={`flex items-center justify-center flex-grow p-4 overflow-y-auto mt-20 ${
            isMobile ? "pb-20" : ""
          }`}
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-100/80 via-purple-100/80 to-violet-200/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_-4px_rgba(80,50,180,0.3)] scale-in">
            {/* Main Content */}
            <div className="relative p-8 flex flex-col gap-8 z-10">
              {/* Layout with modifications for mobile */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left Side - Branding - push AI icon to top */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex flex-col mb-4 mt-[-20px]">
                    <h1 className="text-8xl font-bold text-indigo-900 mb-2 blur-in">
                      AI
                    </h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100/80 shadow-sm hover-scale float-1"></div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200/80 shadow-sm hover-scale float-2"></div>
                    <div className="w-2 h-8 rounded-full bg-indigo-100 shimmer"></div>
                  </div>
                </div>

                {/* Right Side - Main Content - centered text with margin */}
                <div className="flex flex-col items-center text-center mx-auto">
                  {/* Main Heading */}
                  <div className="mb-8 mx-4">
                    <h2 className="text-5xl font-bold text-indigo-950 mb-2 tracking-tight blur-in">
                      AI-powered
                    </h2>
                    <h3 className="text-5xl font-bold text-indigo-950 mb-2 tracking-tight blur-in">
                      Workout and Diet
                    </h3>
                    <h3 className="text-5xl font-bold text-indigo-950 mb-4 tracking-tight blur-in">
                      Chat Platform
                    </h3>
                    <p className="text-indigo-800/70 text-lg scale-in">
                      Personalized training recommendations
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-12 flex justify-center">
                    <button className="px-8 py-3.5 bg-white text-indigo-800 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-lg blur-in">
                      <span>Generate AI</span>
                      <span className="font-light text-gray-400">|</span>
                      <span>Federate AI</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-start w-full">
                {/* Workout Card */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 backdrop-blur-lg rounded-xl p-6 border border-indigo-300/30 shadow-[0_8px_32px_rgba(80,50,180,0.2)] transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-[0_15px_30px_rgba(80,50,180,0.3)]">
                  <div className="flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-b from-indigo-200 to-indigo-100 rounded-full shadow-md mb-4">
                      <Dumbbell className="w-10 h-10 text-indigo-800" />
                    </div>
                    <h4 className="text-lg font-bold text-indigo-950 mb-2">
                      Workout
                    </h4>
                    <div className="w-16 h-px bg-indigo-200 mb-4"></div>
                    <p className="text-xs text-indigo-800/60 mb-4 text-center">
                      Customized exercise plans
                    </p>
                    <div className="bg-white/80 p-3 rounded-lg shadow-md text-indigo-900 text-xs text-center mb-4 w-full">
                      <ul className="list-disc px-4 text-left">
                        <li className="mb-1">Push-ups</li>
                        <li className="mb-1">Squats</li>
                        <li className="mb-1">Lunges</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/90 transition-all duration-300 z-0"></div>
                </div>

                {/* Diet Card */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 backdrop-blur-lg rounded-xl p-6 border border-indigo-300/30 shadow-[0_8px_32px_rgba(80,50,180,0.2)] transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-[0_15px_30px_rgba(80,50,180,0.3)]">
                  <div className="flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-b from-indigo-200 to-indigo-100 rounded-full shadow-md mb-4">
                      <Utensils className="w-10 h-10 text-indigo-800" />
                    </div>
                    <h4 className="text-lg font-bold text-indigo-950 mb-2">
                      Diet
                    </h4>
                    <div className="w-16 h-px bg-indigo-200 mb-4"></div>
                    <p className="text-xs text-indigo-800/60 mb-4 text-center">
                      Personalized nutrition guidance
                    </p>
                    <div className="bg-white/80 p-3 rounded-lg shadow-md text-indigo-900 text-xs text-center mb-4 w-full">
                      <ul className="list-disc px-4 text-left">
                        <li className="mb-1">Eat more vegetables</li>
                        <li className="mb-1">Stay hydrated</li>
                        <li className="mb-1">Balance macros</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/90 transition-all duration-300 z-0"></div>
                </div>

                {/* Analytics Card */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 backdrop-blur-lg rounded-xl p-6 border border-indigo-300/30 shadow-[0_8px_32px_rgba(80,50,180,0.2)] transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-[0_15px_30px_rgba(80,50,180,0.3)]">
                  <div className="flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-b from-indigo-200 to-indigo-100 rounded-full shadow-md mb-4">
                      <BarChart2 className="w-10 h-10 text-indigo-800" />
                    </div>
                    <h4 className="text-lg font-bold text-indigo-950 mb-2">
                      Analytics
                    </h4>
                    <div className="w-16 h-px bg-indigo-200 mb-4"></div>
                    <p className="text-xs text-indigo-800/60 mb-4 text-center">
                      Track your progress and stats
                    </p>
                    <div className="bg-white/80 p-3 rounded-lg shadow-md text-indigo-900 text-xs text-center mb-4 w-full">
                      <ul className="list-disc px-4 text-left">
                        <li className="mb-1">Daily progress charts</li>
                        <li className="mb-1">Weekly statistics</li>
                        <li className="mb-1">Goal tracking</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/90 transition-all duration-300 z-0"></div>
                </div>

                {/* Profile Card */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-blue-100/90 via-purple-100/90 to-violet-200/90 backdrop-blur-lg rounded-xl p-6 border border-indigo-300/30 shadow-[0_8px_32px_rgba(80,50,180,0.2)] transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-[0_15px_30px_rgba(80,50,180,0.3)]">
                  <div className="flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-b from-indigo-200 to-indigo-100 rounded-full shadow-md mb-4">
                      <User className="w-10 h-10 text-indigo-800" />
                    </div>
                    <h4 className="text-lg font-bold text-indigo-950 mb-2">
                      Profile
                    </h4>
                    <div className="w-16 h-px bg-indigo-200 mb-4"></div>
                    <p className="text-xs text-indigo-800/60 mb-4 text-center">
                      Manage your account and settings
                    </p>
                    <div className="bg-white/80 p-3 rounded-lg shadow-md text-indigo-900 text-xs text-center mb-4 w-full">
                      <ul className="list-disc px-4 text-left">
                        <li className="mb-1">Update personal info</li>
                        <li className="mb-1">Set fitness goals</li>
                        <li className="mb-1">Adjust preferences</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/90 transition-all duration-300 z-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWorkoutDietPlatform;
