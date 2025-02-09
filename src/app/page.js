"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import data from "./data";

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizStarted, setQuizStarted] = useState(false);
  const questions=data.questions;
  
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleAnswer(false);
    }
  }, [timeLeft, quizStarted, quizCompleted, currentQuestion]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(15);
    } else {
      setQuizCompleted(true);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
    setQuizCompleted(false);
    setQuizStarted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6  transition-all">
      <Card className="p-4 space-y-3 max-w-lg mx-auto border border-gray-300 ">
        <CardContent>
          {!quizStarted ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Welcome to Quizify
              </p>
              <Button
                className="rounded border border-gray-300  bg-card text-card-foreground shadow"
                onClick={startQuiz}>
                Start Quiz
              </Button>
            </div>
          ) : !quizCompleted ? (
            questions.length > 0 && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {questions[currentQuestion].description}
                </p>
                <div className="relative w-full h-2 mt-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="h-full bg-zinc-900 rounded-full"
                  />
                </div>
                <p
                  className={`mt-2 text-sm ${
                    timeLeft <= 3
                      ? "text-red-500"
                      : "text-gray-600 dark:text-gray-400"
                      }`}>
                  Time left: {timeLeft}s
                </p>

                <div className="mt-6 grid gap-3">
                  {questions[currentQuestion].options.map((answer, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}>
                      <Button
                        variant="outline"
                        className="w-full py-3 rounded border border-gray-300  bg-card text-card-foreground shadow"
                        onClick={() => handleAnswer(answer.is_correct)}>
                        {answer.description}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}>
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                Quiz Completed!
              </h2>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Your Score: {score} / {questions.length}
              </p>

              <Button className="border border-gray-300 rounded" onClick={restartQuiz}>
                Restart Quiz
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
