/**
 * {
    id: "itsw9-2qowc",
    slug: "sunlight-and-shadows-play-on-a-tall-building-itsw9-2qowc",
    alternative_slugs: {},
    created_at: "2025-05-06T06:38:42Z",
    updated_at: "2025-05-12T14:27:53Z",
    promoted_at: null,
    width: 4128,
    height: 6192,
    color: "#0c2626",
    blur_hash: "LZFhq,~BD*NHt7s:j[R*NHR*bHf6",
    description: null,
    alt_description: "Sunlight and shadows play on a tall building.",
    breadcrumbs: [ ],
    urls: {},
    links: {},
    likes: 1,
    liked_by_user: false,
    current_user_collections: [ ],
    sponsorship: null,
    topic_submissions: { },
    asset_type: "photo",
    premium: false,
    plus: false,
    user: {},
    pinned: null
    }
 * 
 */
interface UnsplashPhoto {
    id: string;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    description: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    },
    authorId: string;
    selected: boolean;
}


interface UnsplashUser {
    id: string,
    username: string,
    name: string,
    bio: string, // as "introduce"
    location: string, // use "," to split
    profile_image: {
        small: string,
        medium: string,
        large: string,
    },
}

export type {
    UnsplashPhoto,
    UnsplashUser
}