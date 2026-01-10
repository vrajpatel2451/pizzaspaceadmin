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
import { Check } from "lucide-react";

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

  const features = [
    "Unlimited menu items and categories",
    "Real-time order tracking",
    "Staff management & permissions",
    "Advanced analytics dashboard",
    "Customer management system",
    "Multi-store support",
  ];

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Visual Panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-900 lg:block">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />

        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12">
          <div className="max-w-lg">
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-400">
                <span className="flex h-2 w-2 rounded-full bg-orange-500" />
                Join 500+ restaurants
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
                Start managing your restaurant today
              </h1>
              <p className="text-lg text-slate-400">
                Everything you need to run your food business, in one powerful platform.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/30 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                    <Check className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Bottom badge */}
            <div className="mt-10 flex items-center justify-center gap-6">
              <div className="flex -space-x-2">
                {["JD", "AK", "MR", "LS"].map((initials, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700 text-xs font-medium text-white"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-400">
                <span className="font-semibold text-white">4.9/5</span> from 200+ reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          {/* Logo and Header */}
          <div className="mb-8 flex flex-col items-center">
            <Logo />
            <h1 className="mt-6 text-2xl font-bold text-slate-800">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Get started with Pizza Space Admin
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full name"
                placeholder="John Doe"
                fullWidth
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                fullWidth
                label="Email address"
                placeholder="name@company.com"
                type="email"
                required
                {...register("email")}
                error={errors.email?.message}
              />
              <Input
                label="Password"
                togglePassword
                placeholder="Create a strong password"
                type="password"
                fullWidth
                {...register("password")}
                error={errors.password?.message}
              />
              <Input
                label="Admin key"
                togglePassword
                placeholder="Enter your admin key"
                fullWidth
                {...register("apiKey")}
                error={errors.apiKey?.message}
              />

              {/* Password requirements hint */}
              <p className="text-xs text-slate-400">
                Password must be at least 6 characters long
              </p>

              {/* Submit Button */}
              <Button
                fullWidth
                type="submit"
                isLoading={isSubmitting || loginInProgress}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Create account
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <span
                className="cursor-pointer font-semibold text-orange-500 hover:text-orange-600"
                onClick={() => nav(routeConstants.login)}
              >
                Sign in
              </span>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By creating an account, you agree to our{" "}
            <span className="cursor-pointer text-slate-600 hover:text-orange-500">Terms of Service</span>
            {" "}and{" "}
            <span className="cursor-pointer text-slate-600 hover:text-orange-500">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
