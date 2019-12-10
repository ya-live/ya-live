import { createContext } from 'react';

class QuizClientStore {
  constructor(public readonly quizID: string, public readonly userID: string) {
    this.quizID = quizID;
    this.userID = userID;
  }
}

export default QuizClientStore;
export const QuizClientStoreCtx = createContext<QuizClientStore>(null!);
