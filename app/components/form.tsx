'use client'

import React, { useState } from "react";
import { AreaSeries, Crosshair, HorizontalGridLines, LineMarkSeries, LineSeries, MarkSeries, VerticalGridLines, XAxis, XYPlot, YAxis } from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';
import styles from './form.module.css'
import AutoSizer from 'react-virtualized-auto-sizer'
import { formState, getWeekNumber, myColors } from "../shared/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import IncompleteDialog from "./incompleteDialog";
import CollapsibleMap from "./collapsibleMap";
import { getDateHistory, getMonthHistory, getOpenMeteoData, getWeekHistory } from "../shared/openMeteoInterface";
import FormLegend from "./legend";
import { leastSquaresLinearRegression } from "../shared/mathHelpers";

export default function Form(props: any) {
    const todaysDate = new Date()
    const currentWeek = getWeekNumber(todaysDate)

    const [state, setState] = useState<formState>({
        latitude: undefined,
        longitude: undefined,
        targetDate: todaysDate.toISOString().slice(0, -14),
        targetWeek: currentWeek[0] + '-W' + currentWeek[1],
        targetMonth: "",
        //startDate: new Date(d.setDate(d.getDate() - 60)).toISOString().slice(0, -14),
        startDate: new Date('1940-01-01').toISOString().slice(0, -14),
        endDate: todaysDate.toISOString().slice(0, -14),
        tempData: [[{ x: null, y: 0 }], [{ x: null, y: 0 }], [{ x: null, y: 0 }]],
        tempDataMedian: [],
        tempDataMean: [],
        showHints: true,
        crosshairValues: [],
        showMin: true,
        showMax: true,
        showMean: true,
        keepCrosshair: false,
        showTargetDate: false,
        showTargetWeek: false,
        formTitle: 'Select a visualization',
    })

    // not used
    const [inputIsIncomplete, setInputIsIncomplete] = useState(false)

    return (
        <div className={styles.form}>
            <div className={styles.inputSpace}>
                <form className={styles.settingForm}>
                    <button className={styles.locationButton} type="button" onClick={getUserLocation}><FontAwesomeIcon icon={faLocationCrosshairs} color={myColors.IconBlue} /></button>
                    <label htmlFor="lat">Latitude:</label>
                    <input type="number" id="lat" name="lat" value={state.latitude} min={-90} max={90} onChange={(e) => { setState({ ...state, latitude: parseFloat(e.target.value) }) }} />
                    <label htmlFor="long">Longitude:</label>
                    <input type="number" id="long" name="long" value={state.longitude} min={-180} max={180} onChange={(e) => { setState({ ...state, longitude: parseFloat(e.target.value) }) }} />
                    <label htmlFor="targetdate">Target Date:</label>
                    <input type="date" id="targetdate" name="targetdate" value={state.targetDate} min={state.startDate} max={state.endDate} onChange={(e) => { setState({ ...state, targetDate: e.target.value }) }} />
                    <label htmlFor="targetweek">Target Week:</label>
                    <input type="week" id="targetweek" name="targetweek" value={state.targetWeek} min="1940-W01" onChange={(e) => { setState({ ...state, targetWeek: e.target.value }) }} />
                    <label htmlFor="startdate">Start Date:</label>
                    <input type="date" id="startdate" name="startdate" value={state.startDate} min="1940-01-01" max={state.endDate} onChange={(e) => { setState({ ...state, startDate: e.target.value }) }} />
                    <label htmlFor="enddate">End Date:</label>
                    <input type="date" id="enddate" name="enddate" value={state.endDate} min={state.startDate} max={new Date().toISOString().slice(0, -14)} onChange={(e) => { setState({ ...state, endDate: e.target.value }) }} />
                </form>
                <CollapsibleMap state={state} setState={setState} />
            </div >
            <div className={styles.generateButtons}>
                <p>Show Data For:</p>
                <button type="button" onClick={()=>getDateHistory(state, setState)} disabled={validateDateHistoryInput()}>History of Target Date</button>
                <button type="button" onClick={()=>getWeekHistory(state, setState)} disabled={validateWeekHistoryInput()}>History of Target Week</button>
                <button type="button" onClick={()=>getMonthHistory(state, setState)} disabled={validateDateHistoryInput()}>History of Target Month</button>
                <button type="button" onClick={()=>getOpenMeteoData(state, setState)} disabled={validateIntervalInput()}>Whole Interval (max 10 years)</button>
            </div>
            <h1>{state.formTitle}</h1>
            <h4>Click on the series to freeze/unfreeze the tooltip.</h4>
            {/*{inputIsIncomplete ? <IncompleteDialog inputHook={[inputIsIncomplete, setInputIsIncomplete]}></IncompleteDialog> : null}*/}
            <AutoSizer disableHeight>
                {({ width }: any) => (
                    <div className={styles.figureSpace}>
                        <XYPlot
                            height={400}
                            width={width * 0.75}
                            animation={false}
                            xType={state.showTargetWeek ? "linear" : 'time'}
                            onClick={() => setState({ ...state, keepCrosshair: !state.keepCrosshair })}
                            onMouseLeave={():void => { !state.keepCrosshair ? setState({ ...state, crosshairValues: [] }) : null }}>
                            <HorizontalGridLines />
                            <XAxis title="" />
                            <YAxis title="Temp °C // mm" />
                            {state.showMax ? <AreaSeries color={myColors.Red} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[0]} /> : null}
                            {state.showMean ? <LineSeries color={myColors.Green} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[1]} /> : null}
                            {state.showMin ? <AreaSeries color={myColors.Blue} onNearestX={(value, { index }) => { !state.keepCrosshair ? setState({ ...state, crosshairValues: state.tempData.map(d => d[index]) }) : null }} data={state.tempData[2]} /> : null}
                            {state.showMean ? <LineSeries color={myColors.Yellow} strokeStyle="dashed" data={state.tempDataMedian} /> : null}
                            {state.showMean ? <LineSeries color={'black'} data={leastSquaresLinearRegression(state.tempData[1])} /> : null}
                            {state.showMean ? <LineSeries color={'black'} data={leastSquaresLinearRegression(state.tempData[0])} /> : null}
                            {/*{state.showMean ? <LineSeries color={'lightblue'} strokeStyle="dashed" data={state.tempData[3]} /> : null}*/}
                            {state.showTargetDate && state.showMin ? <MarkSeries color='black' data={state.tempData[2].filter(a => a.x.toISOString().slice(0, -14) == state.targetDate)} /> : null}
                            {state.showTargetDate && state.showMax ? <MarkSeries color='black' data={state.tempData[0].filter(a => a.x.toISOString().slice(0, -14) == state.targetDate)} /> : null}
                            {state.showTargetDate && state.showMean ? <MarkSeries color='black' data={state.tempData[1].filter(a => a.x.toISOString().slice(0, -14) == state.targetDate)} /> : null}
                            {state.crosshairValues[0] ? <Crosshair values={state.crosshairValues}>
                            </Crosshair> : null}
                        </XYPlot>
                        <div className={styles.figureControls}>
                            <form>
                                <input type="checkbox" id={"checkmax" + props.formId} name="checkmax" checked={state.showMax} onChange={(e) => { setState({ ...state, showMax: e.target.checked }) }} />
                                <label htmlFor={"checkmax" + props.formId}> Show maximum temp</label><br></br>
                                <input type="checkbox" id={"checkmean" + props.formId} name="checkmean" checked={state.showMean} onChange={(e) => { setState({ ...state, showMean: e.target.checked }) }} />
                                <label htmlFor={"checkmean" + props.formId}> Show mean temps and the overall median</label><br></br>
                                <input type="checkbox" id={"checkmin" + props.formId} name="checkmin" checked={state.showMin} onChange={(e) => { setState({ ...state, showMin: e.target.checked }) }} />
                                <label htmlFor={"checkmin" + props.formId}> Show minimum temp</label>
                            </form>
                            <FormLegend width={width}></FormLegend>
                            {props.hook[0].length > 1 ? <button type="button" onClick={selfRemove} className={styles.removeButton}>&mdash; Remove series</button> : null}

                        </div>
                    </div>
                )}
            </AutoSizer>
        </div >
    )

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => { setState({ ...state, latitude: Number(position.coords.latitude.toFixed(2)), longitude: Number(position.coords.longitude.toFixed(2)) }) }/*, errorFunction*/);
        }
        /** Todo: handle errors. getCurrentPosition takes an error function as second argument  */
    }

    function selfRemove() {
        let copy = props.hook[0].slice(0)
        copy = copy.filter((i: number) => i !== props.formId)
        props.hook[1](copy)
    }

    function validateIntervalInput() {
        // validate input
        if (!(!Number.isNaN(state.latitude) && !Number.isNaN(state.longitude) && state.startDate && state.endDate && Number(state.endDate.slice(0, 4)) - Number(state.startDate.slice(0, 4)) <= 10)) {
            return true
        }
        return false
    }

    function validateDateHistoryInput() {
        // validate input
        if (state.latitude == undefined || state.longitude == undefined) {
            return true
        }
        if (!(!Number.isNaN(state.latitude) && !Number.isNaN(state.longitude) && state.targetDate && state.startDate && state.endDate)) {
            return true
        }
        return false
    }

    function validateWeekHistoryInput() {
        // validate input
        if (state.latitude == undefined || state.longitude == undefined) {
            return true
        }
        if (!(!Number.isNaN(state.latitude) && !Number.isNaN(state.longitude) && state.targetWeek && state.startDate && state.endDate)) {
            return true
        }
        return false
    }


}

/**
 * <ul>
                {state.tempDataMean.map((temp) => (
                    <li key={temp.x}>
                        <span>{temp.x + ''} : {temp.y}</span>
                    </li>
                ))}
            </ul>
 */