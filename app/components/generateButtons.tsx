import { getDateHistory, getMonthHistory, getOpenMeteoData, getWeekHistory } from "../shared/openMeteoInterface";
import { formState, inputState, inputValidation, visualizationModes } from "../shared/utils";
import styles from '../styles/form.module.css'

export function GenerateButtons({ state, setState, inputState, setInputState, inputValidation, setInputValidation }: { state: formState, setState: React.Dispatch<React.SetStateAction<formState>>, inputState: inputState, setInputState: React.Dispatch<React.SetStateAction<inputState>>, inputValidation:inputValidation, setInputValidation: any }) {
    return (
        <div className={styles.generateButtons}>
            <p>Show Data For:</p>
            <button type="button" className={state.currentVisMode === visualizationModes.DateHistory ? styles.activatedMode : undefined} onClick={() => getDateHistory(inputState, state, setState)} disabled={!validateDateInput()}>History of Target Date</button>
            <button type="button" className={state.currentVisMode === visualizationModes.WeekHistory ? styles.activatedMode : undefined} onClick={() => getWeekHistory(inputState, state, setState)} disabled={!validateDateInput()}>History of Target Week</button>
            <button type="button" className={state.currentVisMode === visualizationModes.MonthHistory ? styles.activatedMode : undefined} onClick={() => getMonthHistory(inputState, state, setState)} disabled={!validateDateInput()}>History of Target Month</button>
            <button type="button" className={state.currentVisMode === visualizationModes.Interval ? styles.activatedMode : undefined} onClick={() => getOpenMeteoData(inputState, state, setState)} disabled={!validateIntervalInput()}>Whole Interval (max 10 years)</button>
        </div>
    )
    
    /**
     * 
     * @returns true if input is INVALID
     */
    function validateIntervalInput() {
        // validate input
        const ltTenYears = Number(inputState.endDate.slice(0, 4)) - Number(inputState.startDate.slice(0, 4)) <= 10
        return inputValidation.lat && inputValidation.long && inputValidation.start && inputValidation.end && ltTenYears
        
    }

    /**
     * 
     * @returns true if input is INVALID
     */
    function validateDateInput() {
        // validate input but check target date and interval extra
        const validInterval = new Date(inputState.startDate).valueOf() < new Date(inputState.endDate).valueOf() && Number(inputState.startDate.slice(0, 4)) >= 1940
        return inputValidation.lat && inputValidation.long && (inputState.targetDate?true:false) && validInterval
    }
}