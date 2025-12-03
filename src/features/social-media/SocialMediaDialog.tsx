import Dialog from "@/components/compound/Dialog";
import type { SocialMediaResponse } from "@/types/socialMedia.types";
import { useCallback, useMemo, type FC } from "react";
import SocialMediaForm, { type SocialMediaFormFields } from "./SocialMediaForm";

type Props = {
  socialMedia?: SocialMediaResponse;
  onSave: (socialMedia: SocialMediaResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const SocialMediaDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, socialMedia } = props;
  const { _id } = socialMedia || {};

  const initData = useMemo<SocialMediaFormFields>(() => {
    if (socialMedia) {
      return {
        name: socialMedia.name,
        logo: socialMedia.logo,
        link: socialMedia.link,
      };
    }
    return {
      name: "",
      logo: "",
      link: "",
    };
  }, [socialMedia]);

  const onSubmit = useCallback(
    (data: SocialMediaResponse) => {
      onSave(data);
      onClose();
    },
    [onClose, onSave]
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Social Media"
      size="md"
      subTitle="Add or edit social media link"
    >
      <SocialMediaForm
        action={socialMedia ? "edit" : "create"}
        defaultValue={initData}
        id={_id}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default SocialMediaDialog;
