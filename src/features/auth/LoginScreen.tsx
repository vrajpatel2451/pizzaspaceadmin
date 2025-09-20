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
    <div className="flex h-full w-full">
      <div className="bg-pl-50 h-full flex-1"></div>
      <form
        className="flex h-full w-[50%] flex-col items-center justify-center gap-4 px-[12%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Login to see details</h1>
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
        <Button
          fullWidth
          type="submit"
          isLoading={isSubmitting || loginInProgress}
        >
          Login
        </Button>

        <p className="text-lg">
          Don't have an account?{" "}
          <span
            className="cursor-pointer text-lg font-semibold"
            onClick={() => nav(routeConstants.register)}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
