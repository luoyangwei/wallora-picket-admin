import pool from "@/lib/db";
import { Author } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";
import { Response } from "../response";
import { UnsplashUser } from "@/lib/unsplash";
import { v7 as uuidv7 } from "uuid";
/**
 * The URL for the Unsplash API to get user information.
 */
const API_UNSPLASH_USERS: string = "https://unsplash.com/napi/users/";

/**
 * 添加作者
 * @param request {NextRequest} 请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function POST(request: NextRequest) {
    const { creator } = await request.json();

    // 查询用户的数据，然后加入到数据表里
    const response = await fetch(API_UNSPLASH_USERS + creator)
    if (!response.ok) {
        return NextResponse.json(Response.error("Author not found"), { status: 404 });
    }

    const data = await response.json() as UnsplashUser;

    const author = {
        id: uuidv7(),
        name: data.name,
        avatar: data.profile_image.medium,
        creator: creator,
        introduce: data.bio || "",
        locations: data.location ? data.location.split(",") : [],
        unsplash_id: data.id,
        created_at: new Date(),
        updated_at: new Date(),
    }

    // 检查是否已经加入过数据库，已经加入过就跳过
    const [result] = await pool.query<Author[]>(`
        -- beginsql
        SELECT * FROM authors WHERE creator = ?
        -- endsql
        `,
        [author.creator]
    )
    if (result.length > 0) {
        return NextResponse.json(Response.pureSuccess("author added"));
    }

    // 插入到数据库
    await pool.execute(
        `
        -- beginsql
        INSERT INTO authors (id, name, avatar, creator, introduce, locations, unsplash_id) VALUES (?, ?, ?, ?, ?, ?, ?)
        -- endsql
        `,
        [author.id, author.name, author.avatar, author.creator, author.introduce, author.locations, author.unsplash_id]
    )

    return NextResponse.json(Response.pureSuccess("author added"));
}

/**
 * 获取作者信息
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function GET() {
    // 查询作者信息
    const [authors] = await pool.query<Author[]>(
        `
        -- beginsql
        SELECT * FROM authors
        -- endsql
        `
    )
    return NextResponse.json(Response.success(authors));
}