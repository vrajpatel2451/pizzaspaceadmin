import Dialog from "@/components/compound/Dialog";
import type { LogoResponse } from "@/types/logo.types";
import { useCallback, useMemo, type FC } from "react";
import LogoForm, { type LogoFormFields } from "./LogoForm";

type Props = {
  logo?: LogoResponse;
  onSave: (logo: LogoResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const LogoDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, logo } = props;
  const { _id } = logo || {};

  const initData = useMemo<LogoFormFields>(() => {
    if (logo) {
      return {
        logoImage: logo.logoImage,
        type: logo.type,
        theme: logo.theme,
        isPublished: logo.isPublished,
      };
    }
    return {
      logoImage: "",
      type: "header",
      theme: "dark",
      isPublished: false,
    };
  }, [logo]);

  const onSubmit = useCallback(
    (data: LogoResponse) => {
      onSave(data);
      onClose();
    },
    [onClose, onSave]
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Logo"
      size="md"
      subTitle="Add or edit logo for your website"
    >
      <LogoForm
        action={logo ? "edit" : "create"}
        defaultValue={initData}
        id={_id}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default LogoDialog;
