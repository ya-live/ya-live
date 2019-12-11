import { EN_QUIZ_STATUS } from './EN_QUIZ_STATUS';
import { EN_QUIZ_TYPE } from './EN_QUIZ_TYPE';

/** 퀴즈쇼 제어에 사용되는 데이터 */
export interface QuizOperation {
  /** 상태 */
  status: EN_QUIZ_STATUS;
  /** 제목? 노출할 글자? */
  title?: string;

  /** 퀴즈 id(각 퀴즈를 구분하는 값) */
  quiz_id?: string;
  /** 퀴즈 타입 */
  quiz_type?: EN_QUIZ_TYPE;
  /** 퀴즈 설명 */
  quiz_desc?: string;
  /** 퀴즈 이미지 url */
  quiz_image_url?: string;
  /** 사용자가 선택할 수 있는 객관식 문항 */
  quiz_selector?: SelectorItem[];
  /** 퀴즈의 정답(반드시 SHOW_RESULT 상태에서 넣어줘야한다.) */
  quiz_correct_answer?: number;

  /** 전체 참가자 숫자 */
  total_participants: number;
  /** 생존한 참가자 숫자 */
  alive_participants: number;
}

export interface SelectorItem {
  /** 객관식 번호(1부터 시작) */
  no: number;
  /** 텍스트 */
  title: string;
  /** 이미지 url */
  image_url?: string;
}
