import { APITrack, FormattedTrack } from "./track";

export interface Items {
    added_at: string;
    added_by: {
        external_urls: {
            spotify: string;
        };
        followers: {
            href: string|void;
            total: number;
        };
        href: string;
        id: string;
        type: "user";
        uri: string;
        display_name: string|void;
    };
    is_local: boolean;
    track: APITrack;
}

export interface APIPlaylist {
    collaborative: boolean;
    description: string|void;
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string|void;
        total: number;
    };
    href: string;
    id: string;
    images: {
        url: string;
        height: string|void;
        width: string|void;
    }[];
    name: string;
    owner: {
        external_urls: {
            spotify: string;
        };
        followers: {
            href: string|void;
            total: number;
        };
        href: string;
        id: string;
        type: "user";
        uri: string;
        display_name: string|void;
    };
    public: boolean;
    snapshot_id: string;
    tracks: {
        href: string;
        limit: string|void;
        next: string|void;
        offset: string;
        previous: string;
        total: number;
        items: Items[];
    };
    type: string;
    uri: string;
}

export interface SimplifiedPlaylistRaw {
    raw: APIPlaylist,
    title: string;
    description: string|void;
    url: string;
    author: {
        name: string|void;
        url: string;
    },
    tracks: Array<FormattedTrack|undefined>;
    totalDuration: string;
    totalDurationMs: number;
}

export interface SimplifiedPlaylist {
    raw: APIPlaylist,
    title: string;
    description: string|void;
    url: string;
    author: {
        name: string|void;
        url: string;
    },
    tracks: FormattedTrack[];
    totalDuration: string;
    totalDurationMs: number;
}

export interface Page {
    href: string;
    items: Items[];
    limit: number;
    next: string;
    offset: number;
    previous: number;
    total: number;
}