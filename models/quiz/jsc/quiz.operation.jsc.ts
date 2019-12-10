import { JSONSchema6 } from 'json-schema';

const JSCQuizOperation: JSONSchema6 = {
  description: '퀴즈 운영',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
};

export default JSCQuizOperation;
