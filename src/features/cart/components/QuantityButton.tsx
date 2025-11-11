import { IconButton } from "@/components/base/IconButton";
import Spinner from "@/components/compound/spinner/Spinner";
import { isNil } from "lodash";
import { Minus, Plus } from "lucide-react";
import { type FC } from "react";

type Props = {
  quantity: number;
  min?: number;
  max?: number;
  isLoading?: boolean;
  onChange: (quantity: number) => void;
};

const QuantityButton: FC<Props> = (props) => {
  const { onChange, quantity, min = 1, max, isLoading = false } = props;
  return (
    <div className="bg-pl-50 border-pl-500 flex items-center gap-2 rounded-lg border">
      <IconButton
        icon={Minus}
        onClick={() => {
          if (quantity > min) {
            onChange(quantity - 1);
          }
        }}
        disabled={isLoading}
        className="bg-transparent"
        iconClassName="text-pl-500"
      />
      {isLoading && <Spinner className="text-pl-500" />}
      {!isLoading && <p className="text-pl-500">{quantity}</p>}
      <IconButton
        icon={Plus}
        className="bg-transparent"
        iconClassName="text-pl-500"
        onClick={() => {
          if (isNil(max)) {
            onChange(quantity + 1);
          } else if (quantity < max) {
            onChange(quantity + 1);
          }
        }}
        disabled={isLoading}
      />
    </div>
  );
};

export default QuantityButton;
