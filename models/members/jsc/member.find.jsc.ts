import { JSONSchema6 } from 'json-schema';

const JSCMemberFind: JSONSchema6 = {
  description: '회원 검색',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
};

export default JSCMemberFind;
