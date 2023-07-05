import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formState, myColors } from "../shared/utils"
import CollapsibleMap from "./collapsibleMap"
import styles from './form.module.css'
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons"

export function InputSpace({ state, setState }: { state: formState, setState: React.Dispatch<React.SetStateAction<formState>> }) {
    return (
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
    )

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => { setState({ ...state, latitude: Number(position.coords.latitude.toFixed(2)), longitude: Number(position.coords.longitude.toFixed(2)) }) }/*, errorFunction*/);
        }
        /** Todo: handle errors. getCurrentPosition takes an error function as second argument  */
    }
}