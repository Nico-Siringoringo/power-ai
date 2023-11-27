"use client"

import * as z from "zod";
import axios from "axios";
import Heading from "@/components/heading"
import { useRouter } from "next/navigation";

import { VideoIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./constants";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import secureLocalStorage from "react-secure-storage";

const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        setVideo(undefined);

        const response = await axios.post("/api/video", {
            prompt: values.prompt,
            api: secureLocalStorage.getItem('replicateapi')
        })

        setVideo(response.data[0]);
        form.reset()
    } catch (error: any) {
        console.log(error);
        form.reset()
    } finally {
        router.refresh();
    }
  };

  return (
    <div>
        <Heading
            title="Video Generation"
            description="Transform your prompt into video"
            icon={VideoIcon}
            iconColor="text-indigo-500"
            bgColor="bg-indigo-500/20"
        />
        <div className="px-4 lg:px-8">
            <div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="
                        rounded-lg
                        border
                        w-full
                        p-4
                        px-3 md:px-6
                        focus-within:shadow-sm
                        grid
                        grid-cols-12
                        gap-2
                        "
                    >
                        <FormField 
                            name="prompt"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input
                                            className="border-0 outline-none
                                            focus-visible:ring-0
                                            focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="An astronouts riding a horse"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="col-span-12 lg:col-span-2
                        w-full" disabled={isLoading}>
                            Generate
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                {isLoading && (
                    <div className="p-8 rounded-lg w-full flex items-cemter justify-center bg-muted">
                        <Loader />
                    </div>
                )}
                {!video && !isLoading && (
                    <Empty label="No Video Generated" />
                )}
                {video && (
                    <video className="w-full aspect-video mt-8 roundeed-lg border bg-black" controls>
                        <source src={video}/>
                    </video>
                )}
            </div>
        </div>
    </div>
  )
}

export default VideoPage