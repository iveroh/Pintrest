import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/authContext";
import { CreateUserDocument } from "@/graphql/generated"
import image from "@/assets/welcome_beer.png"
import { useMutation } from "@apollo/client/react";
import AvatarCropImage from "../../../components/AvatarCropImage";
import { useImageUpload } from "@/hooks/useImageUpload";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { uploadImage } = useImageUpload();

  const formSchema = z
    .object({
      username: z
        .string()
        .toLowerCase()
        .trim()
        .refine((s) => !/\s/.test(s), {
          message: "Username cannot contain spaces.",
        })
        .min(2, "Username must be at least 2 characters long"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { errors } = form.formState;

  const [createUser] = useMutation(CreateUserDocument);

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      let avatarUrl = "https://github.com/shadcn.png";
      let avatar_public_id = "";

      if (avatarFile) {
        try {
          const result = await uploadImage(avatarFile);
          avatarUrl = result.url;
          avatar_public_id = result.public_id;
        } catch (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          form.setError("root", {
            type: "manual",
            message:
              "Failed to upload avatar. Please try again or continue without an avatar.",
          });
          return;
        }
      }

      const user = await createUser({
        variables: {
          userData: {
            display_name: data.username,
            username: data.username,
            email: data.email,
            password_hash: data.password,
            avatar_path: avatarUrl,
            avatar_public_id: avatar_public_id,
          },
        },
      });

      if (user.data?.createUser) {
        localStorage.setItem("token", user.data.createUser.token);
        await refetchUser();
        navigate("/");
      }
    } catch (error: unknown) {
      console.error("Error creating user:", error);

      const message = error instanceof Error ? error.message : String(error ?? "");
      if (
        message.includes("Unique constraint failed") &&
        message.includes("username")
      ) {
        form.setError("username", {
          type: "manual",
          message: "Username already taken",
        });
      } else if (
        message.includes("Unique constraint failed") &&
        message.includes("email")
      ) {
        form.setError("email", {
          type: "manual",
          message: "Email already in use",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message: "Failed to create account. Please try again.",
        });
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden mt-10 p-0">
        <CardContent className="grid p-0 md:grid-cols-2 md:h-[700px]">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="p-6 md:p-8 overflow-y-auto"
            aria-labelledby="signup-heading"
            aria-describedby={
              errors.root?.message ? "form-error" : undefined
            }
            noValidate
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-4 text-center">
                <h1
                  id="signup-heading"
                  className="text-2xl font-bold"
                >
                  Create your Pintrest account
                </h1>

                <div className="flex flex-col items-center">
                  <AvatarCropImage onImageCropped={setAvatarFile} />
                </div>
              </div>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                  aria-invalid={!!errors.username || undefined}
                  aria-describedby={[
                    "username-description",
                    errors.username ? "username-error" : null,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined}
                  {...form.register("username")}
                />
                {errors.username && (
                  <p
                    id="username-error"
                    className="text-sm text-red-500 mt-1"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.username.message}
                  </p>
                )}
                <FieldDescription id="username-description">
                  You&apos;ll use this username to sign in to your account.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  aria-invalid={!!errors.email || undefined}
                  aria-describedby={
                    errors.email ? "email-error" : undefined
                  }
                  {...form.register("email")}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-sm text-red-500 mt-1"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <Field className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      aria-invalid={!!errors.password || undefined}
                      aria-describedby={[
                        "password-description",
                        errors.password ? "password-error" : null,
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined}
                      {...form.register("password")}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      aria-invalid={!!errors.confirmPassword || undefined}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                      {...form.register("confirmPassword")}
                    />
                  </Field>
                </Field>

                <FieldDescription id="password-description">
                  Must be at least 8 characters long.
                </FieldDescription>

                {errors.password && (
                  <p
                    id="password-error"
                    className="text-sm text-red-500 mt-1"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.password.message}
                  </p>
                )}
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="text-sm text-red-500 mt-1"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>

              {errors.root?.message && (
                <FieldDescription
                  id="form-error"
                  className="text-sm text-red-500 text-center"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.root.message}
                </FieldDescription>
              )}

              <Field>
                <Button type="submit">
                  Create Account
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a href="/signin">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div
            className="relative hidden md:block bg-[#FEF6E5]"
            aria-hidden="true"
          >
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center hidden">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
