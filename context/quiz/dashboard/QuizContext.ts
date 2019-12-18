import { createContext } from 'react';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';

export type SoundMap = Record<
  'calculate' | 'ending' | 'golden' | 'idle' | 'last1' | 'last5' | 'quiz' | 'result',
  HTMLAudioElement
>;

interface QuizContextValue {
  id: string;
  currentSoundRef: React.RefObject<HTMLAudioElement>;
  sounds: SoundMap;
  quiz: QuizOperation;
}

export const QuizContext = createContext<QuizContextValue>(null!);
