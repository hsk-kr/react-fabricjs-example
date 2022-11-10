import { InputHTMLAttributes } from "react";

const Checkbox = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return <input type="checkbox" className="w-6 h-6" {...props} />;
};

export default Checkbox;
