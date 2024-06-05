"use client";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import Input from "./components/Input";
import CircleButton from "./components/CircleButton";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";
import {
  InputText,
  InputData,
  ErrMsg,
  InputDataEnums,
} from "./components/type";

Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: "../fonts/NotoSansJP-Regular.ttf",
    },
    {
      src: "../fonts/NotoSansJP-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    padding: 10,
    textAlign: "left",
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    fontSize: 12,
    margin: 10,
    padding: 10,
  },
  description: {
    fontSize: 10,
  },
  ki: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10,
  },
  list: {
    marginBottom: 5,
  },
  under: {
    marginTop: 10,
    textAlign: "right",
    textDecoration: "underline",
  },
});

// リセット用のデフォルトデータ
const defaultInputData: InputData = {
  name: "",
  descriptions: [{ id: "1", text: "" }],
  conditions: [{ id: "1", text: "" }],
  cautions: [{ id: "1", text: "" }],
  isDisplayPDF: false,
};

const defaultErrMsg: ErrMsg = {
  titleErrMsg: "",
  descriptionsErrMsg: "",
  conditionsErrMsg: "",
};

const makeSpaceText = (num: number) =>
  [...Array(num)].map((_) => "&nbsp;").reduce((a, b) => a + b);

const ymdSpace = makeSpaceText(13);
const nameSpace = makeSpaceText(40);
const addressSpace = makeSpaceText(80);

const personalWriteList = [
  `${ymdSpace}年${ymdSpace}月${ymdSpace}日`,
  `氏名: ${nameSpace}印`,
  `住所: ${addressSpace}`,
];

export default function App(): JSX.Element {
  // 入力情報
  const [inputData, editInputData] = useState<InputData>(defaultInputData);

  // バリデーション用のエラーメッセージ
  const [errMsgs, editErrMsg] = useState<ErrMsg>(defaultErrMsg);

  const changeTextData = (
    id: InputText["id"],
    text: string,
    changeParam: InputDataEnums
  ) => {
    const setParam = inputData[changeParam];
    const setData = setParam.map((el) =>
      el.id === id
        ? {
            ...el,
            text,
          }
        : el
    );

    editInputData({ ...inputData, [changeParam]: setData });
  };

  const addData = (changeParam: InputDataEnums) => {
    const setParam = inputData[changeParam];
    const setData = [...setParam, { id: `${setParam.length + 1}`, text: "" }];
    editInputData({ ...inputData, [changeParam]: setData });
  };

  const removeData = (id: InputText["id"], changeParam: InputDataEnums) => {
    const setParam = inputData[changeParam];
    const setData = setParam
      .filter((el) => el.id !== id)
      .map((el, index) => {
        return {
          ...el,
          id: `${index + 1}`,
        };
      });

    editInputData({ ...inputData, [changeParam]: setData });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const checkName = !!inputData.name;
    const checkDescriptions = inputData.descriptions.some((el) => el.text);
    const checkConditions = inputData.conditions.some((el) => el.text);

    editErrMsg({
      ...errMsgs,
      titleErrMsg: !checkName ? "同意書のタイトルを入力してください。" : "",
      descriptionsErrMsg: !checkDescriptions
        ? "最低でも文章は1つ入力してください。"
        : "",
      conditionsErrMsg: !checkConditions
        ? "最低でも条件は1つ入力してください。"
        : "",
    });

    // バリデーションが問題ないならPDFを表示
    editInputData({
      ...inputData,
      isDisplayPDF: checkName && checkDescriptions && checkConditions,
    });
  };

  const titleText =
    (inputData.name ? inputData.name : "(名前)") +
    "を飲食の場に誘うことに関する同意書";
  const fisrtDescription = `私、________________(以下、甲)は、${
    inputData.name ? inputData.name : "(名前)"
  }(以下、乙)を飲食の場に誘うことに対して、下記の全ての項目に同意いたします。`;

  return (
    <main>
      <div className="flex px-32">
        <div className="w-1/2 p-3">
          <h1 className="font-bold text-2xl">
            飲み会に参加したくない人のための同意書作成アプリ
          </h1>
          <p className="mt-2">
            飲み会に参加したくない人でも、飲み会に参加させられそうな時があるッ！
            <br />
            そんな時は、この同意書を作って飲み会をバックれようッ！
            <br />
            大丈夫！君は何も間違っていないぞ！飲み会に君を強制的に参加させようとする輩がいけないのだッ！
            <br />
            今日から君もこの同意書を作って、飲み会から自分の命を守るんだッ！
          </p>
          <section className="mt-4">
            <h2 className="text-xl font-bold">同意書内容作成</h2>
            <p>必要事項を記入してください。</p>
            <form onSubmit={onSubmit}>
              <div className="mt-2 w-full">
                <label htmlFor="title" className="mr-3 w-1/3">
                  貴方の名前
                  {!!errMsgs.titleErrMsg ? (
                    <span className="text-red-500 text-xs ml-2">
                      {errMsgs.titleErrMsg}
                    </span>
                  ) : null}
                </label>
                <Input
                  name="title"
                  value={inputData.name}
                  placeholder={
                    !inputData.name ? "(貴方の名前を入力)" : undefined
                  }
                  className="block w-full"
                  changeText={(e: string) =>
                    editInputData({ ...inputData, name: e })
                  }
                />
              </div>

              <div className="mt-2">
                <div>
                  説明文
                  {!!errMsgs.descriptionsErrMsg ? (
                    <span className="text-red-500 text-xs ml-3">
                      {errMsgs.descriptionsErrMsg}
                    </span>
                  ) : null}
                </div>
                {inputData.descriptions.length ? (
                  <ul className="mt-4">
                    {inputData.descriptions.map((el) => (
                      <li
                        key={el.id}
                        className="mb-1 last:mb-1 flex items-center"
                      >
                        <label
                          htmlFor={`description-${el.id}`}
                          className="mr-3 w-1/4 flex align-center"
                        >
                          テキスト{el.id}
                        </label>
                        <Input
                          name={`description-${el.id}`}
                          value={el.text}
                          className="block w-full"
                          changeText={(text: string) =>
                            changeTextData(el.id, text, "descriptions")
                          }
                        />
                        {el.id !== "1" ? (
                          <CircleButton
                            id={el.id}
                            isAdd={false}
                            onClickEvent={() =>
                              removeData(el.id, "descriptions")
                            }
                            editParamsName="descriptions"
                          />
                        ) : (
                          <span className="ml-2 w-8" />
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div>
                  <CircleButton
                    isAdd
                    onClickEvent={() => addData("descriptions")}
                    editParamsName="descriptions"
                  />
                </div>
              </div>
              <div className="mt-2">
                <ul>
                  {inputData.conditions.map((el) => (
                    <li
                      key={el.id}
                      className="mb-1 last:mb-1 flex items-center"
                    >
                      <label
                        htmlFor={`condition-${el.id}`}
                        className="mr-3 w-1/4 flex align-center"
                      >
                        条件{el.id}
                      </label>
                      <Input
                        name={`condition-${el.id}`}
                        value={el.text}
                        changeText={(text: string) =>
                          changeTextData(el.id, text, "conditions")
                        }
                      />
                      {el.id !== "1" ? (
                        <CircleButton
                          id={el.id}
                          isAdd={false}
                          onClickEvent={() => removeData(el.id, "conditions")}
                          editParamsName="descriptions"
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
                {!!errMsgs.conditionsErrMsg ? (
                  <div className="text-red-500 text-xs">
                    {errMsgs.conditionsErrMsg}
                  </div>
                ) : null}
                <div>
                  <CircleButton
                    isAdd
                    onClickEvent={() => addData("conditions")}
                    editParamsName="conditions"
                  />
                </div>
              </div>
              <div className="text-center">
                <input
                  type="submit"
                  value="同意書を作成"
                  className="border border-2 border-slate-500 rounded py-2 px-3 bg-orange-300 border-orange-600 cursor-pointer"
                />
                {inputData.isDisplayPDF ? (
                  <button
                    type="button"
                    className="ml-3 border border-2 border-slate-500 rounded py-2 px-3 bg-slate-500 border-slate-800 text-white"
                    onClick={() => editInputData(defaultInputData)}
                  >
                    同意書を作り直す
                  </button>
                ) : null}
              </div>
            </form>
          </section>
        </div>
        <div className="w-1/2 p-3">
          <h2 className="font-bold text-xl">同意書イメージ</h2>
          <p className="mt-1">
            ※画面のサイズによって当画面のpdfの表記が変わるため、実際のデザイン等は出力されたPDFを確認してください。
          </p>
          <div className="py-2 px-3 mt-2 bg-white min-h-96 rounded">
            <div className="text-center mt-4 text-xl font-bold">
              {titleText}
            </div>
            <p>{fisrtDescription}</p>
            {inputData.descriptions.length === 1 &&
            !inputData.descriptions[0].text ? (
              <p>(同意書の文書)</p>
            ) : (
              inputData.descriptions.map((el) => {
                return <p key={`desc-prev-${el.id}`}>{el.text}</p>;
              })
            )}
            <div className="text-center text-lg font-bold">記</div>
            {inputData.conditions.length === 1 &&
            !inputData.conditions[0].text ? (
              <p>(同意してもらうことの文書)</p>
            ) : (
              <ul>
                {inputData.conditions.map((el) => {
                  return (
                    <li key={`condition-prev-${el.id}`}>
                      {el.id}.{el.text}
                    </li>
                  );
                })}
              </ul>
            )}
            {personalWriteList.map((__html) => (
              <div
                className="text-right underline mt-4"
                dangerouslySetInnerHTML={{
                  __html,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {inputData.isDisplayPDF ? (
        <>
          <div className="text-center font-bold text-3xl">
            さあ、この同意書を使って飲み会を強引に誘ってくるやつに突きつけてやろうッ！
          </div>
          <PDFViewer width="100%" height="100%" className="h-[600px] px-32">
            <Document title={titleText} language="Japanese">
              <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                  <Text style={styles.title}>{titleText}</Text>
                  <Text style={styles.description}>{fisrtDescription}</Text>
                  {inputData.descriptions.map((el) => {
                    return <Text key={`desc-prev-${el.id}`}>{el.text}</Text>;
                  })}
                  <Text style={styles.ki}>記</Text>
                  {inputData.conditions.map((el) => {
                    return (
                      <Text key={`cond-prev-${el.id}`}>
                        {el.id}.{el.text}
                      </Text>
                    );
                  })}
                  <Text style={styles.under}>
                    　　　　　　年　　　　　　月　　　　　　日
                  </Text>
                  <Text style={styles.under}>
                    氏名:　　　　　　　　　　　　　　　　　　印
                  </Text>
                  <Text style={styles.under}>
                    住所:　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
                  </Text>
                </View>
              </Page>
            </Document>
          </PDFViewer>
        </>
      ) : null}
    </main>
  );
}
