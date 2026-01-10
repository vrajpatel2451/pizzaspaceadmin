import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Checkbox } from "@/components/base/Checkbox";
import Logo from "@/components/shared/Logo";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { HomePageRedirect } from "@/routes/PrivateRoutes";
import { routeConstants } from "@/routes/routeConstants";
import { Pizza, ChefHat, Truck, Clock } from "lucide-react";

const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .nonempty({ error: "Required*" }),
  password: z.string().nonempty({ error: "Required*" }),
});

type LoginFormFields = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  const [rememberMe, setRememberMe] = useState(false);
  const { loginInProgress, signInSubmit, isLoggedIn } = useAuth();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectFrom = useMemo(() => {
    return searchParams.get("redirectTo");
  }, [searchParams]);

  const onSubmit: SubmitHandler<LoginFormFields> = (data) => {
    console.log("Login Data:", data);
    signInSubmit(data.email, data.password);
  };

  if (isLoggedIn) {
    if (redirectFrom) {
      return <Navigate to={redirectFrom} />;
    }
    return <HomePageRedirect />;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Graphic Panel */}
      <div className="hidden w-1/2 bg-linear-to-br from-orange-500 to-orange-600 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center text-white">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-white/20 p-6">
              <Pizza className="h-16 w-16" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold">Pizza Space Admin</h2>
          <p className="mb-12 text-lg text-orange-100">
            Manage your restaurant, orders, and customers all in one place
          </p>

          {/* Feature highlights */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 rounded-lg bg-white/10 p-4">
              <ChefHat className="h-8 w-8 shrink-0" />
              <div>
                <h3 className="font-semibold">Menu Management</h3>
                <p className="text-sm text-orange-100">
                  Easily manage your menu items and categories
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-white/10 p-4">
              <Truck className="h-8 w-8 shrink-0" />
              <div>
                <h3 className="font-semibold">Order Tracking</h3>
                <p className="text-sm text-orange-100">
                  Track orders from kitchen to delivery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-white/10 p-4">
              <Clock className="h-8 w-8 shrink-0" />
              <div>
                <h3 className="font-semibold">Real-time Updates</h3>
                <p className="text-sm text-orange-100">
                  Stay updated with live order notifications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          {/* Logo and Header */}
          <div className="mb-8 flex flex-col items-center">
            <Logo />
            <h1 className="mt-6 text-2xl font-bold text-slate-800">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to your admin account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="Enter your password"
              type="password"
              fullWidth
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                size="sm"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </div>

            {/* Submit Button */}
            <Button
              fullWidth
              type="submit"
              isLoading={isSubmitting || loginInProgress}
              className="bg-orange-500! hover:bg-orange-600!"
            >
              Sign In
            </Button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <span
              className="cursor-pointer font-semibold text-orange-500 hover:text-orange-600"
              onClick={() => nav(routeConstants.register)}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
