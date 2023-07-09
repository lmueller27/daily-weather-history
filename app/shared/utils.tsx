import { ReactElement } from "react";

/**
 * The type we use to mark a data point in a weather data series. x is the date and y a temperature measurement
 */
export type weatherPoint = {
    x: any;
    y: number;
}

export type inputValidation = {
    lat: boolean,
    long: boolean,
    target: boolean,
    start: boolean,
    end: boolean,
}

export interface inputState {
    latitude: number|undefined,
    longitude: number|undefined,
    targetDate: string,
    startDate: string,
    endDate: string,
}

export interface formState {
    tempData: Array<Array<weatherPoint>>,
    tempDataMedian: [],
    tempDataMean: [],
    crosshairValues: weatherPoint[],
    showMin: boolean,
    showMax: boolean,
    showMean: boolean,
    showMedian: boolean,
    showPrec: boolean,
    showTrend: boolean,
    keepCrosshair: boolean,
    formTitle: ReactElement<any, any>,
    formGeoString: string,
    currentVisMode: visualizationModes | null,
}

export enum visualizationModes {
    DateHistory = 0,
    WeekHistory = 1,
    MonthHistory = 2,
    Interval = 3,
}

export enum myColors {
    Red = '#f56151',
    Blue = '#3fa1e8',
    Green = '#3ba365',
    Yellow = '#f5bc51',
    IconBlue = "#0070f3"
}

export enum months {
    January = 1,
    Feburary = 2,
    March = 3,
    April = 4,
    May = 5,
    June = 6,
    July = 7,
    August = 8,
    September = 9,
    October = 10,
    November = 11,
    December = 12,
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
    if (arr.length <= 2) {
        return NaN;
    }
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a.y - b.y);
    return arr.length % 2 !== 0 ? nums[mid] : nums[mid + 1];
};