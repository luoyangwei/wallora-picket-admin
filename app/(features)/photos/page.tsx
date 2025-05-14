import { Button } from "@/components/ui/button";

import PhotoData from "./photos-data";
import pool from "@/lib/db";
import { Photo } from "@/lib/models";

export default async function PhotosPage() {
    const [photos] = await pool.query<Photo[]>(
        `
        -- beginsql

        SELECT * FROM photos

        -- endsql
        `,
        []
    )
    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Photos</h1>
                    <p className="text-muted-foreground">
                        Photos are a way to store your photos.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Button>Add Photo</Button>
                    <p className="text-muted-foreground">已精选 {photos.length} 张图片</p>
                </div>
            </div>

            <PhotoData />
        </>
    )
}