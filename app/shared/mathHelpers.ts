import { weatherPoint } from "./utils"

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

    // compute the steepness of the line and offset b
    const m = xyDiffs.reduce((a, b) => a + b, 0) / xDiffsSquared.reduce((a, b) => a + b, 0)
    const b = yMean - (xMean * m)

    const res = data.map((d, i) => ({ x: d.x, y: m * i + b }))
    return res
}