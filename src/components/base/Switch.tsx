import React from "react";

interface SwitchProps {
  checked: boolean;
  setChecked: (value: boolean) => void;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Switch: React.FC<SwitchProps> = (props) => {
  const { checked, setChecked, size = "md", loading = false } = props;

  const sizeClasses = {
    sm: {
      container: "w-8 h-5",
      slider: "w-4 h-4",
      translate: "translate-x-3",
      position: "top-0.5 left-0.5",
      spinner: "w-2 h-2 border-[1px]",
    },
    md: {
      container: "w-10 h-6",
      slider: "w-5 h-5",
      translate: "translate-x-4",
      position: "top-[2px] left-[2px]",
      spinner: "w-2.5 h-2.5 border-[1.5px]",
    },
    lg: {
      container: "w-13 h-7",
      slider: "w-6 h-6",
      translate: "translate-x-6",
      position: "top-[1.8px] left-[1.8px]",
      spinner: "w-3 h-3 border-2",
    },
  };

  const currentSize = sizeClasses[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) {
      setChecked(e.target.checked);
    }
  };

  return (
    <label
      className={`inline-block ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={loading}
        className="sr-only"
      />
      <div
        className={`${currentSize.container} relative rounded-full transition-colors duration-200 ${
          loading
            ? "bg-gray-300 dark:bg-gray-600"
            : checked
              ? "bg-sl-500 dark:bg-sd-600"
              : "bg-nl-300 dark:bg-nd-500"
        } ${
          checked && !loading
            ? "focus-within:shadow-lg focus-within:shadow-green-700/50"
            : ""
        } ${loading ? "opacity-80" : ""}`}
      >
        <div
          className={`${currentSize.slider} ${currentSize.position} absolute flex items-center justify-center rounded-full transition-all duration-200 ${
            loading
              ? "bg-gray-100 dark:bg-gray-300"
              : checked
                ? "bg-white"
                : "dark:bg-nd-100 bg-white"
          } ${
            loading
              ? checked
                ? currentSize.translate
                : "translate-x-0"
              : checked
                ? currentSize.translate
                : "translate-x-0"
          }`}
        >
          {loading && (
            <div
              className={`${currentSize.spinner} animate-spin rounded-full border-gray-400 border-t-gray-600`}
            />
          )}
        </div>
      </div>
    </label>
  );
};

export default Switch;
