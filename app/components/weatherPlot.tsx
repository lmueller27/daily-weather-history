import { AreaSeries, Crosshair, DecorativeAxis, Highlight, HighlightArea, HorizontalGridLines, LineSeries, MarkSeries, VerticalBarSeries, XAxis, XYPlot, YAxis } from "react-vis";
import { formState, getWeekNumber, months, myColors, visualizationModes } from "../shared/utils";
import { leastSquaresLinearRegression } from "../shared/mathHelpers";
import { useState } from "react";
import styles from '../styles/form.module.css'

export function WeatherPlot({ state, setState, width }: { state: formState, setState: React.Dispatch<React.SetStateAction<formState>>, width: any }) {
    const [lastDrawLocation, setLastDrawLocation] = useState<HighlightArea | null>(null)
    return (
        <XYPlot
            height={400}
            width={width}
            animation={false}
            xType={'time'}
            onClick={() => setState({ ...state, keepCrosshair: !state.keepCrosshair })}
            onMouseLeave={(): void => { !state.keepCrosshair ? setState({ ...state, crosshairValues: [] }) : null }}
            xDomain={
                lastDrawLocation && [
                    lastDrawLocation.left,
                    lastDrawLocation.right
                ]
            }>
            {state.currentVisMode === null ? <XAxis title="" attr="x" hideTicks /> : <XAxis title="" attr="x" />}
            <YAxis title="Temp °C // mm" attr="y" />
            <HorizontalGridLines />
            {state.showMax ? <LineSeries color={myColors.Red} opacity={0.7} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[0]} /> : null}
            {state.showMax ? <AreaSeries color={myColors.Red} opacity={0.3} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[0]} /> : null}
            {state.showMean ? <LineSeries color={myColors.Green} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[1]} /> : null}
            {state.showMin ? <LineSeries color={myColors.Blue} opacity={1} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[2]} /> : null}
            {state.showMin ? <AreaSeries color={myColors.Blue} opacity={0.8} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[2]} /> : null}
            {state.showMedian ? <LineSeries color={myColors.Yellow} strokeStyle="solid" data={state.tempDataMedian} /> : null}
            {state.showTrend && state.tempData[0] && state.showMax ? <LineSeries strokeStyle="dashed" color={myColors.Red} data={leastSquaresLinearRegression(state.tempData[0])} /> : null}
            {state.showTrend && state.tempData[1] && state.showMean ? <LineSeries strokeStyle="dashed" color={myColors.Green} data={leastSquaresLinearRegression(state.tempData[1])} /> : null}
            {state.showTrend && state.tempData[2] && state.showMin ? <LineSeries strokeStyle="dashed" color={'white'} data={leastSquaresLinearRegression(state.tempData[2])} /> : null}
            {state.showPrec ? <LineSeries color={'lightblue'} curve={'curveStep'} data={state.tempData[3]} /> : null}
            {state.showPrec ? <LineSeries color={'black'} data={leastSquaresLinearRegression(state.tempData[3])} /> : null}
            {state.crosshairValues[0] && state.currentVisMode !== null ?
                <Crosshair className={styles.test}
                    values={state.crosshairValues}
                    style={{ box: { background: 'rgba(80, 80, 80, 0.8)' } }}
                    titleFormat={(d) => {
                        if (state.currentVisMode === visualizationModes.MonthHistory) {
                            return { title: 'x', value: `${d[0].x.getFullYear()} ${months[d[0].x.getMonth() + 1]}` }
                        }
                        else if (state.currentVisMode === visualizationModes.WeekHistory) {
                            const weekInfo = getWeekNumber(d[0].x)
                            return { title: 'x', value: `${weekInfo[0]}-W${weekInfo[1]}` }
                        }
                        else {
                            return { title: 'x', value: d[0].x.toDateString() };
                        }
                    }}
                    itemsFormat={(d) => {
                        let res = []
                        if (state.showMax) {
                            res.push({ title: 'max', value: d[0].y })
                        }
                        if (state.showMean) {
                            res.push({ title: 'mean', value: d[1].y })
                        }
                        if (state.showMin) {
                            res.push({ title: 'min', value: d[2].y })
                        }
                        if (state.showPrec) {
                            res.push({ title: 'prec', value: d[3].y })
                        }
                        return res
                    }}>
                </Crosshair> : null}
            {state.crosshairValues.length === 0 || state.currentVisMode === null ? null :
                <MarkSeries
                    data={fetchMarkerData()}
                    color={'white'}
                    stroke="gray " />
            }
            {state.currentVisMode === null ? null :
                <Highlight
                    enableY={false}
                    onBrushEnd={area => {
                        if (area == null) { // either a simple click or reset zoom
                            if (lastDrawLocation) {
                                setState({ ...state, keepCrosshair: !state.keepCrosshair })
                            }
                        }
                        else {
                            setState({ ...state, keepCrosshair: !state.keepCrosshair })
                        }
                        setLastDrawLocation(area)
                    }} />
            }
        </XYPlot>
    )

    function fetchMarkerData() {
        let d: any = [];
        if (state.showMax) {
            d.push(state.crosshairValues[0])
        }
        if (state.showMean) {
            d.push(state.crosshairValues[1])
        }
        if (state.showMin) {
            d.push(state.crosshairValues[2])
        }
        if (state.showPrec) {
            d.push(state.crosshairValues[3])
        }

        return d;
    }
}