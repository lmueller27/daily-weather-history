import styles from '../styles/form.module.css'
import FormLegend from './legend'
import { formState } from '../shared/utils'

export function PlotControls({ formId, formHook, state, setState }:
    {
        formId: number,
        formHook: [number[], React.Dispatch<React.SetStateAction<number[]>>],
        state: formState,
        setState: React.Dispatch<React.SetStateAction<formState>>,
        width: any
    }) {
    return (
        <div className={styles.figureControls}>
            <FormLegend state={state} setState={setState}></FormLegend>
            {formHook[0].length > 1 ?
                <button type="button" onClick={selfRemove} className={styles.removeButton}>
                    &mdash; Remove series
                </button> : null}
        </div>
    )

    function selfRemove() {
        formHook[1](formHook[0].filter((i: number) => i !== formId))
    }
}