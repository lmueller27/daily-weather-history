import { getDateHistory, getMonthHistory, getOpenMeteoData, getWeekHistory } from "../shared/openMeteoInterface";
import { formState, inputState, visualizationModes } from "../shared/utils";
import styles from '../styles/form.module.css'

export function GenerateButtons({ state, setState, inputState }: { state: formState, setState: React.Dispatch<React.SetStateAction<formState>>, inputState: inputState }) {
    return (
        <div className={styles.generateButtons}>
            <p>Show Data For:</p>
            <button type="button" className={state.currentVisMode===visualizationModes.DateHistory?styles.activatedMode:undefined} onClick={() => getDateHistory(inputState, state, setState)} disabled={validateDateInput()}>History of Target Date</button>
            <button type="button" className={state.currentVisMode===visualizationModes.WeekHistory?styles.activatedMode:undefined} onClick={() => getWeekHistory(inputState, state, setState)} disabled={validateDateInput()}>History of Target Week</button>
            <button type="button" className={state.currentVisMode===visualizationModes.MonthHistory?styles.activatedMode:undefined} onClick={() => getMonthHistory(inputState, state, setState)} disabled={validateDateInput()}>History of Target Month</button>
            <button type="button" className={state.currentVisMode===visualizationModes.Interval?styles.activatedMode:undefined} onClick={() => getOpenMeteoData(inputState, state, setState)} disabled={validateIntervalInput()}>Whole Interval (max 10 years)</button>
        </div>
    )

    function validateIntervalInput() {
        // validate input
        if (inputState.latitude == undefined || inputState.longitude == undefined) {
            return true
        }
        if (!(!Number.isNaN(inputState.latitude) && !Number.isNaN(inputState.longitude) && inputState.startDate && inputState.endDate && Number(inputState.endDate.slice(0, 4)) - Number(inputState.startDate.slice(0, 4)) <= 10)) {
            return true
        }
        return false
    }

    // this is also the function used for monthly history 
    function validateDateInput() {
        // validate input
        if (inputState.latitude == undefined || inputState.longitude == undefined) {
            return true
        }
        if (!(!Number.isNaN(inputState.latitude) && !Number.isNaN(inputState.longitude) && inputState.targetDate && inputState.startDate && inputState.endDate)) {
            return true
        }
        return false
    }
}