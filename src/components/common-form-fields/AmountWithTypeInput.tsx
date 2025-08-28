import { Controller } from "react-hook-form";
import { Input } from "../base/Input";
import Select, { type SelectOption } from "../base/Select";
import { AmountType } from "../../enums/amountType.enum";

const amountTypeOptions: SelectOption[] = [
  { label: "Fixed", value: AmountType.fix },
  { label: "Percentage", value: AmountType.percentage },
];

interface AmountTypeInputProps {
  control: any;
  name: string;
  typeName: string;
  label?: string;
  required?: boolean;
  error?: string;
}

export const AmountTypeInput = ({
  control,
  name,
  typeName,
  label,
  required,
  error,
}: AmountTypeInputProps) => {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            label={label}
            value={field.value ?? 0}
            onChange={(e) => field.onChange(e.target.valueAsNumber)}
            required={required}
            error={error}
            rightElement={
              <Controller
                name={typeName}
                control={control}
                render={({ field: typeField }) => {
                  return (
                    <Select
                      options={amountTypeOptions}
                      value={amountTypeOptions.find(
                        (opt) => opt.value === typeField.value,
                      )}
                      onChange={(val) => {
                        const option = val as SelectOption | null;
                        typeField.onChange(option?.value ?? "₹");
                      }}
                      variant="minimal"
                      isSearchable={false}
                      isMulti={false}
                      width={35}
                      menuPortalTarget={document.body}
                      placeholder={""}
                      formatOptionLabel={(option, { context }) =>
                        context === "value" ? (
                          <span>
                            {option.value === AmountType.fix ? "₹" : "%"}
                          </span>
                        ) : (
                          <span>{option.label}</span>
                        )
                      }
                    />
                  );
                }}
              />
            }
          />
        )}
      />
    </div>
  );
};
