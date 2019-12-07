import { JSONSchema6 } from 'json-schema';

const JSCQuizCalculate: JSONSchema6 = {
  description: '라운드 정산',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
};

export default JSCQuizCalculate;
