import React, { useState, useEffect, memo } from "react";
import {
  Dumbbell,
  Utensils,
  ArrowLeft,
  RefreshCw,
  Save,
  AlertTriangle,
} from "lucide-react";

const GenerateFederateUI = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("generate");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);
  const [apiMode, setApiMode] = useState("generate"); // 'generate' or 'test'

  // Form state
  const [formData, setFormData] = useState({
    fitnessGoal: "Weight Loss",
    experienceLevel: "Beginner",
    workoutDuration: "30-45 minutes",
    dietaryPreference: "No Preference",
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const resizeHandler = () => requestAnimationFrame(checkMobile);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleApiMode = () => {
    setApiMode((prev) => (prev === "generate" ? "test" : "generate"));
    setError(null);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedContent(null);
    setError(null);

    try {
      const prompt = `Create a personalized fitness plan with both workout and diet recommendations for someone with the following profile:
        - Fitness Goal: ${formData.fitnessGoal}
        - Experience Level: ${formData.experienceLevel}
        - Workout Duration: ${formData.workoutDuration}
        - Dietary Preference: ${formData.dietaryPreference}
        
        Please provide a workout plan with specific exercises, sets, and reps, and a daily meal plan with breakfast, lunch, dinner, and snacks.`;

      const endpoint = apiMode === "generate" ? "/generate" : "/test";
      console.log(`Calling API endpoint: http://localhost:5000${endpoint}`);

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `API error: ${response.status}`);
      }

      const mealPlanText = data.mealPlan;
      console.log("API Response:", mealPlanText);

      const workoutSection = extractWorkoutPlan(mealPlanText);
      const dietSection = extractDietPlan(mealPlanText);

      setGeneratedContent({
        workout: workoutSection,
        diet: dietSection,
        fullText: mealPlanText,
      });
    } catch (err) {
      console.error("Error generating plan:", err);
      setError(`Failed to generate plan: ${err.message}`);

      // Use fallback data only as a last resort
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
        fullText: "Fallback data due to API error",
      });
    } finally {
      setGenerating(false);
    }
  };

  const extractWorkoutPlan = (text) => {
    if (!text)
      return [
        "3 sets of push-ups (12 reps)",
        "4 sets of squats (15 reps)",
        "3 sets of lunges (10 reps per leg)",
        "Plank for 60 seconds",
      ];

    const workoutLines = [];
    const lines = text.split("\n");
    let inWorkoutSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(/workout|exercise|training plan/i)) {
        inWorkoutSection = true;
        continue;
      }

      if (inWorkoutSection && line.match(/meal plan|diet plan|nutrition/i)) {
        inWorkoutSection = false;
        continue;
      }

      if (
        inWorkoutSection &&
        (line.match(/^[\s]*[-*•]|\d+\.\s/) || line.match(/sets|reps/i))
      ) {
        const cleanLine = line.replace(/^[\s]*[-*•]|\d+\.\s/, "").trim();
        if (cleanLine) workoutLines.push(cleanLine);
      }
    }

    // Fallback if no workout lines found
    return workoutLines.length > 0
      ? workoutLines
      : [
          "3 sets of push-ups (12 reps)",
          "4 sets of squats (15 reps)",
          "3 sets of lunges (10 reps per leg)",
          "Plank for 60 seconds",
        ];
  };

  const extractDietPlan = (text) => {
    if (!text)
      return [
        "Breakfast: Protein smoothie with berries",
        "Lunch: Grilled chicken salad",
        "Dinner: Salmon with roasted vegetables",
        "Snack: Greek yogurt with nuts",
      ];

    const dietLines = [];
    const lines = text.split("\n");
    let inDietSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(/meal plan|diet plan|nutrition/i)) {
        inDietSection = true;
        continue;
      }

      if (inDietSection && line.match(/workout|exercise|training plan/i)) {
        inDietSection = false;
        continue;
      }

      if (
        inDietSection &&
        (line.match(/^[\s]*[-*•]|\d+\.\s/) ||
          line.match(/breakfast|lunch|dinner|snack/i))
      ) {
        const cleanLine = line.replace(/^[\s]*[-*•]|\d+\.\s/, "").trim();
        if (cleanLine) dietLines.push(cleanLine);
      }
    }

    return dietLines.length > 0
      ? dietLines
      : [
          "Breakfast: Protein smoothie with berries",
          "Lunch: Grilled chicken salad",
          "Dinner: Salmon with roasted vegetables",
          "Snack: Greek yogurt with nuts",
        ];
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
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleApiMode}
              className={`text-xs px-2 py-1 rounded ${
                apiMode === "generate"
                  ? "bg-indigo-200 text-indigo-800"
                  : "bg-green-200 text-green-800"
              }`}
              title="Toggle between real API and test mode"
            >
              {apiMode === "generate" ? "API Mode" : "Test Mode"}
            </button>
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
                  Generate AI Plan
                </h2>
                <p className="text-indigo-800/70 text-lg max-w-2xl mb-6">
                  Get personalized workout and diet recommendations tailored to
                  your goals and preferences
                </p>

                <div className="w-full max-w-3xl">
                  {generating ? (
                    <div className="flex flex-col items-center py-16">
                      <RefreshCw className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
                      <p className="text-indigo-800 text-xl">
                        Creating your personalized plan...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-6">
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                        <h3 className="text-lg font-semibold">Error</h3>
                      </div>
                      <p className="mb-4">{error}</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleGenerate}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-medium text-sm"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={toggleApiMode}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-medium text-sm"
                        >
                          Switch to{" "}
                          {apiMode === "generate" ? "Test Mode" : "API Mode"}
                        </button>
                      </div>
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
                            <select
                              name="fitnessGoal"
                              value={formData.fitnessGoal}
                              onChange={handleInputChange}
                              className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
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
                            <select
                              name="experienceLevel"
                              value={formData.experienceLevel}
                              onChange={handleInputChange}
                              className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                            </select>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-indigo-800 mb-1 text-sm">
                              Workout Duration
                            </label>
                            <select
                              name="workoutDuration"
                              value={formData.workoutDuration}
                              onChange={handleInputChange}
                              className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
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
                            <select
                              name="dietaryPreference"
                              value={formData.dietaryPreference}
                              onChange={handleInputChange}
                              className="bg-white/70 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(GenerateFederateUI);
