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
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";

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
    padding: 30,
    fontSize: 11,
    textAlign: "center",
    width: "100%",
  },
  title: {
    fontSize: 18,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

type InputText = {
  id: string;
  text: string;
};

function App() {
  // 入力情報
  const [name, changeName] = useState<string>("");
  const [descriptions, editDescription] = useState<InputText[]>([
    { id: "1", text: "" },
  ]);
  const [condition, editCondition] = useState<InputText[]>([
    { id: "1", text: "" },
  ]);

  // バリデーション用のエラーメッセージ
  const [titleErrMsg, setNameErrMsg] = useState<string>("");
  const [descriptionsErrMsg, setDescriptionErrMsg] = useState<string>("");
  const [conditionsErrMsg, setConditionErrMsg] = useState<string>("");

  // PDF表示フラグ
  const [isDisplayPDF, toggleIsDisplayPDF] = useState<boolean>(false);

  const edit = (isDescription: boolean, setData: InputText[]) => {
    if (isDescription) {
      editDescription(setData);
    } else {
      editCondition(setData);
    }
  };

  const changeTextData = (
    id: InputText["id"],
    text: string,
    isDescription: boolean
  ) => {
    const setParam = isDescription ? descriptions : condition;
    const setData = setParam.map((el) =>
      el.id === id
        ? {
            ...el,
            text,
          }
        : el
    );

    edit(isDescription, setData);
  };

  const addData = (isDescription: boolean) => {
    const setParam = isDescription ? descriptions : condition;
    const setData = [...setParam, { id: `${setParam.length + 1}`, text: "" }];

    edit(isDescription, setData);
  };

  const removeData = (id: InputText["id"], isDescription: boolean) => {
    const setParam = isDescription ? descriptions : condition;

    const setData = setParam
      .filter((el) => el.id !== id)
      .map((el, index) => {
        return {
          ...el,
          id: `${index + 1}`,
        };
      });

    edit(isDescription, setData);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    const checkName = !!name;
    const checkDescriptions = descriptions.some((el) => el.text);
    const checkConditions = condition.some((el) => el.text);

    // バリデーション
    setNameErrMsg(!checkName ? "同意書のタイトルを入力してください。" : "");
    setDescriptionErrMsg(
      !checkDescriptions ? "最低でも文章は1つ入力してください。" : ""
    );
    setConditionErrMsg(
      !checkConditions ? "最低でも条件は1つ入力してください。" : ""
    );

    // バリデーションが問題ないならPDFを表示
    toggleIsDisplayPDF(checkName && checkDescriptions && checkConditions);
  };

  const onReset = () => {
    toggleIsDisplayPDF(false);
    changeName("");
    editDescription([{ id: "1", text: "" }]);
    editCondition([{ id: "1", text: "" }]);
  };

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
                  {!!titleErrMsg ? (
                    <span className="text-red-500 text-xs ml-2">
                      {titleErrMsg}
                    </span>
                  ) : null}
                </label>
                <Input
                  name="title"
                  value={name}
                  placeholder={!name ? "(貴方の名前を入力)" : undefined}
                  className="block w-full"
                  changeText={changeName}
                />
              </div>

              <div className="mt-2">
                <div>
                  説明文
                  {!!descriptionsErrMsg ? (
                    <span className="text-red-500 text-xs ml-3">
                      {descriptionsErrMsg}
                    </span>
                  ) : null}
                </div>
                {descriptions.length ? (
                  <ul className="mt-4">
                    {descriptions.map((el) => (
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
                            changeTextData(el.id, text, true)
                          }
                        />
                        {el.id !== "1" ? (
                          <button
                            type="button"
                            onClick={() => removeData(el.id, true)}
                            className="ml-2 w-8 h-8 bg-red-400 font-bold text-3xl rounded-full shadow-2xl text-white flex items-center justify-center"
                          >
                            <span>-</span>
                          </button>
                        ) : (
                          <span className="ml-2 w-8" />
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div>
                  <button
                    type="button"
                    onClick={() => addData(true)}
                    className="ml-2 w-8 h-8 bg-blue-400 font-bold text-3xl rounded-full shadow-2xl text-white flex items-center justify-center"
                  >
                    <span>+</span>
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <ul>
                  {condition.map((el) => (
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
                          changeTextData(el.id, text, false)
                        }
                      />
                      {el.id !== "1" ? (
                        <button
                          type="button"
                          onClick={() => removeData(el.id, false)}
                          className="ml-2 w-8 h-8 bg-red-400 font-bold text-3xl rounded-full shadow-2xl text-white flex items-center justify-center"
                        >
                          <span>-</span>
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {!!conditionsErrMsg ? (
                  <div className="text-red-500 text-xs">{conditionsErrMsg}</div>
                ) : null}
                <div>
                  <button
                    type="button"
                    onClick={() => addData(false)}
                    className="ml-2 w-8 h-8 bg-blue-400 font-bold text-3xl rounded-full shadow-2xl text-white flex items-center justify-center"
                  >
                    <span>+</span>
                  </button>
                </div>
              </div>
              <div className="text-center">
                <input
                  type="submit"
                  value="同意書を作成"
                  className="border border-2 border-slate-500 rounded py-2 px-3 bg-orange-300 border-orange-600 cursor-pointer"
                />
                {isDisplayPDF ? (
                  <button
                    type="button"
                    className="ml-3 border border-2 border-slate-500 rounded py-2 px-3 bg-slate-500 border-slate-800 text-white"
                    onClick={onReset}
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
              {name ? name : "(名前)"}を飲食の場に誘うことに関する同意書
            </div>
            <p>
              私、
              <span className="underline">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              (以下、甲)は、{name ? name : "(名前)"}
              (以下、乙)を飲食の場に誘うことに対して、下記の全ての項目に同意いたします。
            </p>
            {descriptions.length === 1 && !descriptions[0].text ? (
              <p>(同意書の文書)</p>
            ) : (
              descriptions.map((el) => {
                return <p key={`desc-prev-${el.id}`}>{el.text}</p>;
              })
            )}
            <div className="text-center text-lg font-bold">記</div>
            {condition.length === 1 && !condition[0].text ? (
              <p>(同意してもらうことの文書)</p>
            ) : (
              <ul>
                {condition.map((el) => {
                  return (
                    <li key={`condition-prev-${el.id}`}>
                      {el.id}.{el.text}
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="text-right underline mt-4">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
            </div>
            <div className="text-right underline mt-4">
              氏名
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;印
            </div>
            <div className="text-right underline mt-4">
              住所:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </div>
      </div>
      {isDisplayPDF ? (
        <PDFViewer width="100%" height="100%" className="h-[600px] px-32">
          <Document
            title="石津勲人を飲食の場に誘うことに関する同意書"
            language="Japanese"
          >
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Text>{name}を飲食の場に誘うことに関する同意書</Text>
              </View>
              <View style={styles.section}>
                <Text>Sectiあksじゃk</Text>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      ) : null}
    </main>
  );
}

export default App;
