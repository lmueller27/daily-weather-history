import { AreaSeries, Crosshair, HorizontalGridLines, LineSeries, MarkSeries, XAxis, XYPlot, YAxis } from "react-vis";
import { formState, myColors } from "../shared/utils";
import { leastSquaresLinearRegression } from "../shared/mathHelpers";

export function WeatherPlot({ state, setState, width }: { state: formState, setState: React.Dispatch<React.SetStateAction<formState>>, width: any }) {
    return (
        <XYPlot
            height={400}
            width={width * 0.75}
            animation={false}
            xType={state.showTargetWeek ? "linear" : 'time'}
            onClick={() => setState({ ...state, keepCrosshair: !state.keepCrosshair })}
            onMouseLeave={(): void => { !state.keepCrosshair ? setState({ ...state, crosshairValues: [] }) : null }}>
            <HorizontalGridLines />
            <XAxis title="" />
            <YAxis title="Temp °C // mm" />
            {state.showMax ? <AreaSeries color={myColors.Red} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[0]} /> : null}
            {state.showMean ? <LineSeries color={myColors.Green} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[1]} /> : null}
            {state.showMin ? <AreaSeries color={myColors.Blue} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[2]} /> : null}
            {state.showMean ? <LineSeries color={myColors.Yellow} strokeStyle="dashed" data={state.tempDataMedian} /> : null}
            {state.showMean ? <LineSeries color={'black'} data={leastSquaresLinearRegression(state.tempData[1])} /> : null}
            {state.showMean ? <LineSeries color={'black'} data={leastSquaresLinearRegression(state.tempData[0])} /> : null}
            {state.showMean ? <LineSeries color={'black'} data={leastSquaresLinearRegression(state.tempData[2])} /> : null}
            {state.showPrec ? <LineSeries color={'lightblue'} strokeStyle="dashed" data={state.tempData[3]} /> : null}
            {state.showPrec ? <LineSeries color={'black'} data={leastSquaresLinearRegression(state.tempData[3])} /> : null}
            {state.showTargetDate && state.showMin ? <MarkSeries color='black' data={state.tempData[2].filter(a => a.x.toISOString().slice(0, -14) == state.targetDate)} /> : null}
            {state.showTargetDate && state.showMax ? <MarkSeries color='black' data={state.tempData[0].filter(a => a.x.toISOString().slice(0, -14) == state.targetDate)} /> : null}
            {state.showTargetDate && state.showMean ? <MarkSeries color='black' data={state.tempData[1].filter(a => a.x.toISOString().slice(0, -14) == state.targetDate)} /> : null}
            {state.crosshairValues[0] ? <Crosshair values={state.crosshairValues}>
            </Crosshair> : null}
        </XYPlot>
    )
}