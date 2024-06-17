import React, { useState, useEffect } from "react";
import questions from "../quizdata/questionData.json";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1); // Start from question 1
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Total number of questions
  const totalQuestions = questions.length;
  const isFirstQuestion = currentQuestion === 1;
  const isLastQuestion = currentQuestion === totalQuestions;

  // Load state from localStorage on initial render
  useEffect(() => {
    const quizStateFromStorage = localStorage.getItem("quizState");
    if (quizStateFromStorage) {
      const { currentQuestion, score, timeLeft } =
        JSON.parse(quizStateFromStorage);
      setCurrentQuestion(currentQuestion);
      setScore(score);
      setTimeLeft(timeLeft);
    }
  }, []);

  // Save state to localStorage whenever currentQuestion, score, or timeLeft changes
  useEffect(() => {
    const quizState = { currentQuestion, score, timeLeft };
    localStorage.setItem("quizState", JSON.stringify(quizState));
  }, [currentQuestion, score, timeLeft]);

  // Timer effect to decrement timeLeft every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          handleSubmitQuiz();
          clearInterval(timer); // Stop the timer when timeLeft reaches zero
          return 0;
        } else {
          return prevTime - 1; 
        }
      });


    }, 1000);

    return () => clearInterval(timer); //  clear the interval
  }, []);

 
  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex
    });
  };

  const handleSubmitQuiz = () => {
    let totalScore = 0;

    // Iterate through each question
    for (let i = 1; i <= totalQuestions; i++) {
      const currentQuestionObj = questions.find((question) => question.no === i);
      const selectedOptionAns = selectedAnswers[i];
      // Check if selected option is correct
      if (selectedOptionAns === currentQuestionObj.answer) {
        totalScore += 1; // Increment score if correct
      }
    }

    // Set the final score and mark quiz as finished
    setScore(totalScore);
    setIsQuizFinished(true);
  };

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions && selectedOption) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null)
    }
  };

  const handleRetest = () => {
    localStorage.removeItem("quizState");
    setSelectedAnswers({});
    setCurrentQuestion(1)
    setScore(0)
    setTimeLeft(10*60)
    setIsQuizFinished(false);
  };

  const handlePrevQues = () => {
    if(currentQuestion > 0){
      setCurrentQuestion(currentQuestion - 1);
    }
  };

    const currentQuestionObj = questions.find((question) => question.no === currentQuestion);


  return (
 <>
 {isQuizFinished ? <div className="w-full h-2/3 bg-white mt-10 rounded-lg flex flex-col items-center justify-center">
    <p className="text-3xl font-semibold text-zinc-600 ">Your Score is : <span>{score * 10}/{totalQuestions * 10}</span></p>
    <button onClick={handleRetest} className="px-16 py-2 bg-blue-500 rounded-lg mt-4 text-white font-semibold">Retest</button>
 </div> :  
      <>  
      <div className="quiz-container flex justify-between items-center pt-20 gap-10">
      
        <div className="quiz-section w-[60vw] py-4 rounded-lg">
          <div className="quiz-questions-section w-full h-40 pl-20 rounded-lg bg-white flex flex-col justify-center">
            <p className="text-2xl font-semibold text-zinc-800">
              Question {currentQuestion} / {totalQuestions}
            </p>
            <p className="text-2xl font-semibold text-zinc-700 pt-4">
              {questions[currentQuestion - 1].question}
            </p>
          </div>
          <div className="quiz-options-section w-full h-72 mt-10 bg-white rounded-lg overflow-hidden">
          <ul className="w-full h-full flex flex-col px-20 py-4 items-start justify-between">
          {currentQuestionObj.options.map((option, optionIndex) => (
            <li
              key={optionIndex}
              onClick={() => handleOptionSelect(option)}
              className={`w-60 h-10 rounded-lg flex items-center justify-center text-xl font-semibold cursor-pointer ${
                option === selectedAnswers[currentQuestion]
                  ? "bg-green-500 text-white"
                  : "bg-slate-300 text-zinc-800"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
          </div>
        </div>

        <div className="timer-section w-[20vw] h-[46vh] bg-white rounded-lg pt-10">
          <h1 className="text-3xl pl-6 font-semibold text-zinc-600">
            Time Left:{" "}
          </h1>

          <div className="timer relative mt-20 flex items-center justify-center">
            <div className="w-60 h-60 flex items-center justify-center rounded-full bg-blue-200">
              <svg className="w-full h-full">
                <circle className="circle-bg" cx="50%" cy="50%" r="40%" />
                <circle
                  className="circle"
                  cx="50%"
                  cy="50%"
                  r="40%"
                 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-semibold text-white">
                  {Math.floor(timeLeft / 60)}:
                  {("0" + (timeLeft % 60)).slice(-2)}
                </span>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
      <div className="quiz-control-buttons w-[60vw] h-20 mt-10 px-20 bg-white rounded-lg flex items-center justify-between">
        <div className="w-1/3  flex items-center justify-between">
          <button
            disabled={isFirstQuestion}
            onClick={handlePrevQues}
            className={`px-16 py-2 mr-20 rounded-lg text-xl font-semibold ${
              isFirstQuestion
                ? "bg-slate-300 text-black cursor-not-allowed"
                : "bg-[#4f2099] text-white cursor-pointer"
            }`}
          >
            Prev
          </button> 

          {isLastQuestion && selectedAnswers[totalQuestions]? (
            <button
              onClick={handleSubmitQuiz}
              className="px-16 py-2 rounded-lg text-xl font-semibold 
             bg-blue-500 text-white cursor-pointer
            "
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className={` px-16 py-2 rounded-lg text-xl font-semibold 
                ${selectedAnswers[currentQuestion] ? "bg-blue-600 text-white" : "bg-zinc-200 text-zinc-800" } cursor-pointer
            `}
            >
              Next
            </button>
          )}
     
          
        </div>
      </div>
    </>
 }


 </>

)
};

export default Quiz;
