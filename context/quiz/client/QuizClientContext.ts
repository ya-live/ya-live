import { createContext } from 'react';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';
import { QuizParticipant } from '../../../models/quiz/interface/I_quiz_participant';

interface QuizClientContextValue {
  quizID: string;
  userID: string;
  quiz?: QuizOperation;
  user?: QuizParticipant;
}

export const QuizClientContext = createContext<QuizClientContextValue>(null!);
