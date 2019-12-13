const fs = require('fs');

const text = fs.readFileSync('./quiz.txt', 'utf8');

const splitTxt = text.split(/[\n\r]/);
const reduceData = splitTxt.reduce(
  (acc, cur, i) => {
    const nowIdx = i % 7;
    if (nowIdx === 0) {
      acc.make = {
        quiz_id: '',
        quiz_desc: '',
        quiz_selector: [],
        quiz_correct_answer: 0,
        quiz_type: 'TEXT',
      };
      const desc = cur.split('. ')[1];
      acc.make.quiz_desc = desc;
      const id = cur.split('. ')[0];
      acc.make.quiz_id = id;
    }
    if (nowIdx >= 1 && nowIdx <= 4) {
      acc.make.quiz_selector.push({ no: nowIdx, title: cur });
    }
    if (nowIdx === 5) {
      acc.make.quiz_correct_answer = parseInt(cur, 10);
    }
    if (nowIdx === 6) {
      acc.data.push({ ...acc.make });
    }
    return acc;
  },
  {
    make: {
      quiz_id: '',
      quiz_desc: '',
      quiz_selector: [],
      quiz_correct_answer: 0,
      quiz_type: 'TEXT',
    },
    data: [],
  },
);

console.log(JSON.stringify(reduceData.data));
