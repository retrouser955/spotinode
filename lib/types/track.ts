export interface APITrack {
    album: {
        album_type: string;
        total_tracks: number;
        available_markets: string[];
        external_urls: {
            spotify: string;
        };
        herf: string;
        id: string;
        images: {
            url: string;
            height: number;
            width: number;
        }[];
        name: string;
        release_data: string;
        release_date_precision: "year"|"month"|"day";
        restrictions: {
            reason: "market"|"product"|"explicit";
        };
        type: "album";
        uri: string;
        copyrights: {
            text: string;
            type: string;
        }[];
        external_ids: {
            isrc: string;
            ean: string;
            upc: string;
        };
        genres: string[];
        label: string[];
        popularity: number;
        album_group: "album"|"single"|"compilation"|"appears_on";
        artists: {
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            name: string;
            type: "artist";
            uri: string;
        }[];
    };
    artists: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: "artist";
        uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: number;
    external_ids: {
        isrc: string;
        ean: string;
        upc: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: object;
    restrictions: {
        reason: "market"|"product"|"explicit";
    };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: "track";
    uri: string;
    is_local: boolean;
}

export interface FormattedTrack {
    raw: APITrack;
    title: string;
    artist: {
        name: string;
        url: string;
    }[];
    duration: string;
    url: string;
    thumbnail: string;
}