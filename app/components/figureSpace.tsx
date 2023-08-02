import AutoSizer from 'react-virtualized-auto-sizer'
import styles from '../styles/form.module.css'
import { WeatherPlot } from './weatherPlot'
import { PlotControls } from './plotControls'
import { formState } from '../shared/utils'

export default function FigureSpace({formId, formHook, state, setState, loadingState}:
    {
        formId: number,
        formHook: [number[], React.Dispatch<React.SetStateAction<number[]>>],
        state: formState,
        loadingState: boolean,
        setState: React.Dispatch<React.SetStateAction<formState>>
    }) {
    return (<div className={styles.figureSpace}>
        <div className={styles.graphSpace}>
            <AutoSizer disableHeight >
                {({ width }: any) => (
                    <WeatherPlot state={state} setState={setState} width={width} loadingState={loadingState} />
                )}
            </AutoSizer>
        </div>
        <PlotControls formId={formId} formHook={formHook} state={state} setState={setState} width={100} />
    </div>)
}