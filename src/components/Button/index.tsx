import { HTMLAttributes } from "react";

const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      {...props}
    />
  );
};

export default Button;
