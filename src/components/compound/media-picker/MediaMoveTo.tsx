import type { SelectOption } from "@/components/base/Select";
import ImageComponent from "@/components/compound/ImageComponent";
import GroupSelector from "@/components/compound/media-picker/GroupSelector";
import type { FileResponse } from "@/types/file.types";
import type { Dispatch, SetStateAction } from "react";

interface MediaMoveToProps {
  selectedImages: FileResponse[];
  selectedGroup: SelectOption<string>;
  setSelectedGroup: Dispatch<SetStateAction<SelectOption<string>>>;
}

const MediaMoveTo: React.FC<MediaMoveToProps> = (props) => {
  const { selectedImages, selectedGroup, setSelectedGroup } = props;

  return (
    <div>
      <p className="text-nl-600 dark:text-nd-200">
        Select the folder to move following media to
      </p>
      <div className="no-scrollbar mt-3 mb-6 grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-1">
        {selectedImages?.map((e, i) => (
          <ImageComponent
            alt={e.name}
            src={e.path}
            key={i}
            className={
              "size-20 shrink-0 rounded-lg object-cover transition-all"
            }
          />
        ))}
      </div>
      <GroupSelector
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
    </div>
  );
};

export default MediaMoveTo;
