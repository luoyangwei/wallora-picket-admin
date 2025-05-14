import { NextRequest, NextResponse } from "next/server";
import { v7 as uuidv7 } from 'uuid';
import { Response } from "../../response";
import pool from "@/lib/db";
import { Photo } from "@/lib/models";
import OSS from "ali-oss";

export async function POST(request: NextRequest) {
    const {
        id,
        url,
        authorId,
        color,
        blurHash,
        width,
        height,
        description
    } = await request.json();

    const photoId = uuidv7();

    if (!id) {
        return NextResponse.json(Response.badRequest("id is required"))
    }

    // 检查是否已经精选过
    const [inspectPhotos] = await pool.query<Photo[]>(
        `
        -- beginsql
        SELECT * FROM photos WHERE id = ?
        -- endsql
        `,
        [id]
    )

    // photo already picked
    if (inspectPhotos.length > 0) {
        return NextResponse.json(Response.pureSuccess("photo already picked"));
    }

    // 下载图片流，然后将流存储到 aliyun oss 里
    const response = await fetch(url);
    const fileType = getFileType(response.headers.get("content-type") || "");

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    console.log(`length: ${buffer.length}, type: ${fileType}`);

    // 上传图片到 oss
    const ossUrl = await uploadToOss(buffer, authorId, photoId, fileType);
    const thumbnailUrl = ossUrl + process.env.ALIYUN_OSS_PROCESS;
    console.log(ossUrl, thumbnailUrl);

    // 生成一个唯一的 id
    const photo = {
        id: photoId,
        authorId: authorId,
        blurHash: blurHash,
        width: width,
        height: height,
        color: color,
        description: description,
        url: ossUrl,
        thumbnailUrl: thumbnailUrl,
        unsplashId: id
    };

    // 将图片信息存储到数据库
    await pool.execute(
        `
        -- beginsql
        INSERT INTO photos (id, author_id, blur_hash, width, height, color, description, url, thumbnail_url, unsplash_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        -- endsql
        `,
        [photo.id, photo.authorId, photo.blurHash, photo.width, photo.height,
        photo.color, photo.description, photo.url, photo.thumbnailUrl, photo.unsplashId]
    )

    return NextResponse.json(Response.success({ url: ossUrl }))
}

function getFileType(contentType: string) {
    switch (contentType) {
        case "image/jpeg":
            return "jpg";
        case "image/png":
            return "png";
        case "image/gif":
            return "gif";
        case "image/bmp":
            return "bmp";
        case "image/webp":
            return "webp";
        case "image/tiff":
            return "tiff";
        case "image/svg+xml":
            return "svg";
        default:
            throw new Error("Unexpected value: " + contentType);
    }
}

async function uploadToOss(buffer: Buffer<ArrayBuffer>, authorId: string, id: string, fileType: string) {
    const endpoint = process.env.ALIYUN_OSS_ENDPOINT || "";
    const accessKeyId = process.env.ALIYUN_OSS_ACCESS_KEY_ID || "";
    const accessKeySecret = process.env.ALIYUN_OSS_ACCESS_KEY_SECRET || "";
    const bucket = process.env.ALIYUN_OSS_BUCKET || "";
    console.log(accessKeyId, accessKeySecret, bucket);

    if (!accessKeyId || !accessKeySecret || !bucket) {
        throw new Error("OSS 配置错误");
    }

    const oss = new OSS({ endpoint, accessKeyId, accessKeySecret, bucket })

    const key = "photo/" + authorId + "/" + id + "." + fileType;
    oss.put(key, buffer);

    const { url } = await oss.put(key, buffer);
    console.log(url);
    return url
}