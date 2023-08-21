const SPOTIFY_PLAYLIST_REGEX = /(^(https:)\/\/(open.spotify.com)\/(playlist|album)\/)/;

export function validateSpotifyPlaylist(url: string) {
    return SPOTIFY_PLAYLIST_REGEX.test(url)
}

export function phraseSpotifyPlaylistURL(query: string) {
    const playlistArray = query.split("?")[0].split("/")

    return `https://api.spotify.com/v1/playlists/${playlistArray[playlistArray.length - 1]}`
}