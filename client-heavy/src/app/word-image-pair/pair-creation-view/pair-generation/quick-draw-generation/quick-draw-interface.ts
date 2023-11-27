export interface IQuickDrawData {
    key_id: string;
    word: string;
    countrycode: string;
    timestamp: string;
    recognized: boolean;
    drawing: number[][][];
}
