'use client'

import React, { useEffect, useState } from "react";
import '../../node_modules/react-vis/dist/style.css';
import styles from './form.module.css'
import AutoSizer from 'react-virtualized-auto-sizer'
import { formState, getWeekNumber, inputState, visualizationModes } from "../shared/utils";
import { WeatherPlot } from "./weatherPlot";
import { PlotControls } from "./plotControls";
import { InputSpace } from "./inputSpace";
import { GenerateButtons } from "./generateButtons";
import { getDateHistory, getMonthHistory, getOpenMeteoData, getWeekHistory } from "../shared/openMeteoInterface";

export default function Form(props: any) {
    const todaysDate = new Date()
    const currentWeek = getWeekNumber(todaysDate)

    const [inputState, setInputState] = useState<inputState>({
        latitude: undefined,
        longitude: undefined,
        targetDate: todaysDate.toISOString().slice(0, -14),
        startDate: new Date('1940-01-01').toISOString().slice(0, -14),
        endDate: todaysDate.toISOString().slice(0, -14),
    })

    const [state, setState] = useState<formState>({
        tempData: [[{ x: null, y: 0 }], [{ x: null, y: 0 }], [{ x: null, y: 0 }], [{ x: null, y: 0 }]],
        tempDataMedian: [],
        tempDataMean: [],
        showHints: true,
        crosshairValues: [],
        showMin: true,
        showMax: true,
        showMean: false,
        showMedian: false,
        showPrec: false,
        showTrend: true,
        keepCrosshair: false,
        showTargetDate: false,
        showTargetWeek: false,
        formTitle: 'Select a visualization',
        formGeoString: '',
        currentVisMode: null,
    })

    useEffect(() => {
        const triggerCurrentVisMode = async () => {
            if (state.currentVisMode===visualizationModes.DateHistory) {
                await getDateHistory(inputState,state,setState);
            }
            else if (state.currentVisMode===visualizationModes.WeekHistory) {
                await getWeekHistory(inputState,state,setState);
            }
            else if (state.currentVisMode===visualizationModes.MonthHistory) {
                await getMonthHistory(inputState,state,setState);
            }
            else if (state.currentVisMode===visualizationModes.Interval) {
                await getOpenMeteoData(inputState,state,setState);
            }
        }
        triggerCurrentVisMode()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [inputState])

    return (
        <div className={styles.form}>
            <InputSpace inputState={inputState} setInputState={setInputState} />
            <GenerateButtons state={state} setState={setState} inputState={inputState}/>
            <h1>{state.formTitle}</h1>
            <p>{state.formGeoString}</p>
            <h4>Click on the series to freeze/unfreeze the tooltip. Drag to zoom in.</h4>
            <AutoSizer disableHeight>
                {({ width }: any) => (
                    <div className={styles.figureSpace}>
                        <WeatherPlot state={state} setState={setState} width={width} />
                        <PlotControls props={props} state={state} setState={setState} width={width} />
                    </div>
                )}
            </AutoSizer>
        </div >
    )

}

/**
 * <ul>
                {state.tempData[0].map((temp) => (
                    <li key={temp.x}>
                        <span>{temp.x + ''} : {temp.y}</span>
                    </li>
                ))}
            </ul>
 */