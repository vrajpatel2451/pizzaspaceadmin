import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Logo from "@/components/shared/Logo";
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
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 px-4 py-8">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo and Header */}
        <div className="mb-8 flex flex-col items-center">
          <Logo />
          <h1 className="mt-4 text-2xl font-bold text-slate-800">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register a new admin account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            fullWidth
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            fullWidth
            label="Email"
            placeholder="Enter your email"
            type="email"
            required
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            togglePassword
            placeholder="Create a password"
            type="password"
            fullWidth
            {...register("password")}
            error={errors.password?.message}
          />
          <Input
            label="Admin Key"
            togglePassword
            placeholder="Enter admin key"
            fullWidth
            {...register("apiKey")}
            error={errors.apiKey?.message}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            isLoading={isSubmitting || loginInProgress}
            className="bg-orange-500! hover:bg-orange-600!"
          >
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <span
            className="cursor-pointer font-semibold text-orange-500 hover:text-orange-600"
            onClick={() => nav(routeConstants.login)}
          >
            Sign in here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
