import React, { useState, useEffect, memo } from "react";
import {
  Dumbbell,
  Utensils,
  BarChart2,
  User,
  ArrowLeft,
  RefreshCw,
  Save,
  Share2,
} from "lucide-react";

const GenerateFederateUI = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("generate");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const resizeHandler = () => requestAnimationFrame(checkMobile);
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setGeneratedContent(null);

    // Simulate API call with timeout
    setTimeout(() => {
      setGenerating(false);
      setGeneratedContent({
        workout: [
          "3 sets of push-ups (12 reps)",
          "4 sets of squats (15 reps)",
          "3 sets of lunges (10 reps per leg)",
          "Plank for 60 seconds",
        ],
        diet: [
          "Breakfast: Protein smoothie with berries",
          "Lunch: Grilled chicken salad",
          "Dinner: Salmon with roasted vegetables",
          "Snack: Greek yogurt with nuts",
        ],
      });
    }, 1000); // Reduced from 2000 for faster response
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 via-purple-200 to-indigo-200 z-0 overflow-hidden"></div>
      <div className="relative flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="relative z-10 w-full py-4 px-6 flex items-center justify-between bg-white/30 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300 mr-4"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5 text-indigo-800" />
            </button>
            <h1 className="text-2xl font-bold text-indigo-900">
              AI Fitness Platform
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              JD
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-start flex-grow p-4 overflow-y-auto mt-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-100/80 via-purple-100/80 to-violet-200/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_-4px_rgba(80,50,180,0.3)] mb-8">
            <div className="relative p-8 flex flex-col gap-6 z-10">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold text-indigo-950 mb-2 tracking-tight">
                  {activeTab === "generate"
                    ? "Generate AI Plan"
                    : "Federate AI Models"}
                </h2>
                <p className="text-indigo-800/70 text-lg max-w-2xl mb-6">
                  {activeTab === "generate"
                    ? "Get personalized workout and diet recommendations tailored to your goals and preferences"
                    : "Combine multiple AI models to create a custom fitness assistant that meets your specific needs"}
                </p>

                {/* Tabs */}
                <div className="flex bg-white/50 rounded-full p-1 mb-8 border border-white/40">
                  <button
                    onClick={() => setActiveTab("generate")}
                    className={`px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 ${
                      activeTab === "generate"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-indigo-800 hover:bg-white/80"
                    }`}
                  >
                    Generate
                  </button>
                  <button
                    onClick={() => setActiveTab("federate")}
                    className={`px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 ${
                      activeTab === "federate"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-indigo-800 hover:bg-white/80"
                    }`}
                  >
                    Federate
                  </button>
                </div>

                {activeTab === "generate" ? (
                  <div className="w-full max-w-3xl">
                    {generating ? (
                      <div className="flex flex-col items-center py-16">
                        <RefreshCw className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
                        <p className="text-indigo-800 text-xl">
                          Creating your personalized plan...
                        </p>
                      </div>
                    ) : generatedContent ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/40">
                          <div className="flex items-center mb-4">
                            <Dumbbell className="w-8 h-8 text-indigo-700 mr-3" />
                            <h3 className="text-2xl font-bold text-indigo-900">
                              Workout Plan
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {generatedContent.workout.map((item, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-sm mr-3 mt-0.5">
                                  {idx + 1}
                                </div>
                                <p className="text-indigo-800">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/40">
                          <div className="flex items-center mb-4">
                            <Utensils className="w-8 h-8 text-indigo-700 mr-3" />
                            <h3 className="text-2xl font-bold text-indigo-900">
                              Diet Plan
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {generatedContent.diet.map((item, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-sm mr-3 mt-0.5">
                                  {idx + 1}
                                </div>
                                <p className="text-indigo-800">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-2 flex justify-center mt-4 space-x-4">
                          <button
                            onClick={handleGenerate}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2"
                          >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            <span>Regenerate Plan</span>
                          </button>
                          <button className="px-6 py-3 bg-white text-indigo-800 rounded-full shadow-md hover:shadow-lg hover:bg-white/90 transition-all duration-300 flex items-center">
                            <Save className="w-5 h-5 mr-2" />
                            <span>Save Plan</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/40 mb-6">
                          <h3 className="text-xl font-semibold text-indigo-900 mb-4">
                            Your Fitness Profile
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <label className="text-indigo-800 mb-1 text-sm">
                                Fitness Goal
                              </label>
                              <select className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>Weight Loss</option>
                                <option>Muscle Gain</option>
                                <option>Endurance</option>
                                <option>General Fitness</option>
                              </select>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-indigo-800 mb-1 text-sm">
                                Experience Level
                              </label>
                              <select className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                              </select>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-indigo-800 mb-1 text-sm">
                                Workout Duration
                              </label>
                              <select className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>15-30 minutes</option>
                                <option>30-45 minutes</option>
                                <option>45-60 minutes</option>
                                <option>60+ minutes</option>
                              </select>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-indigo-800 mb-1 text-sm">
                                Dietary Preference
                              </label>
                              <select className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>No Preference</option>
                                <option>Vegetarian</option>
                                <option>Vegan</option>
                                <option>Keto</option>
                                <option>Paleo</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <button
                            onClick={handleGenerate}
                            className="px-8 py-3.5 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all duration-300 text-lg font-medium"
                          >
                            Generate My Plan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-3xl">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/40 mb-6">
                      <h3 className="text-xl font-semibold text-indigo-900 mb-4">
                        Select AI Models to Federate
                      </h3>
                      <p className="text-indigo-800/80 mb-6">
                        Combine multiple specialized AI models to create a
                        custom fitness assistant tailored to your specific
                        needs.
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center bg-white/50 p-4 rounded-xl border border-indigo-100 hover:shadow-md transition-all">
                          <input
                            type="checkbox"
                            id="model1"
                            className="w-5 h-5 text-indigo-600 rounded"
                            defaultChecked
                          />
                          <label htmlFor="model1" className="ml-3 flex-1">
                            <span className="block text-lg font-medium text-indigo-900">
                              Workout Optimization AI
                            </span>
                            <span className="block text-sm text-indigo-700/70">
                              Specialized in creating effective exercise
                              routines
                            </span>
                          </label>
                          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                            Core Model
                          </span>
                        </div>

                        <div className="flex items-center bg-white/50 p-4 rounded-xl border border-indigo-100 hover:shadow-md transition-all">
                          <input
                            type="checkbox"
                            id="model2"
                            className="w-5 h-5 text-indigo-600 rounded"
                            defaultChecked
                          />
                          <label htmlFor="model2" className="ml-3 flex-1">
                            <span className="block text-lg font-medium text-indigo-900">
                              Nutrition Planning AI
                            </span>
                            <span className="block text-sm text-indigo-700/70">
                              Expert in dietary recommendations and meal
                              planning
                            </span>
                          </label>
                          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                            Core Model
                          </span>
                        </div>

                        <div className="flex items-center bg-white/50 p-4 rounded-xl border border-indigo-100 hover:shadow-md transition-all">
                          <input
                            type="checkbox"
                            id="model3"
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                          <label htmlFor="model3" className="ml-3 flex-1">
                            <span className="block text-lg font-medium text-indigo-900">
                              Injury Prevention AI
                            </span>
                            <span className="block text-sm text-indigo-700/70">
                              Focuses on safe exercise execution and recovery
                            </span>
                          </label>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            Premium
                          </span>
                        </div>

                        <div className="flex items-center bg-white/50 p-4 rounded-xl border border-indigo-100 hover:shadow-md transition-all">
                          <input
                            type="checkbox"
                            id="model4"
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                          <label htmlFor="model4" className="ml-3 flex-1">
                            <span className="block text-lg font-medium text-indigo-900">
                              Progress Tracking AI
                            </span>
                            <span className="block text-sm text-indigo-700/70">
                              Analyzes your progress and adjusts recommendations
                            </span>
                          </label>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            Premium
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/40 mb-6">
                      <h3 className="text-xl font-semibold text-indigo-900 mb-4">
                        Federation Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex flex-col">
                          <label className="text-indigo-800 mb-1 text-sm">
                            Model Integration Method
                          </label>
                          <select className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Weighted Ensemble</option>
                            <option>Sequential Processing</option>
                            <option>Parallel Processing</option>
                          </select>
                        </div>

                        <div className="flex flex-col">
                          <label className="text-indigo-800 mb-1 text-sm">
                            Model Conflict Resolution
                          </label>
                          <select className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Prioritize Safety</option>
                            <option>Prioritize Efficiency</option>
                            <option>Balanced Approach</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        className="px-8 py-3.5 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all duration-300 text-lg font-medium"
                        onClick={handleGenerate}
                      >
                        Create Federated AI
                      </button>
                      <button className="px-6 py-3.5 bg-white text-indigo-800 rounded-full shadow-md hover:shadow-lg hover:bg-white/90 transition-all duration-300 flex items-center">
                        <Share2 className="w-5 h-5 mr-2" />
                        <span>Share Configuration</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(GenerateFederateUI);
