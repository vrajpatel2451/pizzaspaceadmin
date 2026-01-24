import Dialog from "@/components/compound/Dialog";
import type { GeneralRatingResponse } from "@/types/generalRating.types";
import { useCallback, useMemo, type FC } from "react";
import GeneralRatingForm, {
  type GeneralRatingFormFields,
} from "./GeneralRatingForm";

type Props = {
  rating?: GeneralRatingResponse;
  onSave: (rating: GeneralRatingResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const GeneralRatingDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, rating } = props;
  const { _id } = rating || {};

  const initData = useMemo<GeneralRatingFormFields>(() => {
    if (rating) {
      return {
        personName: rating.personName,
        message: rating.message,
        personImage: rating.personImage || "",
        ratings: rating.ratings,
        personTagRole: rating.personTagRole || "",
        personPhone: rating.personPhone || "",
        isPublished: rating.isPublished,
      };
    }
    return {
      personName: "",
      message: "",
      personImage: "",
      ratings: 0,
      personTagRole: "",
      personPhone: "",
      isPublished: false,
    };
  }, [rating]);

  const onSubmit = useCallback(
    (data: GeneralRatingResponse) => {
      onSave(data);
      onClose();
    },
    [onClose, onSave]
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title={rating ? "Edit Rating" : "Add Rating"}
      size="md"
      subTitle={
        rating
          ? "Update the customer review details"
          : "Add a new customer review"
      }
    >
      <GeneralRatingForm
        action={rating ? "edit" : "create"}
        defaultValue={initData}
        id={_id}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default GeneralRatingDialog;
