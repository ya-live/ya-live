import React from 'react';
import clsx from 'clsx';
import { SelectorItem } from '../../../../models/quiz/interface/I_quiz_operation';
import styles from './selector.css';

interface SelectorProps {
  selector: SelectorItem;
  selectedNo: number;
  result: number;
  isShowResult: boolean;
  onClick: () => void;
}

const Selector: React.FC<SelectorProps> = ({
  selector,
  selectedNo,
  result,
  isShowResult,
  onClick,
}) => {
  const styleAfterResult = (() => {
    if (selectedNo === selector.no) {
      return styles.selected;
    }

    if (!isShowResult) {
      return;
    }

    if (selectedNo === result) {
      // 정답이 공개되고 답 맞을 때
      return result === selector.no ? styles.successResult : styles.disabled;
    }

    // 정답이 공개되고 답 안맞을때
    return result === selector.no ? styles.failResult : styles.disabled;
  })();

  return (
    <button
      className={clsx(styles.selector, styleAfterResult)}
      type="button"
      key={selector.no}
      onClick={onClick}
      disabled={isShowResult}
    >
      {selector.title}
    </button>
  );
};

export default Selector;
