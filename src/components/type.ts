export type InputText = {
  id: string;
  text: string;
};

export type InputData = {
  name: string;
  descriptions: InputText[];
  conditions: InputText[];
  cautions: InputText[];
  isDisplayPDF: boolean;
};

export type InputDataEnums = keyof Pick<
  InputData,
  "descriptions" | "conditions" | "cautions"
>;

export type ErrMsg = {
  titleErrMsg: string;
  descriptionsErrMsg: string;
  conditionsErrMsg: string;
};
