import React from "react";
import styles from "./spinner.module.css";
import { cn } from "@/utils/helpers";

type SpinnerProps = {
  size?: number;
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size = 16, className } = props;

  return (
    <svg
      className={cn(
        `${styles.spinner} stroke-nl-600 dark:stroke-nd-300`,
        className,
      )}
      viewBox="0 0 50 50"
      style={{
        width: size + "px",
        height: size + "px",
      }}
    >
      <circle
        className={styles.path}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
  );
};

export default Spinner;
