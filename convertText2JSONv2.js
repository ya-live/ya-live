const fs = require('fs');

const text = fs.readFileSync('./quiz_v2.txt', 'utf8');

const splitTxt = text.split(/[\n\r]/);
const reduceData = splitTxt.reduce(
  (acc, cur, i) => {
    const dotSplitTxt = cur.split(/,/);
    const nowQuiz = {
      quiz_id: `q${i.toString().padStart(2, '0')}`,
      quiz_desc: dotSplitTxt[0],
      quiz_selector: [
        {
          no: 1,
          title: dotSplitTxt[1],
        },
        {
          no: 2,
          title: dotSplitTxt[2],
        },
        {
          no: 3,
          title: dotSplitTxt[3],
        },
        {
          no: 4,
          title: dotSplitTxt[4],
        },
      ],
      quiz_correct_answer: parseInt(dotSplitTxt[5], 10),
      quiz_type: 'TEXT',
    };
    acc.data.push(nowQuiz);
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
