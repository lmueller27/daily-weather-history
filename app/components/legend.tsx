import { DiscreteColorLegend } from "react-vis";
import styles from '../styles/form.module.css'
import { formState, myColors } from "../shared/utils";

export default function FormLegend({ width, state, setState }: { width: number, state: formState, setState: React.Dispatch<React.SetStateAction<formState>> }) {
  const ITEMS = [
    { title: 'Max', color: myColors.Red, disabled: !state.showMax },
    { title: 'Mean', color: myColors.Green, disabled: !state.showMean },
    { title: 'Min', color: myColors.Blue, disabled: !state.showMin },
    { title: 'Median', color: myColors.Yellow, disabled: !state.showMedian },
    { title: 'Trend Lines', color: 'black', strokeStyle: "dashed", disabled: !state.showTrend },
  ];

  const _clickHandler = (item: any) => {
    item.disabled = !item.disabled;
    if (item.title === 'Max') {
      setState({ ...state, showMax: !state.showMax })
    }
    else if (item.title === 'Mean') {
      setState({ ...state, showMean: !state.showMean })
    }
    else if (item.title === 'Min') {
      setState({ ...state, showMin: !state.showMin })
    }
    else if (item.title === 'Median') {
      setState({ ...state, showMedian: !state.showMedian })
    }
    else if (item.title === 'Trend Lines') {
      setState({ ...state, showTrend: !state.showTrend })
    }
  };

  return (
    <DiscreteColorLegend
      className={styles.formLegend}
      width={width * 0.15}
      items={ITEMS}
      onItemClick={item => _clickHandler(item)} />
  )
}