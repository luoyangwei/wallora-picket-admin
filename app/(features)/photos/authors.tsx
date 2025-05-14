'use client'

import { create } from 'zustand'
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AddAuthorDialog } from "./add-author-dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Codes, SuccessResponse } from "@/app/api/response";
import { type Author } from "@/lib/models";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthorStore {
    creator: string;
    setCreator: (creator: string) => void;
}

export const useAuthorStore = create<AuthorStore>((set) => ({
    creator: "",
    setCreator: (creator: string) => set({ creator }),
}))

/**
 * 作者列表
 * @param onChangeCreator 
 * @returns 
 */
export function Authors() {
    const [openAddAuthorDialog, setOpenAddAuthorDialog] = useState<boolean>(false);
    const { setCreator } = useAuthorStore()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["getAuthor"],
        queryFn: async () => {
            const response = await fetch("/api/author", { method: "GET" })
            if (!response.ok) {
                throw new Error("Failed to fetch authors");
            }
            const { code, data } = await response.json() as SuccessResponse<Author[]>
            if (code !== Codes.CODE_SUCCESS) {
                throw new Error("Failed to fetch authors");
            }
            return data;
        }
    })

    /**
     * 添加作者对话框关闭
     * 关闭后重新获取数据
     */
    const handleAddAuthorDialogClose = (creator: string) => {
        setOpenAddAuthorDialog(false);
        setCreator(creator);
        refetch();
    }

    return (
        <>
            {
                isLoading
                    ?
                    <Skeleton className="w-full h-10 whitespace-nowrap" />
                    :
                    // 图片作者，可以通过 add 增加作者，然后下面的图片会展示出作者的图库
                    <Dialog
                        open={openAddAuthorDialog}
                        onOpenChange={() => setOpenAddAuthorDialog(!openAddAuthorDialog)}>

                        <div className="flex items-center gap-2 py-4 flex-wrap">
                            {data && data.map((item, index) => (
                                <Author author={item} key={index} />
                            ))}
                            <DialogTrigger asChild>
                                <Button variant="link">Add Author</Button>
                            </DialogTrigger>
                        </div>

                        <AddAuthorDialog onSuccess={handleAddAuthorDialogClose} />
                    </Dialog >
            }
        </>
    )
}

/**
 * 作者
 * @param author 
 * @returns 
 */
export function Author({ author }: { author: Author }) {
    const { creator, setCreator } = useAuthorStore()

    return (
        <Badge
            variant={`${author.creator === creator ? "default" : "outline"}`}
            onClick={() => setCreator(author.creator)}
        >
            @{author.creator}
        </Badge>
    )
}