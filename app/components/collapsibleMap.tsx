import { faChevronDown, faChevronUp, faLocationDot, faMapLocation, faMapLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Draggable, Map, Point } from "pigeon-maps"
import { formState, myColors } from "../shared/utils"
import { useRef, useState } from "react"
import styles from './form.module.css'

export default function CollapsibleMap({ state, setState }: { state: formState, setState:React.Dispatch<React.SetStateAction<formState>> }) {

    const [center, setCenter] = useState<[number, number]>([50.80, 6.10])
    const [zoom, setZoom] = useState(11)
    const [mapOpen, setMapOpen] = useState(true);

    const mapRef = useRef<HTMLDivElement>(null);

    return (
        <div>
            <button type="button" onClick={()=>setMapOpen(!mapOpen)}>{mapOpen ? <p><FontAwesomeIcon icon={faChevronUp} color={myColors.IconBlue}/> Collapse Map</p> : <p><FontAwesomeIcon icon={faChevronDown} color={myColors.IconBlue}/> Expand Map <FontAwesomeIcon icon={faMapLocationDot} color={myColors.IconBlue}/></p>}</button>
            <div ref={mapRef} className={styles.mapSpace} style={mapOpen?{height: mapRef.current?.scrollHeight+'px'}:{height:"0px"}}>
                <Map
                    height={300}
                    defaultCenter={[50.8, 6.10]}
                    defaultZoom={11}
                    center={center}
                    zoom={zoom}
                    onClick={({ latLng }) => updateMarker(latLng)}
                    onBoundsChanged={({ center, zoom }) => {
                        setCenter(center)
                        setZoom(zoom)
                    }}>
                    <Draggable offset={[6, 20]} anchor={[Number(state.latitude), Number(state.longitude)]} onDragEnd={updateMarker}>
                        <FontAwesomeIcon icon={faLocationDot} color={myColors.IconBlue} />
                    </Draggable>
                </Map>
            </div>
        </div>
    )

    function updateMarker(anchor: Point) {
        setState({ ...state, latitude: anchor[0], longitude: anchor[1] })
    }
}