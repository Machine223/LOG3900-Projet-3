import Axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import config from '../../config';

@Service()
export class OnlineSearchManager {
    constructor() {}

    async searchImages(word: string, page: number): Promise<string[]> {
        const baseUrl: string = 'https://customsearch.googleapis.com/customsearch/v1';

        let res: AxiosResponse = await Axios.get(baseUrl, {
            params: {
                q: word,
                searchType: 'image',
                key: config.searchApiKey,
                cx: config.searchEngineId,
                fileType: 'jpg',
                start: page * 10 + 1,
                safe: 'active',
            },
        });

        if (res.status === 200) {
            const imageLinks: string[] = [];
            let results: any[] = res.data.items;
            results.forEach((result: any) => imageLinks.push(result.link));
            return imageLinks;
        } else {
            return [];
        }
    }
}
