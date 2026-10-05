"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { IoIosSearch } from "react-icons/io"
import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"

const formSchema = z.object({
  search: z.string()
})

export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.get("search") || ""

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: currentSearch,
    },
  })

  useEffect(() => {
    form.reset({ search: currentSearch })
  }, [currentSearch, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const trimmed = values.search.trim()

    if (trimmed) {
      setSearchParams({ search: trimmed })
    } else {
      setSearchParams({})
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const hasError = !!form.formState.errors.search

  return (
    <div className="w-full md:flex-1 flex flex-col gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row w-full relative"
          aria-label="Search form"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <label htmlFor="search-input" className="sr-only">
                      Search posts
                    </label>

                    <Input
                      id="search-input"
                      placeholder="Search Pinterest"
                      {...field}
                      className="w-full bg-white pr-12"
                      aria-label="Search Pinterest"
                      aria-invalid={hasError ? "true" : "false"}
                      aria-describedby={hasError ? "search-error" : undefined}
                    />

                    <button
                      type="submit"
                      aria-label="Submit search"
                      className="absolute inset-y-0 right-2 flex items-center justify-center cursor-pointer"
                    >
                      <IoIosSearch size={24} aria-hidden="true" />
                    </button>
                  </div>
                </FormControl>

                <FormMessage id="search-error" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
