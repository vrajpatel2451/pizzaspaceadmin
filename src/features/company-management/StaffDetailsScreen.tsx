import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Select, type SelectOption } from "@/components/base/Select";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import { toast } from "@/components/compound/Sonner";
import { useCanGoBack } from "@/hooks/useCanGoBack";
import { useToggle } from "@/hooks/useToggle";
import { authApiService } from "@/infrastructure/AuthApiService";
import { staffApiService } from "@/infrastructure/StaffApiService";
import { routeConstants } from "@/routes/routeConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import { omit, uniqBy } from "lodash";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import {
  useFetchStaffDetails,
  useFetchStoreDetails,
  useFetchStoreList,
} from "./hooks";
import type { StoreQueryParams, StoreResponse } from "./types/StoreTypes";

type StaffAction = "create" | "edit";

type Params = {
  action: StaffAction;
  staffId: string;
};

export const StaffUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  role: z.enum(["manager", "delivery_boy", "kitchen"]),
  storeId: z.string().min(1, "Store is required"),
  isActive: z.boolean(),
  password: z.string().optional(),
});

type StaffFormFields = z.infer<typeof StaffUpdateSchema>;

const StoreDetails = () => {
  const { staffId, action } = useParams<Params>();
  const brdcrb = useMemo(() => breadcrumbs(action, staffId), [action, staffId]);
  const { data, isFetching, refetch } = useFetchStaffDetails(staffId, true);

  useEffect(() => {
    if (action === "edit" && staffId) {
      refetch();
    }
  }, [action, refetch, staffId]);

  const { storeId } = data || {};
  const { data: storeDetails, refetch: fetchStores } = useFetchStoreDetails(
    storeId,
    true,
  );
  useEffect(() => {
    if (storeId) {
      fetchStores();
    }
  }, [storeId, fetchStores]);

  const defaultData = useMemo<StaffFormFields>(() => {
    if (data && action === "edit") {
      return {
        email: data.email,
        isActive: data.isActive,
        name: data.name,
        role: data.role as any,
        storeId: data.storeId,
      };
    } else {
      return {
        email: "",
        isActive: false,
        name: "",
        role: "",
        storeId: "",
      };
    }
  }, [data, action]);

  return (
    <div className="flex w-full flex-col gap-4 px-8 py-4">
      <Breadcrumbs breadcrumbs={brdcrb} />
      {isFetching && <div>Loading...</div>}
      {!isFetching && (
        <StaffForm
          action={action}
          defaultValue={defaultData}
          id={staffId}
          selectedStoreInfo={storeDetails}
        />
      )}
    </div>
  );
};

type FormProps = {
  defaultValue: StaffFormFields;
  action: StaffAction;
  id: string;
  selectedStoreInfo?: StoreResponse;
};
const StaffForm: FC<FormProps> = (props) => {
  const { defaultValue, action, id, selectedStoreInfo } = props;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormFields>({
    resolver: zodResolver(StaffUpdateSchema),
    defaultValues: defaultValue,
  });

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

  const stQuery = useMemo<StoreQueryParams>(
    () => ({
      limit: 10,
      page: 1,
      search: "",
    }),
    [],
  );
  const { data: storeMetaData, isFetching: isStoreFetching } =
    useFetchStoreList(stQuery);
  const { data: storeList = [] } = storeMetaData || {};
  const storeOptions = useMemo(() => {
    const storeOptions = storeList.map((e) => ({
      label: e.name,
      value: e._id,
    }));
    if (selectedStoreInfo) {
      storeOptions.push({
        label: selectedStoreInfo.name,
        value: selectedStoreInfo._id,
      });
    }
    return uniqBy(storeOptions, (e) => e.value);
  }, [storeList, selectedStoreInfo]);

  const onSubmit = useCallback<SubmitHandler<StaffFormFields>>(
    async (props) => {
      startSaving();
      const apiCall =
        action === "edit"
          ? staffApiService.updateStaff(id, omit(props, ["password"]) as any)
          : authApiService.register({
              email: props.email,
              name: props.name,
              password: props.password,
              role: props.role as any,
              storeId: props.storeId,
            });
      const { success, errorMessage } = await apiCall;
      if (success) {
        if (canGoBack) {
          nav(-1);
        } else {
          nav(routeConstants.staff);
        }
        toast.success("Details saved successfully");
      } else {
        toast.error(errorMessage);
      }
      stopSaving();
    },
    [action, canGoBack, id, nav, startSaving, stopSaving],
  );

  return (
    <>
      <form
        id="staff-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* Basic Information */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Staff Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Name"
              placeholder="Enter staff name"
              required
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              placeholder="Enter email address"
              type="email"
              required
              {...register("email")}
              error={errors.email?.message}
            />
            <Controller
              name={`role`}
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Role"
                    options={options}
                    value={options.find((e: any) => e.value == value)}
                    onChange={(val) => onChange((val as any).value)}
                    placeholder={"Select role"}
                    error={errors.role?.message}
                  />
                );
              }}
            />
            <Controller
              name={`storeId`}
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Store"
                    isLoading={isStoreFetching}
                    options={storeOptions}
                    value={storeOptions.find((e: any) => e.value == value)}
                    onChange={(val) => onChange((val as any).value)}
                    placeholder={"Select store"}
                    error={errors.storeId?.message}
                  />
                );
              }}
            />
            {/* Password field - only visible when creating new staff */}
            {action === "create" && (
              <Input
                label="Password"
                placeholder="Enter password"
                type="password"
                required
                {...register("password")}
                error={errors.password?.message}
              />
            )}
          </div>
        </div>

        {/* Staff Status */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Staff Status</h4>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-sm">
              Staff is active
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

const options: SelectOption[] = [
  {
    label: "Manager",
    value: "manager",
  },
  {
    label: "Delivery Boy",
    value: "delivery_boy",
  },
  {
    label: "Kitchen",
    value: "kitchen",
  },
];

const breadcrumbs = (action: StaffAction, id: string): BreadcrumbItem[] => [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Stores",
    to: routeConstants.stores,
  },
  {
    label: "Staff Details",
    to: routeConstants.storesDetails
      .replace(":action", action)
      .replace(":storeId", id),
  },
];

export default StoreDetails;
