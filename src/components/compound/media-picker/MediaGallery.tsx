import { WindowsFileIcon } from "@/components/icons/icons";
import type { FileResponse } from "@/types/file.types";
import { cn } from "@/utils/helpers";
import { useState } from "react";
import GroupMediaList from "./GroupMediaList";
import SearchMediaList from "./SearchMediaList";
import { useFetchAllFolders } from "./hooks";

interface MediaGalleryProps {
  multiple?: boolean;
  selectedMedia?: FileResponse[];
  onImageClick: (media: FileResponse) => void;
  searchVal: string;
}

const MediaGallery: React.FC<MediaGalleryProps> = (props) => {
  const { onImageClick, multiple = false, selectedMedia, searchVal } = props;

  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const { data: mediaGroups, isFetching: isLoading } = useFetchAllFolders();

  if (isLoading) {
    return (
      <div className={cn(wrapperClasses)}>
        {Array(15)
          .fill(null)
          .map((_, i) => (
            <div className="shimmer h-[38px] w-full" key={i} />
          ))}
      </div>
    );
  }

  const handleClick = (val: string) => {
    setSelectedGroup(val);
  };

  const handleBackClick = () => {
    setSelectedGroup("");
  };

  return (
    <div className="min-h-[156px]">
      {searchVal && searchVal.trim().length > 0 ? (
        <SearchMediaList
          onImageClick={onImageClick}
          searchVal={searchVal}
          selectedMedia={selectedMedia}
        />
      ) : selectedGroup ? (
        <GroupMediaList
          name={selectedGroup}
          onBackClick={handleBackClick}
          onImageClick={onImageClick}
          multiple={multiple}
          selectedMedia={selectedMedia}
        />
      ) : (
        <div className={cn(wrapperClasses)}>
          {mediaGroups?.map((name, index) => (
            <button
              onClick={() => handleClick(name)}
              key={index}
              className="dark:border-nd-500 border-nl-100 hover:bg-nl-50/60 hover:dark:bg-nd-700 flex cursor-pointer items-center gap-x-2 rounded-lg border px-3 py-2 text-left"
            >
              <span className="block size-5">
                <WindowsFileIcon />
              </span>
              <p className="text-nl-700 dark:text-nd-100 truncate">{name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const wrapperClasses = `grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5`;

export default MediaGallery;
