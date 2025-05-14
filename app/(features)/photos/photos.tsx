'use client'

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { UnsplashPhoto } from "@/lib/unsplash";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Image from "next/image";
import { IconCircleCheck } from "@tabler/icons-react";
import PreviewToolbar from "./preview-toolbar";

/**
 * unsplash 图片加载器  
 * @param {src: string, width: number, quality?: number}
 * @returns {string}
 */
const unsplashImageLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
    return `${src}&width=${width}&quality=${quality}`
}

/**
 * 图片列表
 * @param photos 
 * @returns 
 */
export function Photos({ photos }: { photos: UnsplashPhoto[] }) {
    return (
        <>
            {/* 图片列表 */}
            {/* 请求后端接口然后获取 */}
            <PhotoProvider toolbarRender={(props) => <PreviewToolbar {...props} />}>
                <div className="grid grid-cols-6 gap-4">
                    {photos.map((photo, index) => (
                        <Photo key={index} photo={photo} />
                    ))}
                </div>
            </PhotoProvider>
        </>
    )
}

/**
 * 图片
 * @param photo 
 * @returns 
 */
export function Photo({ photo }: { photo: UnsplashPhoto }) {

    return (
        <PhotoView src={photo.urls.raw}>
            <div
                photo-author-id={photo.authorId}
                photo-id={photo.id}
                photo-color={photo.color}
                photo-blur-hash={photo.blur_hash}
                photo-width={photo.width}
                photo-height={photo.height}
                photo-description={photo.description}
                photo-selected={photo.selected ? 1 : 0}
            >
                <AspectRatio ratio={1 / 1.5}>
                    <div
                        className="bg-muted/50 size-full relative">

                        <Image
                            className="object-cover"
                            loader={unsplashImageLoader}
                            fill
                            src={photo.urls.small}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={true}
                            alt={photo.id} />

                        {/* 已选中 */}
                        {
                            photo.selected && <div className="w-full h-8 bg-foreground text-background absolute inset-0 flex items-center justify-center gap-2">
                                <IconCircleCheck size={18} /> <span className="font-medium">已精选</span>
                            </div>
                        }

                    </div>
                </AspectRatio>
            </div>
        </PhotoView >
    )
}