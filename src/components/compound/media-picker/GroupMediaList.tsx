import Checkbox from "@/components/base/Checkbox";
import { IconButton } from "@/components/base/IconButton";
import { useToggle } from "@/hooks/useToggle";
import type { FileQueryParams, FileResponse } from "@/types/file.types";
import { cn } from "@/utils/helpers";
import { ArrowLeft, Check } from "lucide-react";
import { useMemo, useState } from "react";
import Dialog from "../Dialog";
import ImageComponent from "../ImageComponent";
import MenuItem from "../MenuItem";
import Pagination, { type PaginationProps } from "../Pagination";
import { Popover } from "../Popover";
import { useFetchFileList } from "./hooks";
import MediaInfo from "./MediaInfo";

interface GroupMediaListProps {
  name: string;
  onBackClick: () => void;
  multiple?: boolean;
  selectedMedia?: FileResponse[];
  onImageClick: (media: FileResponse) => void;
}

const GroupMediaList: React.FC<GroupMediaListProps> = ({
  name,
  onBackClick,
  onImageClick,
  selectedMedia,
  multiple,
}) => {
  const [selectedContext, setSelectedContext] = useState<FileResponse | null>();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const { isOpen: isOpenContextMenu, toggle: toggleContextMenu } = useToggle();
  const {
    close: closeMediaInfo,
    isOpen: isOpenMediaInfo,
    open: openMediaInfo,
  } = useToggle();

  const [currentPage, setCurrentPage] = useState(1);
  const qParams = useMemo<FileQueryParams>(
    () => ({
      folder: name,
      limit: 10,
      page: currentPage,
      sortBy: "updatedAt",
      sortOrder: "desc",
    }),
    [currentPage, name],
  );
  const { data, isFetching: isLoading } = useFetchFileList(qParams);

  const { data: allMedia = [], meta } = data || {};
  const paginationProps = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: setCurrentPage,
    }),
    [meta],
  );
  // const allMedia = data?.pages.flatMap((page) => page.data) ?? [];

  const handleImageSelect = (media: FileResponse) => {
    onImageClick(media);
  };

  const isAllSelected =
    allMedia.length > 0 && allMedia.every((m) => selectedMedia?.includes(m));

  const isIndeterminate =
    (selectedMedia ?? []).length > 0 &&
    !isAllSelected &&
    allMedia.length > 0 &&
    allMedia.some((m) => selectedMedia?.includes(m));

  const handleCheck = () => {
    if (isAllSelected && selectedMedia) {
      allMedia.forEach((media) => {
        if (selectedMedia.includes(media)) {
          onImageClick(media);
        }
      });
    } else {
      allMedia.forEach((media) => {
        if (selectedMedia && !selectedMedia.includes(media)) {
          onImageClick(media);
        }
      });
    }
  };

  const handleContextMenu = (
    media: FileResponse,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    toggleContextMenu();
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });
    setSelectedContext(media);
  };

  const handleCloseContextMenu = () => {
    toggleContextMenu();
    setPosition(null);
  };

  const handleDialogClose = () => {
    setSelectedContext(null);
    closeMediaInfo();
  };

  if (isLoading) {
    return (
      <div className="min-h-[218px]">
        <div className="mb-4 flex justify-between">
          <div className="shimmer h-[38px] w-72" />
          <div className="shimmer h-[38px] w-64" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <div className="shimmer size-28 shrink-0" key={i} />
            ))}
        </div>
        <div className="mt-6 flex justify-between">
          <div className="shimmer h-[28px] w-64" />
          <div className="shimmer h-[28px] w-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[218px]">
      <div className="mb-4 flex items-center gap-x-3">
        <IconButton
          icon={ArrowLeft}
          size={"sm"}
          className="dark:bg-nd-800 bg-white"
          iconClassName="text-nl-400 dark:text-nd-300"
          strokeWidth={2}
          onClick={onBackClick}
        />
        <h6 className="text-nl-700 dark:text-nd-100 mr-auto font-semibold">
          {name}
        </h6>
        {multiple && (
          <Checkbox
            label="Select all"
            onChange={handleCheck}
            checked={isAllSelected}
            indeterminate={isIndeterminate}
          />
        )}
      </div>

      <div className="no-scrollbar grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1 overflow-y-auto">
        {allMedia?.map((media, i) => {
          const isSelected = (media: FileResponse) => {
            return selectedMedia?.some((m) => m.path === media.path);
          };
          const selected = isSelected(media);

          return (
            <div
              key={i}
              className="relative"
              onContextMenu={(e) => handleContextMenu(media, e)}
            >
              <button
                onClick={() => handleImageSelect(media)}
                className={cn(
                  `fall relative block w-full rounded-lg border-2 border-transparent p-0.5 transition-all`,
                  selected && `border-pl-500 dark:border-pd-600`,
                )}
              >
                <ImageComponent
                  alt={media.name}
                  src={media.path}
                  className={cn(
                    "size-28 shrink-0 rounded-lg object-cover transition-all",
                    selected && "scale-[85%]",
                  )}
                />

                {selected && (
                  <div className="dark:bg-pd-50 absolute right-1 bottom-1 z-10 rounded-full bg-white p-1">
                    <Check
                      size={12}
                      className="dark:text-pd-500 text-pl-600"
                      strokeWidth={4}
                    />
                  </div>
                )}

                {selected && (
                  <div className="bg-pl-600/20 dark:bg-pd-500/20 absolute inset-0 rounded-lg" />
                )}
              </button>
            </div>
          );
        })}
      </div>
      <Pagination {...paginationProps} />
      <Popover
        trigger={
          <span
            className="sr-only"
            style={{
              position: "absolute",
              top: position?.y,
              left: position?.x,
            }}
          />
        }
        isOpen={isOpenContextMenu}
        onOpenChange={handleCloseContextMenu}
      >
        <div className="menu-items">
          <MenuItem startIcon="Info" onClick={openMediaInfo}>
            Info
          </MenuItem>
        </div>
      </Popover>
      <Dialog
        isOpen={isOpenMediaInfo}
        close={handleDialogClose}
        title="Media Info"
        size="lg"
      >
        {selectedContext ? (
          <MediaInfo media={selectedContext} />
        ) : (
          <div className="fall">
            <p className="text-nl-500 dark:text-nd-300">
              {" "}
              No media context selected{" "}
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default GroupMediaList;
