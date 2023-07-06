import { AreaSeries, Crosshair, Highlight, HighlightArea, HorizontalGridLines, LineSeries, MarkSeries, XAxis, XYPlot, YAxis } from "react-vis";
import { formState, myColors, visualizationModes } from "../shared/utils";
import { leastSquaresLinearRegression } from "../shared/mathHelpers";
import { Suspense, useState } from "react";

export function WeatherPlot({ state, setState, width }: { state: formState, setState: React.Dispatch<React.SetStateAction<formState>>, width: any }) {
    const [lastDrawLocation, setLastDrawLocation] = useState<HighlightArea | null>(null)
    return (
        <XYPlot
            height={400}
            width={width * 0.75}
            animation={false}
            xType={state.showTargetWeek ? "linear" : 'time'}
            onClick={() => setState({ ...state, keepCrosshair: !state.keepCrosshair })}
            onMouseLeave={(): void => { !state.keepCrosshair ? setState({ ...state, crosshairValues: [] }) : null }}
            xDomain={
                lastDrawLocation && [
                    lastDrawLocation.left,
                    lastDrawLocation.right
                ]
            }
        >
            <HorizontalGridLines />
            <XAxis title="" />
            <YAxis title="Temp °C // mm" />
            {state.showMax ? <AreaSeries color={myColors.Red} opacity={0.7} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[0]} /> : null}
            {state.showMean ? <LineSeries color={myColors.Green} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[1]} /> : null}
            {state.showMin ? <AreaSeries color={myColors.Blue} opacity={1} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[2]} /> : null}
            {state.showMean ? <LineSeries color={myColors.Yellow} strokeStyle="solid" data={state.tempDataMedian} /> : null}
            {state.showTrend && state.showMax ? <LineSeries strokeStyle="dashed" color={myColors.Red} data={leastSquaresLinearRegression(state.tempData[0])} /> : null}
            {state.showTrend && state.showMean ? <LineSeries strokeStyle="dashed" color={myColors.Green} data={leastSquaresLinearRegression(state.tempData[1])} /> : null}
            {state.showTrend && state.showMin ? <LineSeries strokeStyle="dashed" color={'white'} data={leastSquaresLinearRegression(state.tempData[2])} /> : null}
            {state.showPrec ? <LineSeries color={'lightblue'} strokeStyle="dashed" data={state.tempData[3]} /> : null}
            {state.showPrec ? <LineSeries color={'black'} data={leastSquaresLinearRegression(state.tempData[3])} /> : null}
            {state.crosshairValues[0] ? <Crosshair
                values={state.crosshairValues}
                itemsFormat={(d) => [{ title: 'max', value: d[0].y }, { title: 'mean', value: d[1].y }, { title: 'min', value: d[2].y }]}>
            </Crosshair> : null}
            {state.crosshairValues.length === 0 ? null : <MarkSeries
                data={fetchMarkerData()}
                color={'white'}
                stroke="gray " />
            }
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
                }}
            />
        </XYPlot>
    )

    function fetchMarkerData() {
        let d:any = [];
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