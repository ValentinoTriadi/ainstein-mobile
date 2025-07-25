import { QuizType } from "@/data/dummyData";
import { authClient } from "@/lib/auth";
import { HStack, VStack } from "@gluestack-ui/themed";
import axios from "axios";
import Constants from "expo-constants";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams<{
    quizId: string;
  }>();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const apiUrl = Constants.expoConfig?.extra?.apiUrl;
        if (!apiUrl) throw new Error("API URL not configured");

        const cookies = authClient.getCookie();
        const headers = { Cookie: cookies };

        const res = await axios.get(`${apiUrl}/quiz/${quizId}`, { headers });
        const quizRespons: QuizType = res.data.data;
        const quizData: QuizData = {
          id: quizRespons.id,
          title: quizRespons.title,
          questions:
            quizRespons.quizQuestions?.map((q) => ({
              id: q.id,
              question: q.questionText,
              options: q.quizAnswers.map((a) => a.answerText),
              correctAnswer: q.quizAnswers.findIndex((a) => a.isCorrect),
            })) || [],
        };

        console.log("Fetched quiz data:", quizData);

        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(null));
      } catch (error) {
        console.error("Error fetching quiz:", error);
        // Fallback with dummy data for demo
        const dummyQuiz: QuizData = {
          id: quizId || "1",
          title: "Title",
          questions: [
            {
              id: "q1",
              question: "What is the value of x in the equation 2x + 5 = 13?",
              options: ["Answer One Lorem", "Answer Two Lorem", "Answer Three"],
              correctAnswer: 1,
            },
            {
              id: "q2",
              question: "Solve for y: 3y - 7 = 14",
              options: ["y = 5", "y = 7", "y = 9"],
              correctAnswer: 1,
            },
          ],
        };
        setQuiz(dummyQuiz);
        setAnswers(new Array(dummyQuiz.questions.length).fill(null));
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="mt-4 text-gray-600">Loading quiz...</Text>
      </SafeAreaView>
    );
  }

  if (!quiz) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">Quiz not found</Text>
      </SafeAreaView>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <SafeAreaView className="flex-1 bg-white">
        <VStack className="flex-1 justify-center items-center p-6">
          <View className="w-32 h-32 bg-green-100 rounded-full justify-center items-center mb-6">
            <Text style={{ fontSize: 48 }}>🎉</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </Text>
          <Text className="text-xl text-gray-600 mb-8">
            Your Score: {score}%
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-orange-500 px-8 py-4 rounded-xl"
          >
            <Text className="text-white font-semibold text-lg">
              Back to Study Kit
            </Text>
          </TouchableOpacity>
        </VStack>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <VStack className="px-4 py-3 bg-white border-b border-gray-200">
        <HStack className="items-center justify-between mb-4 flex flex-row">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            {quiz.title}
          </Text>
          <View /> {/* Spacer */}
        </HStack>

        {/* Progress Bar */}
        <View className="w-full h-2 bg-gray-200 rounded-full mb-2">
          <View
            className="h-full bg-orange-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="text-sm text-gray-600 text-center">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Text>
      </VStack>

      <View className="flex-1">
        {/* Question Area */}
        <ScrollView className="flex-1 p-6">
          <Text className="text-xl font-semibold text-gray-900 leading-7 mb-8">
            {currentQuestion.question}
          </Text>
        </ScrollView>

        {/* Answer Options */}
        <VStack className="px-6 pb-6 bg-gray-50">
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(index)}
              className={`mb-3 p-4 rounded-xl border-2 ${
                selectedAnswer === index
                  ? "bg-orange-50 border-orange-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <HStack className="w-full items-center justify-between flex flex-row">
                <Text
                  className={`text-base font-medium max-w-[80%] ${
                    selectedAnswer === index
                      ? "text-orange-700"
                      : "text-gray-900"
                  }`}
                >
                  {option}
                </Text>
                {selectedAnswer === index && (
                  <View className="w-6 h-6 bg-orange-500 rounded-full justify-center items-center">
                    <Check size={16} color="white" />
                  </View>
                )}
              </HStack>
            </TouchableOpacity>
          ))}

          {/* Navigation Buttons */}
          <HStack className="justify-between items-center mt-6 flex flex-row">
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-xl ${
                currentQuestionIndex === 0 ? "bg-gray-200" : "bg-gray-300"
              }`}
            >
              <Text
                className={`font-semibold ${
                  currentQuestionIndex === 0 ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={selectedAnswer === null}
              className={`px-6 py-3 rounded-xl ${
                selectedAnswer === null ? "bg-gray-200" : "bg-orange-500"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedAnswer === null ? "text-gray-400" : "text-white"
                }`}
              >
                {currentQuestionIndex === quiz.questions.length - 1
                  ? "Finish"
                  : "Next"}
              </Text>
            </TouchableOpacity>
          </HStack>
        </VStack>
      </View>
    </SafeAreaView>
  );
}
