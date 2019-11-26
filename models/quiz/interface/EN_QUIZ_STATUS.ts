export enum EN_QUIZ_STATUS {
  /** 준비중 */
  PREPARE = 'PREPARE',
  /** 대기중 */
  IDLE = 'IDLE',
  /** 문제 제출 */
  QUIZ = 'QUIZ',
  /** 문제 풀이 */
  COUNTDOWN = 'COUNTDOWN',
  /** 집계(계산) 중 */
  CALCULATE = 'CALCULATE',
  /** 결과 송출 */
  SHOW_RESULT = 'SHOW_RESULT',
  /** 종료! */
  FINISH = 'FINISH',
}
