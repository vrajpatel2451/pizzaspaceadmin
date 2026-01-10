import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Select, type SelectOption } from "@/components/base/Select";
import Switch from "@/components/base/Switch";
import { toast } from "@/components/compound/Sonner";
import ScreenContainer from "@/components/shared/ScreenContainer";
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

const roleOptions: SelectOption[] = [
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

const StaffDetailsScreen = () => {
  const { staffId, action } = useParams<Params>();
  const isEditMode = action === "edit";
  const { data, isFetching, refetch } = useFetchStaffDetails(staffId, true);

  useEffect(() => {
    if (isEditMode && staffId) {
      refetch();
    }
  }, [isEditMode, refetch, staffId]);

  const { storeId } = data || {};
  const { data: storeDetails, refetch: fetchStores } = useFetchStoreDetails(
    storeId,
    true
  );
  useEffect(() => {
    if (storeId) {
      fetchStores();
    }
  }, [storeId, fetchStores]);

  const defaultData = useMemo<StaffFormFields>(() => {
    if (data && isEditMode) {
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
        role: "" as any,
        storeId: "",
      };
    }
  }, [data, isEditMode]);

  if (isFetching && isEditMode) {
    return (
      <ScreenContainer>
        <div className="flex h-64 items-center justify-center">
          <div className="text-slate-500">Loading staff details...</div>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StaffForm
        action={action}
        defaultValue={defaultData}
        id={staffId}
        selectedStoreInfo={storeDetails}
      />
    </ScreenContainer>
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
  const isEditMode = action === "edit";
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
    []
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
    [action, canGoBack, id, nav, startSaving, stopSaving]
  );

  return (
    <form id="staff-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Personal Information Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-6 text-lg font-semibold text-slate-800">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="Enter staff member's name"
            required
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Email Address"
            placeholder="Enter email address"
            type="email"
            required
            {...register("email")}
            error={errors.email?.message}
          />
          {!isEditMode && (
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

      {/* Role & Assignment Section */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-6 text-lg font-semibold text-slate-800">
          Role & Assignment
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Controller
            name="role"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  label="Role"
                  options={roleOptions}
                  value={roleOptions.find((e) => e.value === value)}
                  onChange={(val) => onChange((val as any).value)}
                  placeholder="Select role"
                  error={errors.role?.message}
                />
              );
            }}
          />
          <Controller
            name="storeId"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  label="Assigned Store"
                  isLoading={isStoreFetching}
                  options={storeOptions}
                  value={storeOptions.find((e) => e.value === value)}
                  onChange={(val) => onChange((val as any).value)}
                  placeholder="Select store"
                  error={errors.storeId?.message}
                />
              );
            }}
          />
        </div>
      </div>

      {/* Staff Status Section */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-6 text-lg font-semibold text-slate-800">
          Account Status
        </h3>
        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-800">Account is Active</p>
                <p className="text-sm text-slate-500">
                  Enable this to allow the staff member to access the system
                </p>
              </div>
              <Switch checked={value} setChecked={onChange} />
            </div>
          )}
        />
        {errors.isActive && (
          <p className="mt-2 text-sm text-red-600">{errors.isActive.message}</p>
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
          {isEditMode ? "Update Staff" : "Create Staff"}
        </Button>
      </div>
    </form>
  );
};

export default StaffDetailsScreen;
