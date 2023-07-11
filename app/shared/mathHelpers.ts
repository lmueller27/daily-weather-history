import { median, medianY, weatherPoint } from "./utils"

// Least squares method to determine the line of best fit for the data
export function leastSquaresLinearRegression(data: weatherPoint[]) {

    const xValues = Array.from(Array(data.length).keys())
    const xMean = (xValues.reduce((a, b) => a + (b || 0), 0) / xValues.length)

    const yValues = data.map(d => Number(d.y))
    const yMean = (yValues.reduce((a, b) => a + (b || 0), 0) / yValues.length)

    // take the difference of each x point to xMean and the difference of each y point to yMean
    const xDiffs = xValues.map(x => x - xMean)
    const yDiffs = yValues.map(y => y - yMean)

    const xDiffsSquared = xDiffs.map(x => x * x)

    // calculate xDiffs * yDiffs
    const xyDiffs = xDiffs.map((x, i) => x * yDiffs[i])

    // compute the slope of the line and offset b
    const m = xyDiffs.reduce((a, b) => a + b, 0) / xDiffsSquared.reduce((a, b) => a + b, 0)
    const b = yMean - (xMean * m)

    const res = data.map((d, i) => ({ x: d.x, y: m * i + b }))
    return res
}

// Theil Sen Estimation of best fitted line using median of all slopes through all point pairs 
export function theilSenEstimation(data: weatherPoint[]) {
    let slopes = []
    const xValues = Array.from(Array(data.length).keys())
    const yValues = data.map(d => Number(d.y))

    for (var i = 0; i < data.length-1; i++) {
        for (var j = i+1; j < data.length; j++) {
            if (i !== j) {
                // m = (y2 - y1)/(x2 - x1)
                const m = (yValues[j] - yValues[i]) / (j-i)
                slopes.push(m)
            }
        }
    }

    // compute median
    const medSlope = median(slopes)

    //b to be the median of the values yi − mxi.
    let vals = []
    for (var i = 0; i < data.length; i++) {
        const v = yValues[i] - (medSlope * i)
        vals.push(v)
    }

    const b = median(vals)

    const res = data.map((d, i) => ({ x: d.x, y: medSlope * i + b }))
    return res
}