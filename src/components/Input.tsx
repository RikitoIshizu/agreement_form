type Props = {
  name: string;
  value: string;
  placeholder?: string;
  changeText: Function;
  className?: string;
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
      }`}
      onChange={(e) => props.changeText(e.target.value)}
    />
  );
}
