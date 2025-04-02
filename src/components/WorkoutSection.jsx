import React, { useState } from "react";
import {
  Dumbbell,
  Calendar,
  Clock,
  Target,
  Filter,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

const WorkoutSection = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const workoutCategories = [
    { name: "All", count: 28 },
    { name: "Strength", count: 12 },
    { name: "Cardio", count: 8 },
    { name: "Flexibility", count: 5 },
    { name: "Recovery", count: 3 },
  ];

  const recentWorkouts = [
    {
      name: "Upper Body Power",
      duration: "45 min",
      category: "Strength",
      lastPerformed: "2 days ago",
      exercises: ["Bench Press", "Pull-ups", "Shoulder Press", "Bicep Curls"],
    },
    {
      name: "HIIT Cardio",
      duration: "30 min",
      category: "Cardio",
      lastPerformed: "4 days ago",
      exercises: ["Burpees", "Mountain Climbers", "High Knees", "Jump Squats"],
    },
    {
      name: "Full Body Mobility",
      duration: "20 min",
      category: "Flexibility",
      lastPerformed: "1 week ago",
      exercises: [
        "Hip Openers",
        "Shoulder Rotations",
        "Spine Twists",
        "Ankle Mobility",
      ],
    },
  ];

  const filteredWorkouts =
    selectedCategory === "All"
      ? recentWorkouts
      : recentWorkouts.filter(
          (workout) => workout.category === selectedCategory
        );

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 p-6">
      <div className="bg-gradient-to-br from-blue-100/80 via-purple-100/80 to-violet-200/80 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_8px_32px_-4px_rgba(80,50,180,0.3)] overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Dumbbell className="w-8 h-8 text-indigo-800 mr-3" />
              <h2 className="text-2xl font-bold text-indigo-900">
                My Workouts
              </h2>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-white/70 text-indigo-800 shadow-sm hover:shadow-md hover:bg-white transition-all">
                <Calendar size={20} />
              </button>
              <button className="p-2 rounded-full bg-white/70 text-indigo-800 shadow-sm hover:shadow-md hover:bg-white transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar">
            <div className="flex space-x-3">
              {workoutCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category.name
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white/70 text-indigo-800 hover:bg-white hover:shadow-md"
                  } transition-all`}
                >
                  <span>{category.name}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/20">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Workouts List */}
          <div className="space-y-4 mb-8">
            {filteredWorkouts.map((workout, index) => (
              <div
                key={index}
                className="bg-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/40"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-indigo-900">
                    {workout.name}
                  </h3>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                    {workout.category}
                  </span>
                </div>
                <div className="flex items-center text-indigo-800/70 mb-3 text-sm">
                  <Clock size={16} className="mr-1" />
                  <span className="mr-4">{workout.duration}</span>
                  <Calendar size={16} className="mr-1" />
                  <span>{workout.lastPerformed}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {workout.exercises.map((exercise, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs"
                    >
                      {exercise}
                    </span>
                  ))}
                </div>
                <button className="w-full mt-2 flex items-center justify-center py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-all">
                  Start Workout
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            ))}
          </div>

          {/* Create New Workout Button */}
          <div className="flex justify-center">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center">
              <PlusCircle size={18} className="mr-2" />
              <span>Create New Workout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Workouts Section */}
      <div className="mt-8 bg-gradient-to-br from-blue-100/80 via-purple-100/80 to-violet-200/80 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_8px_32px_-4px_rgba(80,50,180,0.3)] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-indigo-900">
              AI Recommendations
            </h2>
            <button className="text-indigo-700 text-sm font-medium">
              See All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/40">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <Target size={20} className="text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">
                    Personalized Plan
                  </h3>
                  <p className="text-xs text-indigo-700/70">
                    Based on your goals
                  </p>
                </div>
              </div>
              <button className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-all">
                View Plan
              </button>
            </div>

            <div className="bg-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/40">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <Dumbbell size={20} className="text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">New Workout</h3>
                  <p className="text-xs text-indigo-700/70">
                    Try something different
                  </p>
                </div>
              </div>
              <button className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-all">
                Generate Workout
              </button>
            </div>

            <div className="bg-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/40">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <Clock size={20} className="text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">Quick Session</h3>
                  <p className="text-xs text-indigo-700/70">
                    15-minute workouts
                  </p>
                </div>
              </div>
              <button className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-all">
                Browse Quick Workouts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSection;
