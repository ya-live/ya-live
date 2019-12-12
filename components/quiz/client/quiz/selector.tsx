import React from 'react';
import clsx from 'clsx';
import { SelectorItem } from '../../../../models/quiz/interface/I_quiz_operation';
import styles from './selector.css';

interface SelectorProps {
  selector: SelectorItem;
  selectedNo: number;
  result: number;
  isShowResult: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const Selector: React.FC<SelectorProps> = ({
  selector,
  selectedNo,
  result,
  isShowResult,
  isDisabled,
  onClick,
}) => {
  const styleBeforeResult = (() => {
    if (selectedNo === selector.no) {
      return styles.selected;
    }

    if (isDisabled) {
      return styles.disabled;
    }
  })();
  const styleAfterResult = (() => {
    if (selectedNo === result) {
      // 정답이 공개되고 답 맞을 때
      return result === selector.no ? styles.successResult : styles.disabled;
    }

    // 정답이 공개되고 답 안맞을때
    return result === selector.no ? styles.failResult : styles.disabled;
  })();

  return (
    <button
      className={clsx(styles.selector, isShowResult ? styleAfterResult : styleBeforeResult)}
      type="button"
      key={selector.no}
      onClick={onClick}
      disabled={isDisabled}
    >
      {selector.title}
    </button>
  );
};

export default Selector;
