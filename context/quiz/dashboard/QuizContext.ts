import { createContext } from 'react';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';

export const QuizContext = createContext<QuizOperation>(null!);
