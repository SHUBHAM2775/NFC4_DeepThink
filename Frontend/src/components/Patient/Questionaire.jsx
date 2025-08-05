import React, { useState } from 'react';

function Questionaire({ onComplete, user }) {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Sample questions - you can expand this
  const questions = [
    {
      id: 1,
      question: "How are you feeling today?",
      type: "multiple",
      options: ["Great", "Good", "Okay", "Not well", "Terrible"]
    },
    {
      id: 2,
      question: "Any specific symptoms?",
      type: "text",
      placeholder: "Describe any symptoms you're experiencing..."
    },
    {
      id: 3,
      question: "Rate your energy level (1-10)",
      type: "range",
      min: 1,
      max: 10
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete questionnaire
      onComplete(answers);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-700 mb-2">Health Questionnaire</h1>
          <p className="text-gray-600">Welcome {user?.name}! Please answer a few questions about your health.</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{currentQ.question}</h2>
          
          {currentQ.type === "multiple" && (
            <div className="space-y-2">
              {currentQ.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option}
                    checked={answers[currentQ.id] === option}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    className="text-green-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQ.type === "text" && (
            <textarea
              placeholder={currentQ.placeholder}
              value={answers[currentQ.id] || ""}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="4"
            />
          )}

          {currentQ.type === "range" && (
            <div>
              <input
                type="range"
                min={currentQ.min}
                max={currentQ.max}
                value={answers[currentQ.id] || currentQ.min}
                onChange={(e) => handleAnswer(currentQ.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{currentQ.min}</span>
                <span className="font-semibold text-green-600">
                  {answers[currentQ.id] || currentQ.min}
                </span>
                <span>{currentQ.max}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg font-semibold ${
              currentQuestion === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={!answers[currentQ.id]}
            className={`px-6 py-2 rounded-lg font-semibold ${
              !answers[currentQ.id]
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Questionaire;
