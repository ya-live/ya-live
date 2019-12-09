import { Button, Divider, Layout, List, message } from 'antd';
import { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';

import { useStoreDoc } from '../../../components/auth/hooks/firestore_hooks';
import SlLayout from '../../../components/layout';
import getStringValueFromQuery from '../../../controllers/etc/get_value_from_query';
import { EN_QUIZ_STATUS } from '../../../models/quiz/interface/EN_QUIZ_STATUS';
import { QuizItem, QuizOperation } from '../../../models/quiz/interface/I_quiz_operation';
import * as opsService from '../../../models/quiz/operation.client.service';

interface Props {
  query: ParsedUrlQuery;
  id: string;
}

const initData: QuizOperation = {
  status: EN_QUIZ_STATUS.INIT,
  title: '데이터 수신 중',
  total_participants: 0,
  alive_participants: 0,
};

function statusButtons({ status }: { status: EN_QUIZ_STATUS }) {
  const buttons: { title: string; status: EN_QUIZ_STATUS }[] = [];
  if (status === EN_QUIZ_STATUS.INIT) {
    return buttons;
  }
  if (status === EN_QUIZ_STATUS.PREPARE) {
    buttons.push({ title: 'IDLE', status: EN_QUIZ_STATUS.IDLE });
  }
  if (status === EN_QUIZ_STATUS.IDLE) {
    buttons.push({ title: 'QUIZ', status: EN_QUIZ_STATUS.QUIZ });
    buttons.push({ title: 'FINISH', status: EN_QUIZ_STATUS.FINISH });
  }
  if (status === EN_QUIZ_STATUS.QUIZ) {
    buttons.push({ title: 'COUNTDOWN', status: EN_QUIZ_STATUS.COUNTDOWN });
  }
  if (status === EN_QUIZ_STATUS.CALCULATE) {
    buttons.push({ title: 'SHOW_RESULT', status: EN_QUIZ_STATUS.SHOW_RESULT });
  }
  if (status === EN_QUIZ_STATUS.SHOW_RESULT) {
    buttons.push({ title: 'IDLE', status: EN_QUIZ_STATUS.IDLE });
  }
  return buttons;
}

/** 프론트 진행용 */
const QuizHeadQuarter: NextPage<Props> = ({ id }) => {
  const [statusChangeLoader, updateStatusChangeLoader] = useState(false);
  const [quizData, updateQuizData] = useState<QuizItem[]>();
  const [pubCorrectAnswerStatus, updatePubCorrectAnswerStatus] = useState(false);
  const { docValue: info } = useStoreDoc({ collectionPath: 'quiz', docPath: id });

  const operationInfo: QuizOperation = (() => {
    if (info === undefined) {
      return initData;
    }
    const dataFromFireStore = info.data();
    if (dataFromFireStore) {
      return dataFromFireStore as QuizOperation;
    }
    return initData;
  })();

  const statusSwitch = (() => {
    const buttons = statusButtons({ status: operationInfo.status });
    return buttons.map((mv) => (
      <Button
        loading={statusChangeLoader}
        onClick={async () => {
          updateStatusChangeLoader(true);
          await opsService.updateQuizOpsForClient({
            quiz_id: id,
            isServer: false,
            info: {
              status: mv.status,
            },
          });
          // 카운트 다운 이벤트는 발생 즉시 10초 후 calculate로 상태를 전환한다.
          if (mv.status === EN_QUIZ_STATUS.COUNTDOWN) {
            setTimeout(async () => {
              message.info('job done');
              updateStatusChangeLoader(true);
              await opsService.updateQuizOpsForClient({
                quiz_id: id,
                isServer: false,
                info: {
                  status: EN_QUIZ_STATUS.CALCULATE,
                },
              });
              // 정답 공개 flag false로 전환
              updatePubCorrectAnswerStatus(false);
              updateStatusChangeLoader(false);
            }, 11000);
          }
          updateStatusChangeLoader(false);
        }}
      >
        {mv.title}
      </Button>
    ));
  })();

  const quizBank = (() => {
    if (quizData === undefined || quizData.length === 0) {
      return null;
    }
    return (
      <List
        itemLayout="horizontal"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={quizData}
        renderItem={(item) => (
          <List.Item
            key={item.quiz_id}
            actions={[
              <Button
                onClick={async () => {
                  // IDLE이 아니면 퀴즈 전송이 안된다.
                  if (operationInfo.status !== EN_QUIZ_STATUS.IDLE) {
                    message.warn('IDLE 상태가 아니면 퀴즈 셋팅이 안됩니다.');
                    return;
                  }
                  // 퀴즈 정보 반영 요청
                  const resp = await opsService.updateQuizOpsForClient({
                    quiz_id: id,
                    isServer: false,
                    info: {
                      quiz_id: item.quiz_id,
                      quiz_desc: item.quiz_desc,
                      quiz_image_url: item.quiz_image_url,
                      quiz_selector: item.quiz_selector,
                      quiz_type: item.quiz_type,
                      quiz_correct_answer: -1,
                    },
                  });
                  message.info(`퀴즈 정보 반영 상태 : ${resp.status}`);
                }}
              >
                문제 적용
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.quiz_id} description={item.quiz_desc} />
          </List.Item>
        )}
      />
    );
  })();

  // 정답공개 버튼
  const publishQuizCorrectAnswer = (() => {
    if (
      operationInfo.status === EN_QUIZ_STATUS.CALCULATE &&
      operationInfo.quiz_id &&
      pubCorrectAnswerStatus === false
    ) {
      return (
        <Button
          type="primary"
          onClick={async () => {
            const findQuiz = quizData?.find((fv) => fv.quiz_id === operationInfo.quiz_id);
            if (findQuiz === undefined) {
              message.warn('퀴즈 정보를 찾지 못했습니다.');
              return;
            }
            const resp = await opsService.updateQuizOpsForClient({
              quiz_id: id,
              isServer: false,
              info: {
                quiz_correct_answer: findQuiz.quiz_correct_answer,
              },
            });
            updatePubCorrectAnswerStatus(true);
            message.info(`퀴즈 정보 반영 상태 : ${resp.status}`);
          }}
        >
          정답 공개
        </Button>
      );
    }
    return null;
  })();

  // 정답자를 카운트한다.
  const calCorrectAnswer = (() => {
    if (
      operationInfo.status === EN_QUIZ_STATUS.CALCULATE &&
      operationInfo.quiz_id &&
      pubCorrectAnswerStatus === true
    ) {
      return (
        <Button
          type="primary"
          onClick={() => {
            message.info('오답자 계산하는 api 콜을 한다');
          }}
        >
          오답자 계산
        </Button>
      );
    }
    return null;
  })();

  return (
    <SlLayout>
      <Layout className="layout">
        <Layout.Content>
          <>
            <div>현재상태 : {operationInfo.status}</div>
            <div>참가자 : {operationInfo.total_participants}</div>
            <div>생존자 : {operationInfo.alive_participants}</div>
            <Divider />
            <div>{statusSwitch}</div>
            <Divider />
            {publishQuizCorrectAnswer}
            {calCorrectAnswer}
            <div>{`현재 퀴즈 id: ${operationInfo.quiz_id}`}</div>
            <div>{`퀴즈 설명: ${operationInfo.quiz_desc}`}</div>
            <Divider />
            <Button
              onClick={async () => {
                const resp = await opsService.findAllQuizFromBankForClient({
                  quiz_id: id,
                  isServer: false,
                });
                if (resp.status !== 200 || resp.payload === undefined || resp.payload === null) {
                  message.warning('퀴즈 불러오기 실패');
                }
                if (resp.status === 200 && resp.payload && resp.payload !== null) {
                  updateQuizData(resp.payload);
                }
              }}
            >
              퀴즈 불러오기
            </Button>
            {quizBank}
          </>
        </Layout.Content>
      </Layout>
    </SlLayout>
  );
};

QuizHeadQuarter.getInitialProps = async (ctx) => {
  const id = getStringValueFromQuery({ query: ctx.query, field: 'id' });
  return {
    id: id || 'none',
    query: ctx.query,
  };
};

export default QuizHeadQuarter;
