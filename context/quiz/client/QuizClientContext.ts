import { createContext } from 'react';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';

interface QuizClientContextValue {
  quizID: string;
  userID: string;
  quiz?: QuizOperation;
}

export const QuizClientContext = createContext<QuizClientContextValue>(null!);
