import styles from '../styles/form.module.css'
import FormLegend from './legend'
import { formState } from '../shared/utils'

export function PlotControls({ props, state, setState, width }: { props: any, state: formState, setState: React.Dispatch<React.SetStateAction<formState>>, width: any }) {
    return (
        <div className={styles.figureControls}>
            <FormLegend width={width} state={state} setState={setState}></FormLegend>
            {props.hook[0].length > 1 ? <button type="button" onClick={selfRemove} className={styles.removeButton}>&mdash; Remove series</button> : null}

        </div>
    )

    function selfRemove() {
        let copy = props.hook[0].slice(0)
        copy = copy.filter((i: number) => i !== props.formId)
        props.hook[1](copy)
    }
}