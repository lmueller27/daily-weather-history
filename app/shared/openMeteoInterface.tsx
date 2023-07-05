import { formState, getWeekNumber, median } from "./utils";

/**
 * 
 * @returns Historical data for the current state of the form 
 */
async function getHistoricalData(latitude: number, longitude: number, startDate: string, endDate: string) {
    const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum&timezone=Europe%2FBerlin`);
    const msg = await res.json();
    return msg;
}

/**
 * 
 * @returns Recent data (past 5 days) for the current state of the form
 */
async function getRecentData(latitude: number, longitude: number) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=5&forecast_days=1&timezone=Europe%2FBerlin`);
    const msg = await res.json();
    return msg;
}

/**
     * This fails to visualize for big timespans. Also we dont really need it as it is implemented in many other apps
     */
export async function getOpenMeteoData(state: formState, setState: React.Dispatch<React.SetStateAction<formState>>) {
    const todaysDate = new Date();
    // First get the historical data
    const msg = await getHistoricalData(state.latitude!, state.longitude!, state.startDate, state.endDate);

    let min: any = [], max: any = [], mean: any = [], prec: any = []

    msg.daily.time.forEach((k: string, i: number) => {
        min.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_min[i]) })
        max.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_max[i]) })
        mean.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_mean[i]) })
        prec.push({ x: new Date(k), y: parseFloat(msg.daily.precipitation_sum[i]) })
    });

    // Now if the end date is more recent than 5 days ago, also fetch the forecast data for the more recent dates
    if (todaysDate.valueOf() - new Date(state.endDate).valueOf() <= 432000000) {
        // calculate the date difference 
        var dayDiff = todaysDate.getDate() - new Date(state.endDate).getDate()
        const recentData = await getRecentData(state.latitude!, state.longitude!);
        // add the recent data until dayDiff is 0
        recentData.daily.time.forEach((k: string, i: number) => {
            if (dayDiff <= 5) {
                min.at(-(6 - dayDiff)).y = parseFloat(recentData.daily.temperature_2m_min[i])
                max.at(-(6 - dayDiff)).y = parseFloat(recentData.daily.temperature_2m_max[i])
                prec.at(-(6 - dayDiff)).y = parseFloat(recentData.daily.precipitation_sum[i])
            }
            dayDiff++
        });
    }

    setState({
        ...state,
        tempData: [max, mean, min, prec],
        tempDataMedian: mean.map((e: any) => { return { x: e.x, y: median(mean).y } }),
        crosshairValues: [],
        keepCrosshair: false,
        showTargetDate: false,
        showTargetWeek: false,
        formTitle: `Showing all daily temperatures between ${state.startDate} and ${state.endDate} at ${msg.latitude.toFixed(2)}˚N ${msg.longitude.toFixed(2)}˚E at ${msg.elevation}m above sea level.`
    })
}


export async function getDateHistory(state: formState, setState: React.Dispatch<React.SetStateAction<formState>>) {
    const todaysDate = new Date();
    // First get the historical data
    const msg = await getHistoricalData(state.latitude!, state.longitude!, state.startDate, state.endDate);

    let min: any = []
    let max: any = []
    let mean: any = []

    msg.daily.time.forEach((k: string, i: number) => {
        if (k.slice(5) === state.targetDate.slice(5)) {
            min.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_min[i]) })
            max.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_max[i]) })
            mean.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_mean[i]) })
        }
    });

    // Now if the end date is more recent than 5 days ago, also fetch the forecast data for the more recent dates
    if (todaysDate.valueOf() - new Date(state.endDate).valueOf() <= 432000000) {
        const recentData = await getRecentData(state.latitude!, state.longitude!);
        // add the recent data which will be the last entry of the arrays filled before
        recentData.daily.time.forEach((k: string, i: number) => {
            if (k.slice(5) === state.targetDate.slice(5)) {
                min.at(-1).y = parseFloat(recentData.daily.temperature_2m_min[i])
                max.at(-1).y = parseFloat(recentData.daily.temperature_2m_max[i])
            }
        });
    }

    let avg = (mean.reduce((a: number, b: any) => a + (b.y || 0), 0) / mean.length)

    setState({
        ...state,
        tempData: [max, mean, min],
        tempDataMedian: mean.map((e: any) => { return { x: e.x, y: median(mean).y } }),
        tempDataMean: mean.map((e: any) => { return { x: e.x, y: (avg || 0) } }),
        crosshairValues: [],
        keepCrosshair: false,
        showTargetDate: true,
        showTargetWeek: false,
        formTitle: `Showing the history of temperatures for ${state.targetDate.slice(5)} between ${state.startDate} and ${state.endDate} at ${msg.latitude.toFixed(2)}˚N ${msg.longitude.toFixed(2)}˚E at ${msg.elevation}m above sea level.`
    })
}

export async function getWeekHistory(state: formState, setState: React.Dispatch<React.SetStateAction<formState>>) {
    const todaysDate = new Date();
    // First get the historical data
    const msg = await getHistoricalData(state.latitude!, state.longitude!, state.startDate, state.endDate);

    let min: any = []
    let max: any = []
    let mean: any = []

    for (let i = 0; i < msg.daily.time.length; i++) {
        const k = msg.daily.time[i]
        const weekInfo = getWeekNumber(new Date(k));
        if (weekInfo[1] === (state.targetWeek.slice(6))) {
            let weekMinData = [], weekMaxData = [], weekMeanData = []
            for (let j = i; j < i + 7; j++) {
                if (msg.daily.temperature_2m_min[j]) { // check if there is data. if not we just take the available data
                    weekMinData.push(parseFloat(msg.daily.temperature_2m_min[j]))
                    weekMaxData.push(parseFloat(msg.daily.temperature_2m_max[j]))
                    weekMeanData.push(parseFloat(msg.daily.temperature_2m_mean[j]))
                }
            }
            i = i + 363

            //only take the average if we have mean data for the whole week
            let avg
            if (weekMeanData.length === 7) {
                avg = (weekMeanData.reduce((a: number, b: any) => a + (b || 0), 0) / weekMeanData.length).toFixed(2)
            }

            //const xVal = weekInfo[0]+'-W'+weekInfo[1]
            const xVal = weekInfo[0]
            min.push({ x: xVal, y: Math.min(...weekMinData) })
            max.push({ x: xVal, y: Math.max(...weekMaxData) })
            mean.push({ x: xVal, y: (avg || undefined) })
        }
    }

    // Now if the end date is more recent than 5 days ago, also fetch the forecast data for the more recent dates
    if (todaysDate.valueOf() - new Date(state.endDate).valueOf() <= 432000000) {
        const recentData = await getRecentData(state.latitude!, state.longitude!);
        // add the recent data which will be the last entry of the arrays filled before
        recentData.daily.time.forEach((k: string, i: number) => {
            const weekInfo = getWeekNumber(new Date(k));
            if (weekInfo[1] === (state.targetWeek.slice(6))) {
                // We only take the values of they are bigger/smaller than the ones we found so far
                min.at(-1).y = Math.min(min.at(-1).y, parseFloat(recentData.daily.temperature_2m_min[i]))
                max.at(-1).y = Math.max(max.at(-1).y, parseFloat(recentData.daily.temperature_2m_max[i]))
            }
        });
    }

    setState({
        ...state,
        tempData: [max, mean, min],
        tempDataMedian: mean.map((e: any) => { return { x: e.x, y: median(mean).y } }),
        crosshairValues: [],
        keepCrosshair: false,
        showTargetDate: false,
        showTargetWeek: true,
        formTitle: `Showing the history of temperatures for Calender Week ${state.targetWeek.slice(6)} between ${state.startDate} and ${state.endDate} at ${msg.latitude.toFixed(2)}˚N ${msg.longitude.toFixed(2)}˚E at ${msg.elevation}m above sea level.`
    })
}

export async function getMonthHistory(state: formState, setState: React.Dispatch<React.SetStateAction<formState>>) {
    const todaysDate = new Date();
    // First get the historical data
    const msg = await getHistoricalData(state.latitude!, state.longitude!, state.startDate, state.endDate);

    let min: any = []
    let max: any = []
    let mean: any = []
    let prec: any = []

    for (let i = 0; i < msg.daily.time.length; i++) {
        const k = msg.daily.time[i]
        const month = k.slice(5).slice(0, -3);
        const year = new Date(k).getFullYear()
        if (month === (state.targetDate.slice(5).slice(0, -3))) {
            //check if we already have an entry for this month else create a new one
            if (min.length === 0 || min.at(-1)?.x !== year) {
                const xVal = year
                min.push({ x: xVal, y: parseFloat(msg.daily.temperature_2m_min[i])||Infinity })
                max.push({ x: xVal, y: parseFloat(msg.daily.temperature_2m_max[i]||-Infinity) })
                mean.push({ x: xVal, y: [parseFloat(msg.daily.temperature_2m_mean[i])]})
                prec.push({ x: xVal, y: [parseFloat(msg.daily.precipitation_sum[i])]})
            }
            else {
                min.at(-1).y = Math.min(min.at(-1).y, parseFloat(msg.daily.temperature_2m_min[i])||Infinity)
                max.at(-1).y = Math.max(max.at(-1).y, parseFloat(msg.daily.temperature_2m_max[i])||-Infinity)
                mean.at(-1).y.push(parseFloat(msg.daily.temperature_2m_mean[i]))
                prec.at(-1).y.push(parseFloat(msg.daily.precipitation_sum[i]))
            }
        }
    }

    mean.forEach((d:any) => {
        d.y = (d.y.reduce((a: number, b: any) => a + (b || 0), 0) / d.y.length).toFixed(2)
    });

    prec.forEach((d:any) => {
        d.y = (d.y.reduce((a: number, b: any) => a + (b || 0), 0) / d.y.length).toFixed(2)
    });

    // Now if the end date is more recent than 5 days ago, also fetch the forecast data for the more recent dates
    if (todaysDate.valueOf() - new Date(state.endDate).valueOf() <= 432000000) {
        const recentData = await getRecentData(state.latitude!, state.longitude!);
        // add the recent data which will be the last entry of the arrays filled before
        recentData.daily.time.forEach((k: string, i: number) => {
            const month = k.slice(5).slice(0, -3);
            if (month == (state.targetDate.slice(5).slice(0, -3))) {
                // We only take the values of they are bigger/smaller than the ones we found so far
                min.at(-1).y = Math.min(min.at(-1).y, parseFloat(recentData.daily.temperature_2m_min[i]))
                max.at(-1).y = Math.max(max.at(-1).y, parseFloat(recentData.daily.temperature_2m_max[i]))
            }
        });
    }

    setState({
        ...state,
        tempData: [max, mean, min, prec],
        tempDataMedian: mean.map((e: any) => { return { x: e.x, y: median(mean).y } }),
        crosshairValues: [],
        keepCrosshair: false,
        showTargetDate: false,
        showTargetWeek: true,
        formTitle: `Showing the history of temperatures for Month ${state.targetDate.slice(5).slice(0, -3)} between ${state.startDate} and ${state.endDate} at ${msg.latitude.toFixed(2)}˚N ${msg.longitude.toFixed(2)}˚E at ${msg.elevation}m above sea level.`
    })
}

