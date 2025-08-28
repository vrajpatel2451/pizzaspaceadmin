import { cn } from "@/utils/helpers";

interface VegIndicatorProps {
  type: "veg" | "non-veg";
}

const bgColorMap = {
  "non-veg": "bg-red-100 dark:bg-red-950",
  veg: "bg-green-100 dark:bg-green-950",
};
const symbolBColorMap = {
  "non-veg": "bg-red-800 dark:bg-red-300",
  veg: "bg-green-800 dark:bg-green-500",
};
const textColorMap = {
  "non-veg": "text-red-800 dark:text-red-300",
  veg: "text-green-800 dark:text-green-500",
};

const VegIndicator: React.FC<VegIndicatorProps> = (props) => {
  const { type } = props;

  return (
    <div
      className={cn(bgColorMap[type], "fall gap-x-1 rounded-lg px-2 py-1.5")}
    >
      {type === "veg" ? (
        <div className={cn("h-2 w-2 rounded-full", symbolBColorMap[type])} />
      ) : (
        <div
          style={{
            width: "12px",
            height: "10px",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          className={cn(symbolBColorMap[type])}
        />
      )}

      <span className={cn("font-medium", textColorMap[type])}>
        {type === "veg" ? "Veg" : "Non-Veg"}
      </span>
    </div>
  );
};

export default VegIndicator;
