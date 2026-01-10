import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { toast } from "@/components/compound/Sonner";
import EmptyState from "@/components/shared/EmptyState";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useCanGoBack } from "@/hooks/useCanGoBack";
import { useToggle } from "@/hooks/useToggle";
import { userApiService } from "@/infrastructure/UserApiService";
import { routeConstants } from "@/routes/routeConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MapPin, Plus, RefreshCcw, Save, User } from "lucide-react";
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
  const navigate = useNavigate();
  const isEditMode = action === "edit" && customerId && customerId !== "new";

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

  const handleGoBack = useCallback(() => {
    navigate(routeConstants.customerList);
  }, [navigate]);

  return (
    <ScreenContainer>
      <div className="flex justify-end">
        <Button
          startIcon={<ArrowLeft size={18} />}
          variant="outline"
          onClick={handleGoBack}
          className="border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          Back to Customers
        </Button>
      </div>

      {isFetching ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-slate-500">Loading customer details...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Card */}
          {isEditMode && data && (
            <div className="lg:col-span-1">
              <ProfileCard customer={data} />
            </div>
          )}

          {/* Right Column - Form and Addresses */}
          <div className={isEditMode ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="flex flex-col gap-6">
              <CustomerForm
                action={action}
                defaultValue={defaultData}
                id={customerId}
              />
              {isEditMode && customerId && (
                <AddressSection customerId={customerId} />
              )}
            </div>
          </div>
        </div>
      )}
    </ScreenContainer>
  );
};

type ProfileCardProps = {
  customer: {
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    createdAt: Date | string;
  };
};

const ProfileCard: FC<ProfileCardProps> = ({ customer }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          {customer.name ? (
            <span className="text-2xl font-semibold text-orange-600">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="h-10 w-10 text-orange-600" />
          )}
        </div>

        {/* Name */}
        <h3 className="mb-1 text-lg font-semibold text-slate-800">
          {customer.name || "Unnamed Customer"}
        </h3>

        {/* Status Badge */}
        <span
          className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            customer.isActive
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              customer.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {customer.isActive ? "Active" : "Inactive"}
        </span>

        {/* Contact Info */}
        <div className="w-full space-y-3 border-t border-slate-100 pt-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Email
            </span>
            <span className="mt-0.5 text-sm text-slate-600">
              {customer.email}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Phone
            </span>
            <span className="mt-0.5 text-sm text-slate-600">
              {customer.phone || "-"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Customer Since
            </span>
            <span className="mt-0.5 text-sm text-slate-600">
              {prettyDate(customer.createdAt)}
            </span>
          </div>
        </div>
      </div>
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
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h4 className="mb-6 text-lg font-semibold text-slate-800">
        Customer Information
      </h4>
      <form id="customer-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

          {isEditMode && (
            <div className="flex items-center gap-3 md:col-span-2">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-200"></div>
              </label>
              <label htmlFor="isActive" className="text-sm text-slate-600">
                Customer is active
              </label>
              {errors.isActive && (
                <p className="text-sm text-red-500">{errors.isActive.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <Button
            startIcon={<RefreshCcw size={18} />}
            variant="outline"
            color="neutral"
            onClick={handleReset}
            type="button"
            className="border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Reset
          </Button>
          <Button
            startIcon={<Save size={18} />}
            type="submit"
            isLoading={isSubmitting || isSaving}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isEditMode ? "Save Changes" : "Create Customer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

type AddressSectionProps = {
  customerId: string;
};

const AddressSection: FC<AddressSectionProps> = ({ customerId }) => {
  const {
    data: addresses,
    isFetching,
    refetch,
  } = useFetchUserAddresses(customerId, false);
  const { isOpen, open, close } = useToggle();

  const handleAddressSaved = useCallback(() => {
    refetch();
  }, [refetch]);

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

  const getAddressTypeIcon = (type: string) => {
    const baseClasses = "h-4 w-4";
    switch (type) {
      case "home":
        return <MapPin className={`${baseClasses} text-blue-500`} />;
      case "work":
        return <MapPin className={`${baseClasses} text-purple-500`} />;
      default:
        return <MapPin className={`${baseClasses} text-slate-500`} />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-800">Addresses</h4>
        <Button
          startIcon={<Plus size={16} />}
          variant="outline"
          size="sm"
          onClick={open}
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          Add Address
        </Button>
      </div>

      {isFetching && (
        <div className="py-8 text-center text-sm text-slate-500">
          Loading addresses...
        </div>
      )}

      {!isFetching && addresses && addresses.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="No addresses yet"
          description="Add a delivery address for this customer."
          actionLabel="Add Address"
          onAction={open}
        />
      )}

      {!isFetching && addresses && addresses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAddressTypeIcon(address.type)}
                  <span className="font-medium text-slate-800">
                    {getAddressTypeLabel(address.type)}
                    {address.otherAddressLabel &&
                      ` - ${address.otherAddressLabel}`}
                  </span>
                </div>
                {address.isDefault && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    Default
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm text-slate-600">
                <p className="font-medium text-slate-700">{address.name}</p>
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
              <div className="mt-3 border-t border-slate-200 pt-2 text-xs text-slate-400">
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

export default CustomerDetailsScreen;
