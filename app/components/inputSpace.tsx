import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formState, myColors } from "../shared/utils"
import CollapsibleMap from "./collapsibleMap"
import styles from './form.module.css'
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

export function InputSpace({ state, setState }: { state: formState, setState: React.Dispatch<React.SetStateAction<formState>> }) {
    const [center, setCenter] = useState<[number, number]>([50.80, 6.10])

    return (
        <div className={styles.inputSpace}>
            <form className={styles.settingForm}>
                <button className={styles.locationButton} type="button" onClick={getUserLocation}><FontAwesomeIcon icon={faLocationCrosshairs} color={myColors.IconBlue} /> Use Location</button>
                <label htmlFor="lat">Latitude:</label>
                <input type="number" id="lat" name="lat" value={state.latitude} min={-90} max={90} onChange={(e) => { setState({ ...state, latitude: parseFloat(e.target.value) }) }} />
                <label htmlFor="long">Longitude:</label>
                <input type="number" id="long" name="long" value={state.longitude} min={-180} max={180} onChange={(e) => { setState({ ...state, longitude: parseFloat(e.target.value) }) }} />
                <label htmlFor="targetdate">Target Date:</label>
                <input type="date" id="targetdate" name="targetdate" value={state.targetDate} min={state.startDate} max={state.endDate} onChange={(e) => { setState({ ...state, targetDate: e.target.value }) }} />
                <label htmlFor="startdate">Interval:</label>
                <input type="date" id="startdate" name="startdate" value={state.startDate} min="1940-01-01" max={state.endDate} onChange={(e) => { setState({ ...state, startDate: e.target.value }) }} />
                <label htmlFor="enddate">-</label>
                <input type="date" id="enddate" name="enddate" value={state.endDate} min={state.startDate} max={new Date().toISOString().slice(0, -14)} onChange={(e) => { setState({ ...state, endDate: e.target.value }) }} />
            </form>
            <CollapsibleMap state={state} setState={setState} center={center} setCenter={setCenter} />
        </div >
    )

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => { 
                setState({ ...state, latitude: Number(position.coords.latitude.toFixed(2)), longitude: Number(position.coords.longitude.toFixed(2)) });
                setCenter([position.coords.latitude, position.coords.longitude]) 
            }/*, errorFunction*/);
        }
        /** Todo: handle errors. getCurrentPosition takes an error function as second argument  */
    }
}