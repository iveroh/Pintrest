import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { LoginDocument } from "@/graphql/generated";
import { useAuth } from "@/context/authContext";
import image from "@/assets/login_beer.png"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const formSchema = z.object({
    username: z.string().min(2, "Username must be atleast 2 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [login] = useMutation(LoginDocument);

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      const parsed = formSchema.parse(data);
      await login({
        variables: {
          username: parsed.username.toLowerCase(),
          password: parsed.password,
        },
        onCompleted: async ({ login }) => {
          console.log("Login successful", login);
          localStorage.setItem("token", login.token);
          await refetchUser();
          navigate("/");
        },
      });
    } catch (error) {
      console.error("Login failed: ", error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "An unexpected error occurred";
      setLoginError(message);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="p-6 md:p-8"
            aria-labelledby="signin-heading"
            aria-describedby={loginError ? "login-error" : undefined}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 id="signin-heading" className="text-2xl font-bold">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Pintrest account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  required
                  {...form.register("username")}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline hidden"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...form.register("password")}
                />
              </Field>

              <Field>
                <Button type="submit">
                  Login
                </Button>
              </Field>

              <FieldDescription
                id="login-error"
                className="text-center"
                aria-live="polite"
              >
                {loginError && (
                  <span
                    className="text-sm text-red-500 text-center"
                    role="alert"
                  >
                    {loginError}
                  </span>
                )}
              </FieldDescription>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <a href="/signup">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block" aria-hidden="true">
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
