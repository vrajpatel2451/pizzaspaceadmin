import type { ReactNode } from "react";
import Dialog from "./Dialog";

interface DeleteDialogProps {
  title?: string;
  name?: string;
  isOpen: boolean;
  close: () => void;
  onDelete: () => void;
  content?: ReactNode;
  isDeleting?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
  const {
    close,
    isOpen,
    title = "Delete",
    name,
    onDelete,
    content,
    isDeleting,
  } = props;

  return (
    <Dialog
      title={title}
      isOpen={isOpen}
      close={close}
      actions={{
        primary: {
          label: "Delete",
          onClick: onDelete,
          loading: isDeleting,
        },
        secondary: {
          label: "Cancel",
          onClick: close,
          variant: "filled",
          color: "neutral",
        },
      }}
    >
      <h6 className="text-nl-600 dark:text-nd-200">
        Are you sure you want to delete{" "}
        <span className="text-nl-700 dark:text-nd-50 text-base! font-semibold">
          {" "}
          {name}{" "}
        </span>
        ?
      </h6>
      {content && content}
    </Dialog>
  );
};

export default DeleteDialog;
