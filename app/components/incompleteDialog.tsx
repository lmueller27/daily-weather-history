export default function IncompleteDialog(props:any) {
    return (
        <dialog open>
            <p>Input missing</p>
            <form method="dialog">
                <button onClick={setFlag}>OK</button>
            </form>
        </dialog>
    )

    function setFlag() {
        props.inputHook[1](false)
    }
}