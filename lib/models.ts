import { RowDataPacket } from "mysql2/promise";

/**
 * -- auto-generated definition
 * -- beginsql
CREATE TABLE author
(
    id          VARCHAR(36)                         NOT NULL
        PRIMARY KEY,
    name        VARCHAR(36)                         NULL,
    avatar      VARCHAR(255)                        NULL,
    creator     VARCHAR(36)                         NULL,
    introduce   VARCHAR(255)                        NOT NULL,
    locations   VARCHAR(255)                        NOT NULL,
    unsplash_id VARCHAR(12)                         NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at  DATETIME                            NULL
);
-- endsql
 */
interface Author extends RowDataPacket {
    id: string;
    name: string;
    avatar: string;
    creator: string;
    introduce: string;
    locations: string;
    unsplash_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export type { Author };


/**
 * -- auto-generated definition
 * -- beginsql
CREATE TABLE photo
(
    id            VARCHAR(36)                         NOT NULL
        PRIMARY KEY,
    author_id     VARCHAR(36)                         NOT NULL,
    blur_hash     VARCHAR(50)                         NULL,
    width         INT                                 NOT NULL,
    height        INT                                 NOT NULL,
    color         VARCHAR(16)                         NULL,
    description   VARCHAR(255)                        NULL,
    url           VARCHAR(255)                        NOT NULL,
    thumbnail_url VARCHAR(255)                        NOT NULL,
    unsplash_id   VARCHAR(12)                         NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at    DATETIME                            NULL
);
-- endsql
 */
interface Photo extends RowDataPacket {
    id: string;
    author_id: string;
    blur_hash: string;
    width: number;
    height: number;
    color: string;
    description: string;
    url: string;
    thumbnail_url: string;
    unsplash_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export type { Photo };