import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import Container from "@/components/compound/Container";
import ImageComponent from "@/components/compound/ImageComponent";
import { toast } from "@/components/compound/Sonner";
import UploadImagePlaceholder from "@/components/compound/UploadImagePlaceHolder";
import MediaPicker from "@/components/compound/media-picker/MediaPicker";
import { useCanGoBack } from "@/hooks/useCanGoBack";
import { useToggle } from "@/hooks/useToggle";
import { storeApiService } from "@/infrastructure/StoreApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { FileResponse } from "@/types/file.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import { useFetchStoreDetails } from "./hooks";

type StoreAction = "create" | "edit";

type Params = {
  action: StoreAction;
  storeId: string;
};

export const StoreUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  imageUrl: z.string().min(1, "Image is required"),
  // contact
  phone: z.string().min(1, "Phone is required"),
  email: z.email("Invalid email address"),
  // address
  deliveryRadius: z.number().positive("Delivery radius must be positive"),
  lat: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  long: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().min(1, "Address line 2 is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  county: z.string().min(1, "County is required"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(1, "ZIP code is required"),
  isActive: z.boolean(),
});

type StoreFormFields = z.infer<typeof StoreUpdateSchema>;

const StoreDetails = () => {
  const { storeId, action } = useParams<Params>();
  const brdcrb = useMemo(() => breadcrumbs(action, storeId), [action, storeId]);
  const { data, isFetching, refetch } = useFetchStoreDetails(storeId, true);

  useEffect(() => {
    if (action === "edit" && storeId) {
      refetch();
    }
  }, [action, refetch, storeId]);

  const defaultData = useMemo<StoreFormFields>(() => {
    if (data && action === "edit") {
      return {
        area: data.area,
        city: data.city,
        country: data.country,
        county: data.county,
        deliveryRadius: data.deliveryRadius,
        email: data.email,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        lat: data.lat,
        long: data.long,
        line1: data.line1,
        line2: data.line2,
        name: data.name,
        phone: data.phone,
        zip: data.zip,
      };
    } else {
      return {
        area: "",
        city: "",
        country: "",
        county: "",
        deliveryRadius: 0,
        email: "",
        imageUrl: "",
        isActive: true,
        lat: 0,
        long: 0,
        line1: "",
        line2: "",
        name: "",
        phone: "",
        zip: "",
      };
    }
  }, [data, action]);

  return (
    <div className="flex w-full flex-col gap-4 px-8 py-4">
      <Breadcrumbs breadcrumbs={brdcrb} />
      {isFetching && <div>Loading...</div>}
      {!isFetching && (
        <StoreForm action={action} defaultValue={defaultData} id={storeId} />
      )}
    </div>
  );
};

type FormProps = {
  defaultValue: StoreFormFields;
  action: StoreAction;
  id: string;
};

const StoreForm: FC<FormProps> = (props) => {
  const { defaultValue, action, id } = props;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormFields>({
    resolver: zodResolver(StoreUpdateSchema),
    defaultValues: defaultValue,
  });

  const { close, isOpen, open } = useToggle();

  const handleMediaSelect = (media: FileResponse | FileResponse[]) => {
    const selectedUrl = Array.isArray(media) ? media[0].path : media.path;
    setValue("imageUrl", selectedUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
    close();
  };

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();
  const canGoBack = useCanGoBack();
  const nav = useNavigate();
  const onSubmit = useCallback<SubmitHandler<StoreFormFields>>(
    async (props) => {
      startSaving();
      const apiCall =
        action === "edit"
          ? storeApiService.updateStores(props, id)
          : storeApiService.createStores(props);
      const { success, errorMessage } = await apiCall;
      if (success) {
        if (canGoBack) {
          nav(-1);
        } else {
          nav(routeConstants.stores);
        }
        toast.success("Details saved successfully");
      } else {
        toast.error(errorMessage);
      }
      stopSaving();
    },
    [action, canGoBack, id, nav, startSaving, stopSaving],
  );

  const handleRemovePhoto = () => {
    setValue("imageUrl", "", { shouldValidate: true });
  };

  return (
    <>
      {isOpen && (
        <MediaPicker
          isOpen
          close={close}
          multiple={false}
          acceptedFormats={["image/*"]}
          onMediaSelect={handleMediaSelect}
          onError={(error) => {
            console.error("Media picker error:", error);
          }}
        />
      )}
      <form
        id="store-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* Basic Information */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Basic Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
            <Input
              label="Store Name"
              placeholder="Enter store name"
              required
              {...register("name")}
              error={errors.name?.message}
            />

            <Container title="Store Photo">
              <div>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="cursor-pointer">
                        {field.value ? (
                          <ImageComponent
                            src={field.value}
                            alt="Category photo"
                            wrapperClassName="size-32"
                            className="border-nl-200 dark:border-nd-600 size-32 rounded-lg border-2"
                            onRemove={handleRemovePhoto}
                          />
                        ) : (
                          <UploadImagePlaceholder onClick={open} />
                        )}

                        <input type="hidden" {...field} />
                      </div>
                    );
                  }}
                />

                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>
            </Container>
          </div>
        </div>

        {/* Contact Information */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Contact Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Phone"
              placeholder="Enter phone number"
              type="tel"
              required
              {...register("phone")}
              error={errors.phone?.message}
            />
            <Input
              label="Email"
              placeholder="Enter email address"
              type="email"
              required
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Address Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Address Line 1"
              placeholder="Enter address line 1"
              required
              {...register("line1")}
              error={errors.line1?.message}
            />
            <Input
              label="Address Line 2"
              placeholder="Enter address line 2 (optional)"
              {...register("line2")}
              error={errors.line2?.message}
            />
            <Input
              label="Area"
              placeholder="Enter area"
              required
              {...register("area")}
              error={errors.area?.message}
            />
            <Input
              label="City"
              placeholder="Enter city"
              required
              {...register("city")}
              error={errors.city?.message}
            />
            <Input
              label="County"
              placeholder="Enter county"
              required
              {...register("county")}
              error={errors.county?.message}
            />
            <Input
              label="Country"
              placeholder="Enter country"
              required
              {...register("country")}
              error={errors.country?.message}
            />
            <Input
              label="ZIP Code"
              placeholder="Enter ZIP code"
              required
              {...register("zip")}
              error={errors.zip?.message}
            />
          </div>
        </div>

        {/* Location & Delivery */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Location & Delivery</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              label="Latitude"
              placeholder="Enter latitude"
              type="number"
              step="any"
              required
              {...register("lat", { valueAsNumber: true })}
              error={errors.lat?.message}
            />
            <Input
              label="Longitude"
              placeholder="Enter longitude"
              type="number"
              step="any"
              required
              {...register("long", { valueAsNumber: true })}
              error={errors.long?.message}
            />
            <Input
              label="Delivery Radius (miles)"
              placeholder="Enter delivery radius"
              type="number"
              step="0.1"
              min="0"
              required
              {...register("deliveryRadius", { valueAsNumber: true })}
              error={errors.deliveryRadius?.message}
            />
          </div>
        </div>

        {/* Store Status */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Store Status</h4>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-sm">
              Store is active
            </label>
          </div>
          {errors.isActive && (
            <p className="mt-1 text-sm text-red-500">
              {errors.isActive.message}
            </p>
          )}
        </div>
        <div className="col-span-full flex w-full items-center justify-end gap-4">
          <Button
            startIcon={<RefreshCcw size={20} />}
            variant="filled"
            color="neutral"
            onClick={handleReset}
            type="button"
          >
            Reset
          </Button>
          <Button
            startIcon={<Save className="text-white" size={20} />}
            type="submit"
            isLoading={isSubmitting || isSaving}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

const breadcrumbs = (action: StoreAction, id: string): BreadcrumbItem[] => [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Stores",
    to: routeConstants.stores,
  },
  {
    label: "Store Details",
    to: routeConstants.storesDetails
      .replace(":action", action)
      .replace(":storeId", id),
  },
];

export default StoreDetails;
