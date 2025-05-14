'use client'

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Codes, SuccessResponse } from "@/app/api/response";
import { UnsplashPhoto } from "@/lib/unsplash";
import { IconLoader } from "@tabler/icons-react";

import { Authors, useAuthorStore } from "./authors";
import { Photos } from "./photos";

export default function PhotosData() {
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const { creator } = useAuthorStore()

    const fetchPhotos = async ({ pageParam = 1 }) => {
        const response = await fetch(`/api/photos?page=${pageParam}&creator=${creator}`, { method: "POST" })
        if (!response.ok) {
            throw new Error("Failed to fetch photos");
        }
        const { code, data } = await response.json() as SuccessResponse<UnsplashPhoto[]>
        if (code !== Codes.CODE_SUCCESS) {
            throw new Error("Failed to fetch photos");
        }
        return data;
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch
    } = useInfiniteQuery({
        queryKey: ['photos', creator],
        queryFn: fetchPhotos,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === 0 ? undefined : pages.length + 1;;
        },
        initialPageParam: 1,
    })
    const photos = data?.pages.flatMap((page) => page) || [];


    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchNextPage();
            }
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        refetch();
    }, [creator, refetch]);

    /**
     * 加载更多指示器
     * @returns 
     */
    const loaderIndicator = () => {
        if (isFetchingNextPage || isLoading) {
            return (
                <>
                    <IconLoader className="animate-spin" />
                    <span className="text-base">正在加载更多...</span>
                </>
            )
        }
        if (hasNextPage) {
            return <span className="text-base">没有更多了</span>
        }
        return <span className="text-base">没有更多了</span>
    }

    return (
        <>
            <Authors />

            <Photos photos={photos} />

            {/* 加载更多 */}
            <div ref={loadMoreRef} className="w-full mt-4 py-4 flex items-center justify-center gap-2">
                {loaderIndicator()}
            </div>
        </>
    );
}