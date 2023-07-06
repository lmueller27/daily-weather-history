import { DiscreteColorLegend } from "react-vis";
import styles from './form.module.css'
import { myColors } from "../shared/utils";

const ITEMS = [
    {title: 'Max', color: myColors.Red},
    {title: 'Mean', color: myColors.Green},
    {title: 'Min', color: myColors.Blue},
    {title: 'Median', color: myColors.Yellow, strokeStyle: "dashed"},
];

export default function FormLegend({width}:any) {
  return <DiscreteColorLegend className={styles.formLegend} width={width*0.25} height={200} items={ITEMS} />;
}