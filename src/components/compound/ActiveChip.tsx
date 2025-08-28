import Chip from "../base/Chip";

interface ActiveChipProps {
  isActive: boolean;
}

const ActiveChip: React.FC<ActiveChipProps> = (props) => {
  const { isActive } = props;

  const label = isActive ? "True" : "False";

  return <Chip label={label} color={isActive ? "green" : "red"} />;
};

export default ActiveChip;
