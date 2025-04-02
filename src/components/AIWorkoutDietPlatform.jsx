import React, { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./Navbar";
import FeatureCard from "./FeatureCard";
import { Dumbbell, Utensils, BarChart2, User, RefreshCw } from "lucide-react";

// Lazy load components to reduce initial bundle size
const WorkoutSection = lazy(() => import("./WorkoutSection"));
const GenerateFederateUI = lazy(() => import("./GenerateFederateUI"));

// Loading component to reuse
const Loading = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-200 to-indigo-200 z-50">
    <div className="flex flex-col items-center">
      <RefreshCw className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
      <p className="text-indigo-800 text-xl">Loading...</p>
    </div>
  </div>
);

const AIWorkoutDietPlatform = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showGenerateUI, setShowGenerateUI] = useState(false);
  const [activePage, setActivePage] = useState("Home");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const resizeHandler = () => {
      requestAnimationFrame(checkMobile);
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const features = [
    {
      icon: <Dumbbell className="w-10 h-10 text-indigo-800" />,
      title: "Workout",
      description: "Customized exercise plans",
      listItems: ["Push-ups", "Squats", "Lunges"],
    },
    {
      icon: <Utensils className="w-10 h-10 text-indigo-800" />,
      title: "Diet",
      description: "Personalized nutrition guidance",
      listItems: ["Eat more vegetables", "Stay hydrated", "Balance macros"],
    },
    {
      icon: <BarChart2 className="w-10 h-10 text-indigo-800" />,
      title: "Analytics",
      description: "Track your progress and stats",
      listItems: [
        "Daily progress charts",
        "Weekly statistics",
        "Goal tracking",
      ],
    },
    {
      icon: <User className="w-10 h-10 text-indigo-800" />,
      title: "Profile",
      description: "Manage your account and settings",
      listItems: [
        "Update personal info",
        "Set fitness goals",
        "Adjust preferences",
      ],
    },
  ];

  if (showGenerateUI) {
    return (
      <Suspense fallback={<Loading />}>
        <GenerateFederateUI onBack={() => setShowGenerateUI(false)} />
      </Suspense>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 via-purple-200 to-indigo-200 z-0 overflow-hidden"></div>
      <div className="relative flex flex-col min-h-screen">
        <Navbar activePage={activePage} onNavigate={setActivePage} />

        {activePage === "Workout" ? (
          <Suspense fallback={<Loading />}>
            <div className="mt-20">
              <WorkoutSection onBack={() => setActivePage("Home")} />
            </div>
          </Suspense>
        ) : (
          activePage === "Home" && (
            <div
              className={`flex items-center justify-center flex-grow p-4 overflow-y-auto mt-20 ${
                isMobile ? "pb-20" : ""
              }`}
            >
              <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-100/80 via-purple-100/80 to-violet-200/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_-4px_rgba(80,50,180,0.3)]">
                <div className="relative p-8 flex flex-col gap-8 z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="flex flex-col mb-4 mt-[-20px]">
                        <h1 className="text-8xl font-bold text-indigo-900 mb-2">
                          AI
                        </h1>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100/80 shadow-sm"></div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200/80 shadow-sm"></div>
                        <div className="w-2 h-8 rounded-full bg-indigo-100"></div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center mx-auto">
                      <div className="mb-8 mx-4">
                        <h2 className="text-5xl font-bold text-indigo-950 mb-2 tracking-tight">
                          AI-powered
                        </h2>
                        <h3 className="text-5xl font-bold text-indigo-950 mb-2 tracking-tight">
                          Workout and Diet
                        </h3>
                        <h3 className="text-5xl font-bold text-indigo-950 mb-4 tracking-tight">
                          Chat Platform
                        </h3>
                        <p className="text-indigo-800/70 text-lg">
                          Personalized training recommendations
                        </p>
                      </div>
                      <div className="mb-12 flex justify-center">
                        <button
                          className="px-8 py-3.5 bg-white text-indigo-800 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-lg"
                          onClick={() => setShowGenerateUI(true)}
                        >
                          <span>Generate AI</span>
                          <span className="font-light text-gray-400">|</span>
                          <span>Federate AI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-start w-full">
                    {features.map((feature, index) => (
                      <FeatureCard
                        key={index}
                        {...feature}
                        onClick={() => {
                          if (feature.title === "Workout") {
                            setActivePage("Workout");
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AIWorkoutDietPlatform;
