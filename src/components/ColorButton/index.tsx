const ColorButton = ({
  color,
  selected,
  onClick,
}: {
  color: "ORANGE" | "GREEN" | "PURPLE";
  selected?: boolean;
  onClick?: VoidFunction;
}) => {
  let bgColor = "bg-orange-500";
  if (color === "GREEN") {
    bgColor = "bg-green-500";
  } else if (color === "PURPLE") {
    bgColor = "bg-purple-500";
  }

  let selectedBorder = selected ? "border border-gray-800 border-2" : "";

  return (
    <button
      type="button"
      className={`w-4 h-4 ${bgColor} ${selectedBorder}`}
      onClick={onClick}
    ></button>
  );
};

export default ColorButton;
