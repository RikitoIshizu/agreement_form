import { InputText, InputDataEnums } from "./type";

type Props = {
  id?: InputText["id"];
  isAdd: boolean;
  editParamsName: InputDataEnums;
  onClickEvent: Function;
};

const CircleButton = (props: Props): JSX.Element => {
  const bgColor = props.isAdd ? " bg-blue-400 " : " bg-red-400";
  return (
    <button
      type="button"
      className={`ml-2 w-8 h-8 font-bold text-3xl rounded-full shadow-2xl text-white flex items-center justify-center${bgColor}`}
      onClick={() => props.onClickEvent(props.id, props.editParamsName)}
    >
      <span>{props.isAdd ? "+" : "-"}</span>
    </button>
  );
};

export default CircleButton;
