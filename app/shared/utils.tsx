/**
 * The type we use to mark a data point in a weather data series. x is the date and y a temperature measurement
 */
export type weatherPoint = {
    x: any;
    y: number;
}

export interface formState {
    latitude: number|undefined,
    longitude: number|undefined,
    targetDate: string,
    targetWeek: string,
    startDate: string,
    endDate: string,
    tempData: Array<Array<weatherPoint>>,
    tempDataMedian: [],
    tempDataMean: [],
    showHints: boolean,
    crosshairValues: weatherPoint[],
    showMin: boolean,
    showMax: boolean,
    showMean: boolean,
    showPrec: boolean,
    keepCrosshair: boolean,
    showTargetDate: boolean,
    showTargetWeek: boolean,
    formTitle: string
}

export enum myColors {
    Red = '#f56151',
    Blue = '#3fa1e8',
    Green = '#3ba365',
    Yellow = '#f5bc51',
    IconBlue = "#0070f3",
}

/**
 * from https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 * @param d a Date
 * @returns an array containing the dates year as a number and the dates calender week of that year as a string (with leading 0)
 */
export function getWeekNumber(d: Date) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d.valueOf() - yearStart.valueOf()) / 86400000) + 1)/7);
    let res:string
    if (weekNo < 10) {
        res = '0'+weekNo
    }
    else {
        res = weekNo+''
    }
    // Return array of year and week number
    return [d.getUTCFullYear(), res];
}

export const median = (arr: any) => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a.y - b.y);
    return arr.length % 2 !== 0 ? nums[mid] : nums[mid + 1];
};