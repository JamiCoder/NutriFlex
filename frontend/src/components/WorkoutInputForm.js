// WorkoutFormManager.js
import React, { useContext, useState, useEffect } from "react";
import BodyMeasurementsForm from "./forms/BodyMeasurementsForm";
import GoalsActivityForm from "./forms/GoalsActivityForm";
import LifestyleForm from "./forms/LifestyleForm";
import WorkoutFormContext from "./WorkoutFormProvider";
import axios_ from "@/api/axios";
import Modal from "./Modal";

const WorkoutFormManager = ({ user }) => {
  const { globalFormState, setGlobalFormState } =
    useContext(WorkoutFormContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerateWorkoutPlanLoading, setIsGenerateWorkoutPlanLoading] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  

  useEffect(() => {
    if (isGenerateWorkoutPlanLoading) {
      // Reset API status and loading state when the loading begins
      setApiStatus(null);
    }
  }, [isGenerateWorkoutPlanLoading]);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleGenerateWorkoutPlan = async () => {
    setIsLoading(true);
    let smoking_habbit_value = "Non-Smoking";
    if (globalFormState.smokingHabit) {
      smoking_habbit_value = globalFormState.smokingHabit;
    }

    const workoutPlanBody = {
      user: user.id,
      height: globalFormState.height,
      weight: globalFormState.weight,
      age: globalFormState.age,
      goals: globalFormState.goals,
      activity_level: globalFormState.activityLevel,
      smoking_habit: smoking_habbit_value,
      dietary_preference: globalFormState.dietaryPreference,
    };

    try {
      setIsModalOpen(true);
      const createWorkoutPlanResponse = await axios_.post(
        "/api/workout-plan/create",
        workoutPlanBody,
        { withCredentials: true }
      );

      setApiStatus(createWorkoutPlanResponse.data.api_status);

      // Simulate a delay to show the loading state
      setTimeout(() => {
        setIsLoading(false);

        // Check if the API status is true
        if (createWorkoutPlanResponse.data.api_status) {
          setIsSuccess(true);
        } else {
          setIsSuccess(false);
        }
      }, 2000);
      setTimeout(() => {
        window.location.reload(true);
      }, 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setApiStatus("error");

      // In case of an error, set isSuccess to false
      setIsSuccess(false);

      // Open the modal
      setIsModalOpen(true);
    }
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return <BodyMeasurementsForm />;
      case 2:
        return <GoalsActivityForm />;
      case 3:
        return <LifestyleForm user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 p-6 max-w-sm mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Create Your Workout Plan
      </h2>
      {renderCurrentForm()}
      {/* buttons */}
      <div className="mt-4 flex justify-between">
        {currentStep > 1 && (
          <button
            onClick={handlePrev}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Previous
          </button>
        )}
        {currentStep < 3 && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            type="submit"
            onClick={handleNext}
          >
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button
            className={`${
              isGenerateWorkoutPlanLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white py-2 px-4 rounded-lg`}
            type="submit"
            onClick={handleGenerateWorkoutPlan}
            disabled={isGenerateWorkoutPlanLoading}
          >
            Generate Workout Plan
          </button>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onClose={closeModal}
      />
    </div>
  );
};

export default WorkoutFormManager;
