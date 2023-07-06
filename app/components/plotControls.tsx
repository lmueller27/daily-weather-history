import styles from './form.module.css'
import FormLegend from './legend'
import { formState } from '../shared/utils'

export function PlotControls({ props, state, setState, width }: { props: any, state: formState, setState: React.Dispatch<React.SetStateAction<formState>>, width: any }) {
    return (
        <div className={styles.figureControls}>
            <form>
                <input type="checkbox" id={"checkmax" + props.formId} name="checkmax" checked={state.showMax} onChange={(e) => { setState({ ...state, showMax: e.target.checked }) }} />
                <label htmlFor={"checkmax" + props.formId}> Show maximum temp</label>
                <br></br>
                <input type="checkbox" id={"checkmean" + props.formId} name="checkmean" checked={state.showMean} onChange={(e) => { setState({ ...state, showMean: e.target.checked }) }} />
                <label htmlFor={"checkmean" + props.formId}> Show mean temps and the overall median</label>
                <br></br>
                <input type="checkbox" id={"checkmin" + props.formId} name="checkmin" checked={state.showMin} onChange={(e) => { setState({ ...state, showMin: e.target.checked }) }} />
                <label htmlFor={"checkmin" + props.formId}> Show minimum temp</label>
                <br></br>
                <input type="checkbox" id={"checktrend" + props.formId} name="checktrend" checked={state.showTrend} onChange={(e) => { setState({ ...state, showTrend: e.target.checked }) }} />
                <label htmlFor={"checktrend" + props.formId}> Show trend lines</label>
            </form>
            <FormLegend width={width}></FormLegend>
            {props.hook[0].length > 1 ? <button type="button" onClick={selfRemove} className={styles.removeButton}>&mdash; Remove series</button> : null}

        </div>
    )

    function selfRemove() {
        let copy = props.hook[0].slice(0)
        copy = copy.filter((i: number) => i !== props.formId)
        props.hook[1](copy)
    }
}