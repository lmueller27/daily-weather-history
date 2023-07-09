'use client'

import React, { useEffect, useState } from "react";
import '../../node_modules/react-vis/dist/style.css';
import styles from '../styles/form.module.css'
import AutoSizer from 'react-virtualized-auto-sizer'
import { formState, getWeekNumber, inputState, inputValidation, visualizationModes } from "../shared/utils";
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

    const [inputValidation, setInputValidation] = useState<inputValidation>({
        lat: false,
        long: false,
        target: true,
        start: true,
        end: true
    })

    const [state, setState] = useState<formState>({
        tempData: [[{ x: todaysDate, y: 20 }], [{ x: todaysDate, y: 20 }], [{ x: todaysDate, y: 20 }], [{ x: todaysDate, y: 20 }]],
        tempDataMedian: [],
        tempDataMean: [],
        crosshairValues: [],
        showMin: true,
        showMax: true,
        showMean: false,
        showMedian: false,
        showPrec: false,
        showTrend: true,
        keepCrosshair: false,
        formTitle: <h1>Select a visualization</h1>,
        formGeoString: '',
        currentVisMode: null,
    })

    // This effect is triggered any time the input values change. It handles validation and if valid triggers the data fetching.
    useEffect(() => {
        const triggerCurrentVisMode = async () => {
            let inputCheck = { ...inputValidation };
            const validInterval = new Date(inputState.startDate).valueOf() < new Date(inputState.endDate).valueOf() && Number(inputState.startDate.slice(0, 4)) >= 1940

            inputCheck.lat = !Number.isNaN(inputState.latitude) && inputState.latitude !== undefined
            inputCheck.long = !Number.isNaN(inputState.longitude) && inputState.longitude !== undefined
            !inputState.targetDate ? inputCheck.target = false : inputCheck.target = true;
            inputCheck.start = validInterval
            inputCheck.end = validInterval
            // for the interval mode we dont need to check the target date validity but do need to limit the interval borders
            if (state.currentVisMode === visualizationModes.Interval) {
                inputCheck.target = true;
                const ltTenYears = Number(inputState.endDate.slice(0, 4)) - Number(inputState.startDate.slice(0, 4)) <= 10
                inputCheck.start = ltTenYears
                inputCheck.end = ltTenYears
                if (Object.values(inputCheck).reduce((a, b) => a && b, true)) {
                    await getOpenMeteoData(inputState, state, setState);
                }
            }
            else if (Object.values(inputCheck).reduce((a, b) => a && b, true)) {
                if (state.currentVisMode === visualizationModes.DateHistory) {
                    await getDateHistory(inputState, state, setState);
                }
                else if (state.currentVisMode === visualizationModes.WeekHistory) {
                    await getWeekHistory(inputState, state, setState);
                }
                else if (state.currentVisMode === visualizationModes.MonthHistory) {
                    await getMonthHistory(inputState, state, setState);
                }
            }
            setInputValidation(inputCheck)

        }
        triggerCurrentVisMode()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputState])

    return (
        <div className={styles.form} >
            <InputSpace inputState={inputState} setInputState={setInputState} inputValidation={inputValidation} />
            <GenerateButtons state={state} setState={setState} inputState={inputState} setInputState={setInputState} inputValidation={inputValidation} setInputValidation={setInputValidation} />
            {state.formTitle}
            <p>{state.formGeoString}</p>
            <h4>Click on the series to freeze/unfreeze the tooltip. Drag to zoom in.</h4>
            <div className={styles.figureSpace}>
                <div className={styles.graphSpace}>
                    <AutoSizer disableHeight >
                        {({ width }: any) => (
                            <WeatherPlot state={state} setState={setState} width={width} />
                        )}
                    </AutoSizer>
                </div>
                <PlotControls props={props} state={state} setState={setState} width={100} />
            </div>
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