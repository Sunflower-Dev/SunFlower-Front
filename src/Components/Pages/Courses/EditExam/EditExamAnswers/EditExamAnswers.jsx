import { useRef, useState } from 'react'
import classes from '../EditExam.module.css'
const EditExamAnswers = (props) => {

    const [ActiveAnswer, SetActiveAnswer] = useState(props.CorrectAnswer)
    const RefA = useRef(null)
    const RefB = useRef(null)
    const RefC = useRef(null)
    const RefD = useRef(null)

    const SetActiveClickHandler = Selected => {
        SetActiveAnswer(Selected)
        props.onChange(props.id,
            {
                A: RefA.current.value,
                B: RefB.current.value,
                C: RefC.current.value,
                D: RefD.current.value,
                CorrectAnswer: Selected
            })
    }
    const OnInputsChange = () => {
        props.onChange(props.id,
            {
                A: RefA.current.value,
                B: RefB.current.value,
                C: RefC.current.value,
                D: RefD.current.value,
                CorrectAnswer: ActiveAnswer
            })
    }

    return (
        <div className={`${classes.AnswerContainer}`}>
            <div className={`${classes.inputContainer} `}>
                <label className={classes.label}>Answer A</label>
                <input
                    type="text"
                    placeholder="Answer A"
                    className={classes.input}
                    ref={RefA}
                    value={props.A}
                    onChange={OnInputsChange} />
                <img src={ActiveAnswer === 'A' ? "/svg/Tick-circle-green.svg" : "/svg/Tick-circle.svg"} alt="" onClick={() => SetActiveClickHandler('A')} />
            </div>
            <div className={`${classes.inputContainer} `}>
                <label className={classes.label}>Answer B</label>
                <input
                    type="text"
                    placeholder="Answer B"
                    className={classes.input}
                    ref={RefB}
                    value={props.B}
                    onChange={OnInputsChange} />
                <img src={ActiveAnswer === 'B' ? "/svg/Tick-circle-green.svg" : "/svg/Tick-circle.svg"} alt="" onClick={() => SetActiveClickHandler('B')} />
            </div>
            <div className={`${classes.inputContainer} `}>
                <label className={classes.label}>Answer C</label>
                <input
                    type="text"
                    placeholder="Answer C"
                    className={classes.input}
                    ref={RefC}
                    value={props.C}
                    onChange={OnInputsChange} />
                <img src={ActiveAnswer === 'C' ? "/svg/Tick-circle-green.svg" : "/svg/Tick-circle.svg"} alt="" onClick={() => SetActiveClickHandler('C')} />
            </div>
            <div className={`${classes.inputContainer} `}>
                <label className={classes.label}>Answer D</label>
                <input
                    type="text"
                    placeholder="Answer D"
                    className={classes.input}
                    ref={RefD}
                    value={props.D}
                    onChange={OnInputsChange} />
                <img src={ActiveAnswer === 'D' ? "/svg/Tick-circle-green.svg" : "/svg/Tick-circle.svg"} alt="" onClick={() => SetActiveClickHandler('D')} />
            </div>
        </div>
    )
}

export default EditExamAnswers