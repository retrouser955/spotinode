import { SpotifyAPIResponse, SpotiNodeOptions } from "./types/spotinode";
import { default as axios, AxiosResponse } from "axios";
import { APITrack, FormattedTrack } from "./types/track";
import { msToFormatted } from "./helpers/convertTime";
import { phraseSpotifyPlaylistURL, validateSpotifyPlaylist } from "./helpers/playlists";
import { APIPlaylist, Page, SimplifiedPlaylist, SimplifiedPlaylistRaw } from "./types/playlists";

export default class SpotiNode {
    private spotifyAPIURL: string = 'https://api.spotify.com/v1';
    private spotifyTokenURL: string = 'https://open.spotify.com/get_access_token?reason=transport&productType=web_player';

    public spotifyCredentials: SpotifyAPIResponse = {
        clientId: "",
        accessToken: "",
        isAnonymous: true,
        accessTokenExpirationTimestampMs: 0
    }

    private intervaled: boolean = false

    constructor(options: SpotiNodeOptions = {}) {
        (async () => {
            await this.refreshToken(true)

            if(options.onReady) options.onReady()

            if (options.refershOnIntervals) {
                this.intervaled = true

                setInterval(async () => {
                    await this.refreshToken()
                }, 3.6e+6)
            }
        })()
    }

    private async refreshToken(force: boolean = false) {
        if (Date.now() <= this.spotifyCredentials.accessTokenExpirationTimestampMs && !force) return

        const data = await axios.get<SpotifyAPIResponse>(this.spotifyTokenURL)

        if (data.status !== 200) throw new Error("Unable to fetch anonymous token from Spotify")

        const { data: spotifyResponse } = data

        this.spotifyCredentials = spotifyResponse
    }

    validateSpotifyTrack(track: string): boolean {
        const regex = /(^(https:)\/\/(open.spotify.com)\/(track)\/)/

        return regex.test(track)
    }

    async getPlaylist(url: string, format: boolean = false) {
        if (!validateSpotifyPlaylist(url)) throw new Error("Error: the url given is not a valid Spotify playlist")

        if(!this.intervaled) await this.refreshToken()

        const axiosData = await axios.get<APIPlaylist>(phraseSpotifyPlaylistURL(url), {
            headers: {
                Authorization: `Bearer ${this.spotifyCredentials.accessToken}`
            },
            validateStatus: () => true
        })

        if(axiosData.status === 400) throw new Error("Error: Cannot find the playlist")

        if(axiosData.status !== 200) throw new Error("Error: An unknown error occoured while fetching the playlist")

        const { data: spotifyPlaylistData } = axiosData

        if(spotifyPlaylistData.tracks.next) {
            let nextPage = spotifyPlaylistData.tracks.next

            while(true) {
                const { data: tracksData } = await axios.get<Page>(nextPage, {
                    headers: {
                        Authorization: `Bearer ${this.spotifyCredentials.accessToken}`
                    }
                })

                spotifyPlaylistData.tracks.items.push(...tracksData.items)
                
                if(!tracksData.next) break

                nextPage = tracksData.next
            }
        }

        if(format) {
            const { name, description, external_urls, owner, tracks } = spotifyPlaylistData

            let duration = 0

            const returnData: SimplifiedPlaylist = {
                raw: spotifyPlaylistData,
                title: name,
                description,
                url: external_urls.spotify,
                author: {
                    name: owner.display_name,
                    url: owner.external_urls.spotify
                },
                tracks: tracks.items.filter(val => val.track != undefined).map(({ track }) => {
                    duration += track.duration_ms

                    return this.simplifyTrack(track)
                }),
                totalDuration: msToFormatted(duration),
                totalDurationMs: duration
            }

            return returnData
        }

        return spotifyPlaylistData
    }

    simplifyTrack(track: APITrack): FormattedTrack {
        return {
            raw: track,
            title: track.name,
            artist: track.artists.map(val => ({ name: val.name, url: val.external_urls.spotify })),
            duration: msToFormatted(track.duration_ms),
            url: track.external_urls.spotify,
            thumbnail: track.album.images[0].url
        }
    }

    async getTrack(url: string, formatData: boolean = false): Promise<APITrack | FormattedTrack> {
        if (!this.validateSpotifyTrack(url)) throw new Error("Error: The URL given is not a Spotify track URL")

        if (!this.intervaled) await this.refreshToken()

        const spotifyRequestUrlArray = url.split("?")[0].split("/")

        const spotifyRequestUrl = `${this.spotifyAPIURL}/tracks/${spotifyRequestUrlArray[spotifyRequestUrlArray.length - 1]}`

        const axiosData = await axios.get<APITrack>(spotifyRequestUrl, {
            headers: {
                Authorization: `Bearer ${this.spotifyCredentials.accessToken}`
            },
            validateStatus: (_status) => true
        })

        if(axiosData.status === 400) throw new Error("Error: Cannot find the track")

        if(axiosData.status !== 200) throw new Error("Error: An unknown error occoured while fetching the track.")

        const { data: spotifyData } = axiosData

        if (!formatData) return spotifyData

        const format: FormattedTrack = {
            raw: spotifyData,
            title: spotifyData.name,
            artist: spotifyData.artists.map(val => ({ name: val.name, url: val.external_urls.spotify })),
            duration: msToFormatted(spotifyData.duration_ms),
            url: spotifyData.external_urls.spotify,
            thumbnail: spotifyData.album.images[0].url
        }

        return format
    }
}