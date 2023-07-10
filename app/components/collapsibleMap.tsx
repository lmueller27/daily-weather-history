import { faChevronDown, faChevronUp, faLocationDot, faMapLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Draggable, Map, Point } from "pigeon-maps"
import { inputState, myColors } from "../shared/utils"
import { useRef, useState } from "react"
import styles from '../styles/form.module.css'

export default function CollapsibleMap({ inputState, setInputState, center, setCenter }:
    {
        inputState: inputState,
        setInputState: React.Dispatch<React.SetStateAction<inputState>>,
        center: [number, number], setCenter: React.Dispatch<React.SetStateAction<[number, number]>>
    }) {

    const [zoom, setZoom] = useState(11)
    const [mapOpen, setMapOpen] = useState(true);

    const mapRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.mapGroup}>
            <button
                className={styles.mapToggleButton}
                style={mapOpen ? { borderBottomLeftRadius: '0px' } : { borderBottomLeftRadius: '10px' }}
                type="button"
                onClick={() => setMapOpen(!mapOpen)}>
                {mapOpen ?
                    <p>
                        <FontAwesomeIcon icon={faChevronUp} color={myColors.IconBlue} />
                        Collapse Map
                    </p> :
                    <p>
                        <FontAwesomeIcon icon={faChevronDown} color={myColors.IconBlue} />
                        Expand Map
                        <FontAwesomeIcon icon={faMapLocationDot} color={myColors.IconBlue} />
                    </p>}
            </button>
            <div
                ref={mapRef}
                className={styles.mapSpace}
                style={mapOpen ? { height: '300px' } : { height: "25px" }}>
                <Map
                    height={300}
                    defaultCenter={[50.8, 6.10]}
                    defaultZoom={11}
                    center={center}
                    zoom={zoom}
                    mouseEvents={mapOpen}
                    touchEvents={mapOpen}
                    onClick={({ latLng }) => updateMarker(latLng)}
                    onBoundsChanged={({ center, zoom }) => {
                        setCenter(center)
                        setZoom(zoom)
                    }}>
                    <Draggable
                        offset={[6, 20]}
                        anchor={[Number(inputState.latitude), Number(inputState.longitude)]}
                        onDragEnd={updateMarker}>
                        {(!Number.isNaN(inputState.latitude)
                            && !Number.isNaN(inputState.longitude))
                            && (inputState.latitude != undefined
                                && inputState.longitude != undefined) ?
                            <FontAwesomeIcon icon={faLocationDot} color={myColors.IconBlue} /> : null}
                    </Draggable>
                </Map>
            </div>
        </div>
    )

    function updateMarker(anchor: Point) {
        setInputState({ ...inputState, latitude: anchor[0], longitude: anchor[1] })
    }
}