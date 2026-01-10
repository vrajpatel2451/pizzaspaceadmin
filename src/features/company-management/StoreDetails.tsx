import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import type { ParsedAddress } from "@/components/compound/address-picker";
import ImageComponent from "@/components/compound/ImageComponent";
import { toast } from "@/components/compound/Sonner";
import UploadImagePlaceholder from "@/components/compound/UploadImagePlaceHolder";
import MediaPicker from "@/components/compound/media-picker/MediaPicker";
import ScreenContainer from "@/components/shared/ScreenContainer";
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
import StoreLocationPicker from "./components/StoreLocationPicker";
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
  const isEditMode = action === "edit";
  const { data, isFetching, refetch } = useFetchStoreDetails(storeId, true);

  useEffect(() => {
    if (isEditMode && storeId) {
      refetch();
    }
  }, [isEditMode, refetch, storeId]);

  const defaultData = useMemo<StoreFormFields>(() => {
    if (data && isEditMode) {
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
  }, [data, isEditMode]);

  if (isFetching && isEditMode) {
    return (
      <ScreenContainer>
        <div className="flex h-64 items-center justify-center">
          <div className="text-slate-500">Loading store details...</div>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StoreForm action={action} defaultValue={defaultData} id={storeId} />
    </ScreenContainer>
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
    watch,
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
    [action, canGoBack, id, nav, startSaving, stopSaving]
  );

  const handleRemovePhoto = () => {
    setValue("imageUrl", "", { shouldValidate: true });
  };

  // Handle location selection from map picker
  const handleLocationChange = useCallback(
    (address: ParsedAddress) => {
      setValue("lat", address.lat, { shouldValidate: true });
      setValue("long", address.long, { shouldValidate: true });
      setValue("line1", address.line1, { shouldValidate: true });
      setValue("line2", address.line2 || "", { shouldValidate: true });
      setValue("area", address.area, { shouldValidate: true });
      setValue("city", address.city, { shouldValidate: true });
      setValue("county", address.county, { shouldValidate: true });
      setValue("country", address.country, { shouldValidate: true });
      setValue("zip", address.zip, { shouldValidate: true });
    },
    [setValue]
  );

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
      <form id="store-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Input
                label="Store Name"
                placeholder="Enter store name"
                required
                {...register("name")}
                error={errors.name?.message}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Store Photo
              </label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => {
                  return (
                    <div className="cursor-pointer">
                      {field.value ? (
                        <ImageComponent
                          src={field.value}
                          alt="Store photo"
                          wrapperClassName="size-32"
                          className="size-32 rounded-xl border-2 border-slate-200 object-cover"
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
                <p className="mt-2 text-sm text-red-600">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              type="tel"
              required
              {...register("phone")}
              error={errors.phone?.message}
            />
            <Input
              label="Email Address"
              placeholder="Enter email address"
              type="email"
              required
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
        </div>

        {/* Store Location Section */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Store Location
          </h3>
          <StoreLocationPicker
            lat={watch("lat")}
            long={watch("long")}
            line1={watch("line1")}
            line2={watch("line2")}
            area={watch("area")}
            city={watch("city")}
            county={watch("county")}
            country={watch("country")}
            zip={watch("zip")}
            onLocationChange={handleLocationChange}
            error={errors.lat?.message || errors.long?.message}
          />
        </div>

        {/* Delivery Settings Section */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Delivery Settings
          </h3>
          <div className="max-w-xs">
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

        {/* Store Status Section */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Store Status
          </h3>
          <Controller
            name="isActive"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-800">Store is Active</p>
                  <p className="text-sm text-slate-500">
                    Enable this to make the store visible and operational
                  </p>
                </div>
                <Switch checked={value} setChecked={onChange} />
              </div>
            )}
          />
          {errors.isActive && (
            <p className="mt-2 text-sm text-red-600">
              {errors.isActive.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            startIcon={<RefreshCcw className="h-4 w-4" />}
            variant="outline"
            color="neutral"
            onClick={handleReset}
            type="button"
          >
            Reset
          </Button>
          <Button
            startIcon={<Save className="h-4 w-4" />}
            type="submit"
            isLoading={isSubmitting || isSaving}
          >
            {action === "edit" ? "Update Store" : "Create Store"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default StoreDetails;
