import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { HomePageRedirect } from "@/routes/PrivateRoutes";
import { routeConstants } from "@/routes/routeConstants";

const registerSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .nonempty({ error: "Required*" }),
  password: z.string().nonempty({ error: "Required*" }).min(6),
  apiKey: z.string().nonempty({ error: "Required*" }),
  name: z.string().nonempty({ error: "Required*" }),
});

type RegisterFormFields = z.infer<typeof registerSchema>;

const RegisterScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerSchema),
  });

  const { loginInProgress, registerSubmit, isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const redirectFrom = useMemo(() => {
    return searchParams.get("redirectTo");
  }, [searchParams]);

  const onSubmit: SubmitHandler<RegisterFormFields> = (data) => {
    console.log("Register Data:", data);
    registerSubmit(data.email, data.password, data.name, data.apiKey);
  };

  if (isLoggedIn) {
    if (redirectFrom) {
      return <Navigate to={redirectFrom} />;
    }
    return <HomePageRedirect />;
  }

  return (
    <div className="flex h-full w-full">
      <div className="bg-pl-50 h-full flex-1"></div>
      <form
        className="flex h-full w-[50%] flex-col items-center justify-center gap-4 px-[12%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Create New Admin</h1>
        <Input
          label="Name"
          togglePassword
          placeholder="Enter name here"
          fullWidth
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          fullWidth
          label="Email"
          placeholder="Enter email here"
          type="email"
          required
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          togglePassword
          placeholder="Enter password here"
          type="password"
          fullWidth
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          label="Admin Key"
          togglePassword
          placeholder="Enter key here"
          fullWidth
          {...register("apiKey")}
          error={errors.apiKey?.message}
        />
        <Button
          fullWidth
          type="submit"
          isLoading={isSubmitting || loginInProgress}
        >
          Register
        </Button>
        <p className="text-lg">
          Already have an account?{" "}
          <span
            className="cursor-pointer text-lg font-semibold"
            onClick={() => nav(routeConstants.login)}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterScreen;
