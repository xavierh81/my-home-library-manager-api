// Imports
import axios from 'axios'

// Helpers
import {loadConfig} from '@helpers/global'
import { isStringEmpty } from '@helpers/string';

// Configuration
const config = loadConfig();

//
// CORE Class
//
class MediasManager {
    private static TMDB_API_Endpoint = "https://api.themoviedb.org/3/"
    private static TMDB_IMAGE_URL_PATH = "https://image.tmdb.org/t/p/w500/"

    async searchMovies (searchText: string) : Promise<MediaSearchResult[]> {
        return new Promise((resolve) => {        

            // Call TMDB APIs to retrieve search results 
            axios.get(`${MediasManager.TMDB_API_Endpoint}search/movie`, {
                params: {
                    query: searchText,
                    language: config.tmdb.language,

                    api_key: config.tmdb.api_key
                }
            }).then((response) => {
                const results : MediaSearchResult[] = [];

                if(response.data !== null && response.data.results !== null && response.data.results.length > 0)
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    response.data.results.forEach((movie: any) => {
                        results.push({
                            id: movie.id,
                            title: movie.title,
                            originalTitle: movie.original_title,
                            imageUrl: isStringEmpty(movie.poster_path) == false ? `${MediasManager.TMDB_IMAGE_URL_PATH}${movie.poster_path}` : null,
                            releaseDate: movie.release_date,
                            summary: movie.overview
                        })
                    })
                }

                resolve(results);
            })
            .catch((error) => {
                console.log(error)
                resolve([]);
            })
        })
    }
}

// Export result type
export type MediaSearchResult = {
    id: number;
    title: string;
    originalTitle: string;
    imageUrl?: string | null;
    releaseDate: string;
    duration?: number | null;
    summary?: string | null;
}

// Main export of medias manager
export default MediasManager