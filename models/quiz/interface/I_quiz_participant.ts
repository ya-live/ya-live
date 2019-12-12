export interface QuizParticipant {
  /** ISO 8601 */
  join: string;
  /** 생존 여부 */
  alive: boolean;
  currentQuizID?: string;
  /** 선택한 번호 */
  select?: number;
  /** 사용자 고유 id */
  id: string;
  /** 사용자 출력 명 */
  displayName: string;
}
