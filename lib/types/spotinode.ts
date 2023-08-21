export interface SpotiNodeOptions {
    refershOnIntervals?: boolean;
    onReady?: () => any|Promise<any>
}

export interface SpotifyAPIResponse {
    clientId: string;
    accessToken: string;
    accessTokenExpirationTimestampMs: number;
    isAnonymous: boolean;
}