import pool from "@/lib/db";
import { Author, Photo } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";
import { Response } from "../response";
import { UnsplashPhoto } from "@/lib/unsplash";


/**
 * The URL for the Unsplash API to get photos of a user.
 */
const API_UNSPLASH_PHOTOS: (id: string) => string = (id) => `https://unsplash.com/napi/users/${id}/photos`;


/**
 * 获取作者列表
 * @param creator 作者名称
 * @returns 作者列表
 */
async function getAuthors(creator: string | null) {
    const authors = []
    if (creator) {
        const [authorsData] = await pool.query<Author[]>(
            `
                -- beginsql
                SELECT * FROM authors WHERE creator = ?
                -- endsql
                `, [creator]
        )
        authors.push(...authorsData)
    } else {
        const [authorsData] = await pool.query<Author[]>(
            `
                -- beginsql
                SELECT * FROM authors
                -- endsql
            `)
        authors.push(...authorsData)
    }
    return authors;
}

/**
 * 获取图片列表
 * @param request 请求
 * @returns 图片列表
 */
export async function POST(request: NextRequest) {
    const page = request.nextUrl.searchParams.get("page");
    const creator = request.nextUrl.searchParams.get("creator");

    // 获取作者列表
    let authors = await getAuthors(creator);
    authors = authors.filter((author) => author.creator !== "wallora_plus");

    // 获取图片列表
    const photos = await Promise.all(authors.map(async (author) => {
        const response = await fetch(`${API_UNSPLASH_PHOTOS(author.creator)}?page=${page}&per_page=10`);
        const data = await response.json() as UnsplashPhoto[];

        for (const item of data) {
            const [photos] = await pool.query<Photo[]>(`
                -- beginsql
                SELECT * FROM photos WHERE author_id = ? AND unsplash_id = ?
                -- endsql
            `, [author.id, item.id])

            if (photos.length > 0) {
                item.selected = true
            } else {
                item.selected = false
            }

            item.authorId = author.id;
        }

        return data;
    }));

    // 合并图片列表
    const mergedPhotos = photos.flat();
    return NextResponse.json(Response.success(mergedPhotos));
}