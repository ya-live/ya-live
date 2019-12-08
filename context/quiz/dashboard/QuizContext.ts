import { createContext } from 'react';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';

interface QuizContextValue {
  id: string;
  quiz: QuizOperation;
}

export const QuizContext = createContext<QuizContextValue>(null!);
