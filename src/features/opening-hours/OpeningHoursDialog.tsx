import Dialog from "@/components/compound/Dialog";
import type { OpeningHoursResponse } from "@/types/openingHours.types";
import { useCallback, useMemo, type FC } from "react";
import OpeningHoursForm, { type OpeningHoursFormFields } from "./OpeningHoursForm";

type Props = {
  openingHours?: OpeningHoursResponse;
  onSave: (openingHours: OpeningHoursResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const OpeningHoursDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, openingHours } = props;
  const { _id } = openingHours || {};

  const initData = useMemo<OpeningHoursFormFields>(() => {
    if (openingHours) {
      return {
        day: openingHours.day,
        startTime: openingHours.startTime,
        endTime: openingHours.endTime,
        sortOrder: openingHours.sortOrder,
      };
    }
    return {
      day: "",
      startTime: "",
      endTime: "",
      sortOrder: 1,
    };
  }, [openingHours]);

  const onSubmit = useCallback(
    (data: OpeningHoursResponse) => {
      onSave(data);
      onClose();
    },
    [onClose, onSave]
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Opening Hours"
      size="md"
      subTitle="Enter opening hours details"
    >
      <OpeningHoursForm
        action={openingHours ? "edit" : "create"}
        defaultValue={initData}
        id={_id}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default OpeningHoursDialog;
