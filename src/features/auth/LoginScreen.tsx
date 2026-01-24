import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Checkbox } from "@/components/base/Checkbox";
import Logo from "@/components/shared/Logo";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { HomePageRedirect } from "@/routes/PrivateRoutes";
import { routeConstants } from "@/routes/routeConstants";
import { useFCMToken } from "@/firebase/hooks/useFCMToken";
import { Bell } from "lucide-react";

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

  // FCM Token
  const {
    fcmToken,
    tokenError,
    isTokenLoading,
    permissionStatus,
    initializeFCM,
  } = useFCMToken();

  // Initialize FCM on mount
  useEffect(() => {
    initializeFCM();
  }, [initializeFCM]);

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    // Ensure FCM token is available
    let token = fcmToken;
    if (!token) {
      token = await initializeFCM();
    }

    if (!token) {
      return; // Don't proceed without FCM token
    }

    signInSubmit(data.email, data.password, token);
  };

  const handleEnableNotifications = async () => {
    await initializeFCM();
  };

  if (isLoggedIn) {
    if (redirectFrom) {
      return <Navigate to={redirectFrom} />;
    }
    return <HomePageRedirect />;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Visual Panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-900 lg:block">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />

        {/* Decorative circles */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-2xl" />

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
          <div className="max-w-lg text-center">
            {/* Pizza icon with glow */}
            <div className="mb-10 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-orange-500/20 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
                  <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
              Pizza Space Admin
            </h1>
            <p className="mb-12 text-lg text-slate-400">
              Your complete restaurant management solution
            </p>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm">
                <div className="mb-1 text-2xl font-bold text-orange-500">50+</div>
                <div className="text-xs text-slate-400">Active Stores</div>
              </div>
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm">
                <div className="mb-1 text-2xl font-bold text-orange-500">10K+</div>
                <div className="text-xs text-slate-400">Daily Orders</div>
              </div>
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm">
                <div className="mb-1 text-2xl font-bold text-orange-500">99.9%</div>
                <div className="text-xs text-slate-400">Uptime</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-10 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm">
              <p className="mb-4 text-sm italic text-slate-300">
                "The best admin panel we've ever used. It's transformed how we manage our restaurants."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-sm font-semibold text-orange-500">
                  JD
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">John Doe</div>
                  <div className="text-xs text-slate-400">Restaurant Owner</div>
                </div>
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                <button
                  type="button"
                  className="text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </button>
              </div>

              {/* Notification Permission Status */}
              {permissionStatus === "denied" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="flex items-start gap-2">
                    <Bell className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        Notifications Required
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Please enable notifications in your browser settings to continue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {permissionStatus === "default" && !fcmToken && !isTokenLoading && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-start gap-2">
                    <Bell className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">
                        Enable Notifications
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Notifications are required to receive order updates.
                      </p>
                      <button
                        type="button"
                        onClick={handleEnableNotifications}
                        className="mt-2 text-xs font-medium text-amber-700 hover:text-amber-800 underline"
                      >
                        Click here to enable
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {tokenError && permissionStatus !== "denied" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{tokenError}</p>
                  <button
                    type="button"
                    onClick={handleEnableNotifications}
                    className="mt-1 text-xs font-medium text-red-700 hover:text-red-800 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {fcmToken && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-green-700">Notifications enabled</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                fullWidth
                type="submit"
                isLoading={isSubmitting || loginInProgress || isTokenLoading}
                disabled={!fcmToken && permissionStatus === "denied"}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isTokenLoading ? "Setting up notifications..." : "Sign in"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <span
                className="cursor-pointer font-semibold text-orange-500 hover:text-orange-600"
                onClick={() => nav(routeConstants.register)}
              >
                Create account
              </span>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By signing in, you agree to our{" "}
            <span className="cursor-pointer text-slate-600 hover:text-orange-500">Terms of Service</span>
            {" "}and{" "}
            <span className="cursor-pointer text-slate-600 hover:text-orange-500">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
