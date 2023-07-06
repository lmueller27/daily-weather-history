'use client'

import React, { Suspense, useState } from "react";
import '../../node_modules/react-vis/dist/style.css';
import styles from './form.module.css'
import AutoSizer from 'react-virtualized-auto-sizer'
import { formState, getWeekNumber, myColors } from "../shared/utils";
import { WeatherPlot } from "./weatherPlot";
import { PlotControls } from "./plotControls";
import { InputSpace } from "./inputSpace";
import { GenerateButtons } from "./generateButtons";

export default function Form(props: any) {
    const todaysDate = new Date()
    const currentWeek = getWeekNumber(todaysDate)

    const [state, setState] = useState<formState>({
        latitude: undefined,
        longitude: undefined,
        targetDate: todaysDate.toISOString().slice(0, -14),
        targetWeek: currentWeek[0] + '-W' + currentWeek[1],
        startDate: new Date('1940-01-01').toISOString().slice(0, -14),
        endDate: todaysDate.toISOString().slice(0, -14),
        tempData: [[{ x: null, y: 0 }], [{ x: null, y: 0 }], [{ x: null, y: 0 }], [{ x: null, y: 0 }]],
        tempDataMedian: [],
        tempDataMean: [],
        showHints: true,
        crosshairValues: [],
        showMin: true,
        showMax: true,
        showMean: false,
        showPrec: false,
        showTrend: true,
        keepCrosshair: false,
        showTargetDate: false,
        showTargetWeek: false,
        formTitle: 'Select a visualization',
        formGeoString: '',
        currentVisMode: null,
    })

    // not used
    const [inputIsIncomplete, setInputIsIncomplete] = useState(false)

    return (
        <div className={styles.form}>
            <InputSpace state={state} setState={setState} />
            <GenerateButtons state={state} setState={setState} />
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