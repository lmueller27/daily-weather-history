import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { formState, inputState, inputValidation, myColors } from "../shared/utils"
import CollapsibleMap from "./collapsibleMap"
import styles from '../styles/form.module.css'
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

export function InputSpace({ inputState, setInputState, inputValidation }: { inputState: inputState, setInputState: React.Dispatch<React.SetStateAction<inputState>>, inputValidation:inputValidation}) {
    const [center, setCenter] = useState<[number, number]>([50.80, 6.10])

    return (
        <div className={styles.inputSpace}>
            <div className={styles.settings}>
            <form className={styles.settingForm} noValidate>
                <button className={styles.locationButton} type="button" onClick={getUserLocation}><FontAwesomeIcon icon={faLocationCrosshairs} color={myColors.IconBlue} /> Use Location</button>
                <div>
                    <label htmlFor="lat">Latitude:&nbsp;</label>
                    <input type="number" data-valid={inputValidation.lat} formNoValidate step="0.01" id="lat" name="lat" value={inputState.latitude} min={-90} max={90} onChange={(e) => { setInputState({ ...inputState, latitude: parseFloat(e.target.value) }) }} />
                </div>
                <div>
                    <label htmlFor="long">Longitude:&nbsp;</label>
                    <input type="number" data-valid={inputValidation.long} required={false} step="0.01" id="long" name="long" value={inputState.longitude} min={-180} max={180} onChange={(e) => { setInputState({ ...inputState, longitude: parseFloat(e.target.value) }) }} />
                </div>
            </form>
            <form className={styles.settingForm}>
                <div>
                    <label htmlFor="targetdate">Target Date:&nbsp;</label>
                    <input type="date" data-valid={inputValidation.target} id="targetdate" name="targetdate" value={inputState.targetDate} min={inputState.startDate} max={inputState.endDate} onChange={(e) => { setInputState({ ...inputState, targetDate: e.target.value }) }} />
                </div>
                <div className={styles.intervalInput}>
                    <label htmlFor="startdate">Interval:&nbsp;</label>
                    <div>
                    <input type="date" data-valid={inputValidation.start} id="startdate" name="startdate" value={inputState.startDate} min="1940-01-01" max={inputState.endDate} onChange={(e) => { setInputState({ ...inputState, startDate: e.target.value }) }} />
                    <label htmlFor="enddate">&nbsp;-&nbsp;</label>
                    <input type="date" data-valid={inputValidation.end} id="enddate" name="enddate" value={inputState.endDate} min={inputState.startDate} max={new Date().toISOString().slice(0, -14)} onChange={(e) => { setInputState({ ...inputState, endDate: e.target.value }) }} />
                    </div>
                </div>
            </form>
            </div>
            <CollapsibleMap inputState={inputState} setInputState={setInputState} center={center} setCenter={setCenter} />
        </div >
    )

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setInputState({ ...inputState, latitude: Number(position.coords.latitude.toFixed(7)), longitude: Number(position.coords.longitude.toFixed(7)) });
                setCenter([position.coords.latitude, position.coords.longitude])
            }/*, errorFunction*/);
        }
        /** Todo: handle errors. getCurrentPosition takes an error function as second argument  */
    }
}