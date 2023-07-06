import { getDateHistory, getMonthHistory, getOpenMeteoData, getWeekHistory } from "../shared/openMeteoInterface";
import { formState, visualizationModes } from "../shared/utils";
import styles from './form.module.css'

export function GenerateButtons({ state, setState }: { state: formState, setState: React.Dispatch<React.SetStateAction<formState>> }) {
    return (
        <div className={styles.generateButtons}>
            <p>Show Data For:</p>
            <button type="button" className={state.currentVisMode===visualizationModes.DateHistory?styles.activatedMode:undefined} onClick={() => getDateHistory(state, setState)} disabled={validateDateHistoryInput()}>History of Target Date</button>
            <button type="button" className={state.currentVisMode===visualizationModes.WeekHistory?styles.activatedMode:undefined} onClick={() => getWeekHistory(state, setState)} disabled={validateWeekHistoryInput()}>History of Target Week</button>
            <button type="button" className={state.currentVisMode===visualizationModes.MonthHistory?styles.activatedMode:undefined} onClick={() => getMonthHistory(state, setState)} disabled={validateDateHistoryInput()}>History of Target Month</button>
            <button type="button" className={state.currentVisMode===visualizationModes.Interval?styles.activatedMode:undefined} onClick={() => getOpenMeteoData(state, setState)} disabled={validateIntervalInput()}>Whole Interval (max 10 years)</button>
        </div>
    )

    function validateIntervalInput() {
        // validate input
        if (state.latitude == undefined || state.longitude == undefined) {
            return true
        }
        if (!(!Number.isNaN(state.latitude) && !Number.isNaN(state.longitude) && state.startDate && state.endDate && Number(state.endDate.slice(0, 4)) - Number(state.startDate.slice(0, 4)) <= 10)) {
            return true
        }
        return false
    }

    // this is also the function used for monthly history 
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