import { formState, getWeekNumber, inputState, median, visualizationModes } from "./utils";

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
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=7&forecast_days=1&timezone=Europe%2FBerlin`);
    const msg = await res.json();
    return msg;
}

/**
     * This fails to visualize for big timespans. Also we dont really need it as it is implemented in many other apps
     */
export async function getOpenMeteoData(inputState: inputState, state: formState, setState: React.Dispatch<React.SetStateAction<formState>>) {
    const now = Date.now()
    const todaysDate = now - (now % 86400000)

    // First get the historical data
    const msg = await getHistoricalData(inputState.latitude!, inputState.longitude!, inputState.startDate, inputState.endDate);

    let min: any = [], max: any = [], mean: any = [], prec: any = []

    msg.daily.time.forEach((k: string, i: number) => {
        min.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_min[i]) })
        max.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_max[i]) })
        mean.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_mean[i]) })
        prec.push({ x: new Date(k), y: parseFloat(msg.daily.precipitation_sum[i]) })
    });

    // Now if the end date is more recent than 7 days ago, also fetch the forecast data for the more recent dates
    if (todaysDate - new Date(inputState.endDate).valueOf() <= 604800000) {
        // calculate the date offset 
        const offset = (new Date(inputState.endDate).valueOf() - (todaysDate - 604800000)) / (1000 * 60 * 60 * 24)

        const recentData = await getRecentData(inputState.latitude!, inputState.longitude!);

        recentData.daily.time.forEach((k: string, i: number) => {
            if (new Date(k).valueOf() < new Date(inputState.startDate).valueOf() || new Date(k).valueOf() > new Date(inputState.endDate).valueOf()) { // ignore the fetched data before the start date
                return
            }
            const index = (-(offset + 1)) + i
            min.at(index).y = parseFloat(recentData.daily.temperature_2m_min[i])
            max.at(index).y = parseFloat(recentData.daily.temperature_2m_max[i])
            // for forecast data we approximate the mean, which yields okay errors at daily measures (~1C)
            mean.at(index).y = (max.at(index).y + min.at(index).y) / 2
            prec.at(index).y = parseFloat(recentData.daily.precipitation_sum[i])
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
        currentVisMode: visualizationModes.Interval,
        formGeoString: `for ${msg.latitude.toFixed(2)}˚N ${msg.longitude.toFixed(2)}˚E at ${msg.elevation}m above sea level`,
        formTitle: `Daily Data between ${inputState.startDate} and ${inputState.endDate}.`
    })
}


export async function getDateHistory(inputState: inputState, state: formState, setState: React.Dispatch<React.SetStateAction<formState>>) {
    const now = Date.now()
    const todaysDate = now - (now % 86400000)
    // First get the historical data
    const msg = await getHistoricalData(inputState.latitude!, inputState.longitude!, inputState.startDate, inputState.endDate);

    let min: any = [], max: any = [], mean: any = [], prec: any = []

    msg.daily.time.forEach((k: string, i: number) => {
        if (k.slice(5) === inputState.targetDate.slice(5)) {
            min.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_min[i]) })
            max.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_max[i]) })
            mean.push({ x: new Date(k), y: parseFloat(msg.daily.temperature_2m_mean[i]) })
            prec.push({ x: new Date(k), y: parseFloat(msg.daily.precipitation_sum[i]) })
        }
    });

    // Now if the end date is more recent than 7 days ago, also fetch the forecast data for the more recent dates
    if (todaysDate - new Date(inputState.endDate).valueOf() <= 604800000) {
        const recentData = await getRecentData(inputState.latitude!, inputState.longitude!);
        // add the recent data which will be the last entry of the arrays filled before
        recentData.daily.time.forEach((k: string, i: number) => {
            if (k.slice(5) === inputState.targetDate.slice(5)) {
                min.at(-1).y = parseFloat(recentData.daily.temperature_2m_min[i])
                max.at(-1).y = parseFloat(recentData.daily.temperature_2m_max[i])
                // for forecast data we approximate the mean, which yields okay errors at daily measures (~1C)
                mean.at(-1).y = (max.at(-1).y + min.at(-1).y) / 2
                prec.at(-1).y = parseFloat(recentData.daily.precipitation_sum[i])
            }
        });
    }

    let avg = (mean.reduce((a: number, b: any) => a + (b.y || 0), 0) / mean.length)

    setState({
        ...state,
        tempData: [max, mean, min, prec],
        tempDataMedian: mean.map((e: any) => { return { x: e.x, y: median(mean).y } }),
        tempDataMean: mean.map((e: any) => { return { x: e.x, y: (avg || 0) } }),
        crosshairValues: [],
        keepCrosshair: false,
        showTargetDate: true,
        showTargetWeek: false,
        currentVisMode: visualizationModes.DateHistory,
        formGeoString: `for ${msg.latitude.toFixed(2)}˚N ${msg.longitude.toFixed(2)}˚E at ${msg.elevation}m above sea level`,
        formTitle: `History of ${inputState.targetDate.slice(5)} between ${inputState.startDate} and ${inputState.endDate}.`
    })
}

export async function getWeekHistory(inputState: inputState, state: formState, setState: React.Dispatch<React.SetStateAction<formState>>) {
    const now = Date.now()
    const todaysDate = now - (now % 86400000)
    // First get the historical data
    const msg = await getHistoricalData(inputState.latitude!, inputState.longitude!, inputState.startDate, inputState.endDate);

    let min: any = [], max: any = [], mean: any = [], prec: any = []

    // get target week 
    const targetWeek = getWeekNumber(new Date(inputState.targetDate))[1]

    for (let i = 0; i < msg.daily.time.length; i++) {
        const k = msg.daily.time[i]
        const weekInfo = getWeekNumber(new Date(k));
        if (weekInfo[1] === targetWeek) {
            let weekMinData = [], weekMaxData = [], weekMeanData = [], weekPrecData = []
            for (let j = i; j < i + 7; j++) {
                if (msg.daily.temperature_2m_min[j]) { // check if there is data. if not we just take the available data
                    weekMinData.push(parseFloat(msg.daily.temperature_2m_min[j]))
                    weekMaxData.push(parseFloat(msg.daily.temperature_2m_max[j]))
                    weekMeanData.push(parseFloat(msg.daily.temperature_2m_mean[j]))
                    weekPrecData.push(parseFloat(msg.daily.precipitation_sum[j]))
                }
            }
            i = i + 363

            const xVal = weekInfo[0]
            min.push({ x: xVal, y: Math.min(...weekMinData) })
            max.push({ x: xVal, y: Math.max(...weekMaxData) })
            //mean.push({ x: xVal, y: (avg || undefined) })
            mean.push({ x: xVal, y: weekMeanData })
            prec.push({ x: xVal, y: weekPrecData })
        }
    }

    // Now if the end date is more recent than 7 days ago, also fetch the forecast data for the more recent dates
    if (todaysDate - new Date(inputState.endDate).valueOf() <= 604800000) {
        const recentData = await getRecentData(inputState.latitude!, inputState.longitude!);
        // add the recent data which will be the last entry of the arrays filled before
        recentData.daily.time.forEach((k: string, i: number) => {
            if (new Date(k).valueOf() < new Date(inputState.startDate).valueOf()) {
                return;
            }
            const weekInfo = getWeekNumber(new Date(k));
            if (weekInfo[1] === targetWeek) {
                // We only take the values of they are bigger/smaller than the ones we found so far
                min.at(-1).y = Math.min(min.at(-1).y, parseFloat(recentData.daily.temperature_2m_min[i]))
                max.at(-1).y = Math.max(max.at(-1).y, parseFloat(recentData.daily.temperature_2m_max[i]))
                // approximate forecast mean data
                mean.at(-1).y.push((max.at(-1).y + min.at(-1).y) / 2)
                prec.at(-1).y.push(parseFloat(recentData.daily.precipitation_sum[i]))
            }
        });
    }

    // first filter out the nan values
    mean.forEach((d: any) => {
        d.y = d.y.filter((x: number) => !Number.isNaN((x)))
        d.y = (d.y.reduce((a: number, b: any) => a + (b || 0), 0) / d.y.length).toFixed(2)
    });

    prec.forEach((d: any) => {
        d.y = (d.y.reduce((a: number, b: any) => a + (b || 0), 0) /*/ d.y.length*/).toFixed(2)
    });

    setState({
        ...state,
        tempData: [max, mean, min, prec],
        tempDataMedian: mean.map((e: any) => { return { x: e.x, y: median(mean).y } }),
        crosshairValues: [],
        keepCrosshair: false,
        showTargetDate: false,
        showTargetWeek: true,
        currentVisMode: visualizationModes.WeekHistory,
        formGeoString: `for ${msg.latitude.toFixed(2)}˚N ${msg.longitude.toFixed(2)}˚E at ${msg.elevation}m above sea level`,
        formTitle: `History of Calender Week ${targetWeek} between ${inputState.startDate} and ${inputState.endDate}.`
    })
}

export async function getMonthHistory(inputState: inputState, state: formState, setState: React.Dispatch<React.SetStateAction<formState>>) {
    const now = Date.now()
    const todaysDate = now - (now % 86400000)
    // First get the historical data
    const msg = await getHistoricalData(inputState.latitude!, inputState.longitude!, inputState.startDate, inputState.endDate);

    let min: any = [], max: any = [], mean: any = [], prec: any = []

    for (let i = 0; i < msg.daily.time.length; i++) {
        const k = msg.daily.time[i]
        const month = k.slice(5).slice(0, -3);
        const year = new Date(k).getFullYear()
        if (month === (inputState.targetDate.slice(5).slice(0, -3))) {
            //check if we already have an entry for this month else create a new one
            if (min.length === 0 || min.at(-1)?.x !== year) {
                const xVal = year
                min.push({ x: xVal, y: parseFloat(msg.daily.temperature_2m_min[i]) || Infinity })
                max.push({ x: xVal, y: parseFloat(msg.daily.temperature_2m_max[i] || -Infinity) })
                mean.push({ x: xVal, y: [parseFloat(msg.daily.temperature_2m_mean[i])] })
                prec.push({ x: xVal, y: [parseFloat(msg.daily.precipitation_sum[i])] })
            }
            else {
                min.at(-1).y = Math.min(min.at(-1).y, parseFloat(msg.daily.temperature_2m_min[i]) || Infinity)
                max.at(-1).y = Math.max(max.at(-1).y, parseFloat(msg.daily.temperature_2m_max[i]) || -Infinity)
                mean.at(-1).y.push(parseFloat(msg.daily.temperature_2m_mean[i]))
                prec.at(-1).y.push(parseFloat(msg.daily.precipitation_sum[i]))
            }
        }
    }

    // Now if the end date is more recent than 7 days ago, also fetch the forecast data for the more recent dates
    if (todaysDate - new Date(inputState.endDate).valueOf() <= 604800000) {
        const recentData = await getRecentData(inputState.latitude!, inputState.longitude!);
        // add the recent data which will be the last entry of the arrays filled before
        recentData.daily.time.forEach((k: string, i: number) => {
            const month = k.slice(5).slice(0, -3);
            if (month == (inputState.targetDate.slice(5).slice(0, -3))) {
                // We only take the values of they are bigger/smaller than the ones we found so far
                min.at(-1).y = Math.min(min.at(-1).y, parseFloat(recentData.daily.temperature_2m_min[i]))
                max.at(-1).y = Math.max(max.at(-1).y, parseFloat(recentData.daily.temperature_2m_max[i]))
                // for forecast data we approximate the mean, which yields okay errors at daily measures (~1C)
                mean.at(-1).y.push((max.at(-1).y + min.at(-1).y) / 2)
                prec.at(-1).y.push(parseFloat(recentData.daily.precipitation_sum[i]))
            }
        });
    }

    // first filter out the nan values
    mean.forEach((d: any) => {
        d.y = d.y.filter((x: number) => !Number.isNaN((x)))
        d.y = (d.y.reduce((a: number, b: any) => a + (b || 0), 0) / d.y.length).toFixed(2)
    });

    prec.forEach((d: any) => {
        d.y = (d.y.reduce((a: number, b: any) => a + (b || 0), 0) /*/ d.y.length*/).toFixed(2)
    });

    setState({
        ...state,
        tempData: [max, mean, min, prec],
        tempDataMedian: mean.map((e: any) => { return { x: e.x, y: median(mean).y } }),
        crosshairValues: [],
        keepCrosshair: false,
        showTargetDate: false,
        showTargetWeek: true,
        currentVisMode: visualizationModes.MonthHistory,
        formGeoString: `for ${msg.latitude.toFixed(2)}˚N ${msg.longitude.toFixed(2)}˚E at ${msg.elevation}m above sea level`,
        formTitle: `History of Month ${inputState.targetDate.slice(5).slice(0, -3)} between ${inputState.startDate} and ${inputState.endDate}.`
    })
}

