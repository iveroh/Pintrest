"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  comment: z
    .string()
    .min(1, {
      message: "Comment must be at least 1 characters.",
    })
    .max(100, {
      message: "Comment cant be more than 100 characters.",
    }),
});

export function CommentForm({
  previousDescription,
  submitFunctionType,
}: {
  previousDescription?: string;
  submitFunctionType: (description: string) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: previousDescription || "",
    },
  });

  const hasError = !!form.formState.errors.comment;

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitFunctionType(values.comment);
    form.reset({
      comment: "",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row m-1 w-full"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div>
                  <label
                    htmlFor="comment-input"
                    className="sr-only"
                  >
                    {previousDescription ? "Edit comment" : "Add a comment"}
                  </label>

                  <Input
                    id="comment-input"
                    placeholder={previousDescription || "Add a comment"}
                    {...field}
                    className="w-full"
                    aria-label={previousDescription ? "Edit comment" : "Add a comment"}
                    aria-invalid={hasError ? "true" : "false"}
                    aria-describedby={hasError ? "comment-error" : undefined}
                  />
                </div>
              </FormControl>
              <FormMessage id="comment-error" />
            </FormItem>
          )}
        />

        <Button
          variant="secondary"
          effect="ripple"
          className="mr-2 ml-2 hover:scale-100"
          type="submit"
        >
          Post
        </Button>
      </form>
    </Form>
  );
}
