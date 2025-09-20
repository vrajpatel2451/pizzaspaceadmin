import { cn } from "@/utils/helpers";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  required?: boolean;
}

const Label: React.FC<LabelProps> = (props) => {
  const { className = "", children, required = false, ...rest } = props;

  return (
    <div className="flex items-center justify-between">
      <label
        className={cn("text-nl-700 text-sm font-normal", className)}
        {...rest}
      >
        {children}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </label>
    </div>
  );
};

export default Label;
