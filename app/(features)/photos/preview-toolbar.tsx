'use client'

import { Codes, SuccessResponse } from "@/app/api/response";
import { IconLoader, IconSquaresSelected } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { OverlayRenderProps } from "react-photo-view/dist/types";
import { toast } from "sonner"

interface PickPhotoRequest {
    id: string;
    url: string;
    authorId: string;
    color: string;
    blurHash: string;
    width: number;
    height: number;
    description?: string;
}

export default function PreviewToolbar(props: OverlayRenderProps) {
    const { images, index } = props

    const fetchPickPhoto = async (request: PickPhotoRequest) => {
        const response = await fetch("/api/photos/pick", {
            method: "POST",
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error("Failed to pick photo")
        }
        const { code, data } = await response.json() as SuccessResponse<{ url: string }>
        if (code !== Codes.CODE_SUCCESS) {
            throw new Error("Failed to pick photo")
        }
        toast.success("图片已精选")
        return data
    }

    const mutate = useMutation({
        mutationFn: fetchPickPhoto
    })

    const handleSelect = () => {
        const photo = images[index]
        if (photo.originRef && photo.originRef.current) {
            const element = photo.originRef.current as HTMLElement;
            const authorId = element.getAttribute("photo-author-id");
            const id = element.getAttribute("photo-id");
            const color = element.getAttribute("photo-color");
            const blurHash = element.getAttribute("photo-blur-hash");
            const width = element.getAttribute("photo-width");
            const height = element.getAttribute("photo-height");
            const description = element.getAttribute("photo-description");

            mutate.mutate({
                id: id || "",
                url: photo.src || "",
                authorId: authorId || "",
                color: color || "",
                blurHash: blurHash || "",
                width: parseInt(width || "0"),
                height: parseInt(height || "0"),
                description: description || ""
            })
        }
    }

    return (<>
        {mutate.isPending
            ? <IconLoader className="animate-spin" />
            : <IconSquaresSelected onClick={handleSelect} className="cursor-pointer text-background/75 hover:text-background transition-all" />}

    </>)
}