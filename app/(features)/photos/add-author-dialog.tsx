'use client'

import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";

import { debounce } from "lodash"
import { useMemo, useState } from "react";
import { Codes, type BaseResponse } from "@/app/api/response";


interface AddAuthorDialogProps {
    onSuccess: (creator: string) => void;
    onError?: (error: Error) => void;
}

const fetchAddAuthor = async (creator: string) => {
    const response = await fetch("/api/author", {
        method: "POST",
        body: JSON.stringify({ creator })
    })

    return await response.json() as BaseResponse;
}

export function AddAuthorDialog(props: AddAuthorDialogProps) {
    const { onSuccess, onError } = props;
    const [creator, setCreator] = useState<string>("");

    const mutation = useMutation({
        mutationFn: (creator: string) => fetchAddAuthor(creator),
        onSuccess: (data: BaseResponse) => {
            console.log("🚀 ~ AddAuthorDialog ~ data:", data)
            if (data.code === Codes.CODE_SUCCESS || data.code === Codes.CODE_CREATED) {
                onSuccess(creator)
            }
        },
        onError: (error) => {
            console.error(error)
            onError?.(error)
        }
    });

    const debouncedMutate = useMemo(() => {
        return debounce((data: string) => {
            mutation.mutate(data)
        }, 500, {
            leading: false,
            trailing: true,
        })
    }, [mutation])

    const submitAuthor = () => {
        debouncedMutate(creator)
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Author</DialogTitle>
                <DialogDescription>
                    Add a new author to your profile here. Click save when you&apos;re done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Creator
                    </Label>
                    <Input id="name"
                        value={creator}
                        onChange={(e) => setCreator(e.target.value)}
                        className="col-span-3" />
                </div>
            </div>

            <DialogFooter>
                <Button type="submit" onClick={submitAuthor} disabled={mutation.isPending}>
                    {mutation.isPending ? "Loading..." : "Save changes"}
                </Button>
            </DialogFooter>

        </DialogContent>
    )
}