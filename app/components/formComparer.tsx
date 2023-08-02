'use client'

import { useState } from "react"
import Form from "./form"
import styles from '../styles/form.module.css'

export default function FormComparer() {
    const [activeForms, setForms] = useState([0])
    const [idCounter, setIdCounter] = useState(1)
    return(
        <div className={styles.formList}>
            {activeForms.map((i) => {return <Form key={i} formId={i} formHook={[activeForms, setForms]}></Form>})}
            <button type="button" onClick={addSeries} className={styles.addButton}>+ Add series</button>
        </div>
    )

    function addSeries() {
        setForms([...activeForms, idCounter])
        setIdCounter(idCounter+1)
    }
}