type Props = {
  name: string;
  value: string;
  placeholder?: string;
  changeText: Function;
  className?: string;
  disabled?: boolean;
};

export default function Input(props: Props) {
  return (
    <input
      type="text"
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      className={`border border-2 border-slate-500 rounded h-[50px] px-2${
        props.className ? ` ${props.className}` : ""
      }${props.disabled ? "bg-gray-800" : ""}`}
      disabled={props.disabled}
      onChange={(e) => props.changeText(e.target.value)}
    />
  );
}
