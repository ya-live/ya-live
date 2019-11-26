import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import debug from 'debug';

interface Resp<P> {
  status: number;
  payload?: P;
  error?: {
    statusCode?: number;
    data?: unknown;
  };
}

const log = debug('tjl:requester');

export async function requester<Payload>({
  option,
}: {
  option: AxiosRequestConfig;
}): Promise<Resp<Payload>> {
  try {
    const result: AxiosResponse<Payload> = await axios(option);
    log(result.status, result.config.url);
    return {
      status: result.status,
      payload: result.data,
    };
  } catch (error) {
    // 서버로부터 에러가 내려온 경우
    if (error.response) {
      const errResponse = error.response;

      return {
        status: parseInt(errResponse.status, 10),
        error: {
          statusCode: errResponse.status,
          data: errResponse.data,
        },
      };
    }

    // Client 요청 에러 (XMLHttpRequest Error)
    if (error.request) {
      return {
        status: 400,
        error: {
          data: error.request.statusText || 'Client Request Error',
        },
      };
    }

    // Unknown Error
    return {
      status: 400,
      error: {
        data: error.message,
      },
    };
  }
}
