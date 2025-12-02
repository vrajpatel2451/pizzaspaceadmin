import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import { toast } from "@/components/compound/Sonner";
import { useCanGoBack } from "@/hooks/useCanGoBack";
import { useToggle } from "@/hooks/useToggle";
import { userApiService } from "@/infrastructure/UserApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { AddressResponse } from "@/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, RefreshCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import { useFetchCustomerDetails } from "./hooks";
import { useFetchUserAddresses } from "@/features/user/hooks";
import AddressDialog from "@/features/user/AddressDialog";
import { prettyDate } from "@/utils/formatDateTime";

type CustomerAction = "create" | "edit";

type Params = {
  action: CustomerAction;
  customerId: string;
};

export const CustomerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  isActive: z.boolean().optional(),
});

type CustomerFormFields = z.infer<typeof CustomerFormSchema>;

const CustomerDetailsScreen = () => {
  const { customerId, action } = useParams<Params>();
  const isEditMode = action === "edit" && customerId && customerId !== "new";

  const brdcrb = useMemo(
    () => breadcrumbs(action, customerId),
    [action, customerId],
  );

  const { data, isFetching, refetch } = useFetchCustomerDetails(
    customerId,
    true,
  );

  useEffect(() => {
    if (isEditMode) {
      refetch();
    }
  }, [isEditMode, refetch]);

  const defaultData = useMemo<CustomerFormFields>(() => {
    if (data && isEditMode) {
      return {
        email: data.email,
        name: data.name,
        phone: data.phone,
        isActive: data.isActive,
      };
    } else {
      return {
        email: "",
        name: "",
        phone: "",
        isActive: true,
      };
    }
  }, [data, isEditMode]);

  return (
    <div className="flex w-full flex-col gap-4 px-8 py-4">
      <Breadcrumbs breadcrumbs={brdcrb} />
      {isFetching && <div>Loading...</div>}
      {!isFetching && (
        <>
          <CustomerForm
            action={action}
            defaultValue={defaultData}
            id={customerId}
          />
          {isEditMode && customerId && (
            <AddressSection customerId={customerId} />
          )}
        </>
      )}
    </div>
  );
};

type FormProps = {
  defaultValue: CustomerFormFields;
  action: CustomerAction;
  id: string;
};

const CustomerForm: FC<FormProps> = (props) => {
  const { defaultValue, action, id } = props;
  const isEditMode = action === "edit" && id && id !== "new";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormFields>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: defaultValue,
  });

  const handleReset = useCallback(() => {
    reset(defaultValue);
  }, [reset, defaultValue]);

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();
  const canGoBack = useCanGoBack();
  const nav = useNavigate();

  const onSubmit = useCallback<SubmitHandler<CustomerFormFields>>(
    async (formData) => {
      startSaving();

      const apiCall = isEditMode
        ? userApiService.updateUser(id, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            isActive: formData.isActive,
          })
        : userApiService.createUser({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          });

      const { success, errorMessage } = await apiCall;

      if (success) {
        if (canGoBack) {
          nav(-1);
        } else {
          nav(routeConstants.customerList);
        }
        toast.success(
          isEditMode
            ? "Customer updated successfully"
            : "Customer created successfully",
        );
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      stopSaving();
    },
    [isEditMode, id, canGoBack, nav, startSaving, stopSaving],
  );

  return (
    <form
      id="customer-form"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <h4 className="mb-4 text-lg font-medium">Customer Information</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Name"
            placeholder="Enter customer name"
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
          <Input
            label="Phone"
            placeholder="Enter phone number"
            type="tel"
            required
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>
      </div>

      {isEditMode && (
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Customer Status</h4>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-sm">
              Customer is active
            </label>
          </div>
          {errors.isActive && (
            <p className="mt-1 text-sm text-red-500">
              {errors.isActive.message}
            </p>
          )}
        </div>
      )}

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
  );
};

type AddressSectionProps = {
  customerId: string;
};

const AddressSection: FC<AddressSectionProps> = ({ customerId }) => {
  const { data: addresses, isFetching, refetch } = useFetchUserAddresses(
    customerId,
    false,
  );
  const { isOpen, open, close } = useToggle();

  const handleAddressSaved = useCallback(
    (_address: AddressResponse) => {
      refetch();
    },
    [refetch],
  );

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case "home":
        return "Home";
      case "work":
        return "Work";
      case "other":
        return "Other";
      default:
        return type;
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-medium">Addresses</h4>
        <Button startIcon={<Plus size={16} />} variant="outline" onClick={open}>
          Add Address
        </Button>
      </div>

      {isFetching && <div className="text-sm text-gray-500">Loading addresses...</div>}

      {!isFetching && addresses && addresses.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
          No addresses found. Click "Add Address" to add one.
        </div>
      )}

      {!isFetching && addresses && addresses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-nl-50 dark:bg-nd-800 rounded-lg border p-4 dark:border-gray-700"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="font-medium">
                    {getAddressTypeLabel(address.type)}
                    {address.otherAddressLabel && ` - ${address.otherAddressLabel}`}
                  </span>
                </div>
                {address.isDefault && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Default
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium">{address.name}</p>
                <p>{address.phone}</p>
                <p>
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                </p>
                <p>
                  {address.area}, {address.county}
                </p>
                <p>
                  {address.country} - {address.zip}
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Added: {prettyDate(address.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressDialog
        userId={customerId}
        isOpen={isOpen}
        onClose={close}
        onSave={handleAddressSaved}
      />
    </div>
  );
};

const breadcrumbs = (
  action: CustomerAction,
  id: string,
): BreadcrumbItem[] => [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Customers",
    to: routeConstants.customerList,
  },
  {
    label: action === "create" ? "Create Customer" : "Edit Customer",
    to: routeConstants.customerDetails
      .replace(":action", action || "create")
      .replace(":customerId", id || "new"),
  },
];

export default CustomerDetailsScreen;
