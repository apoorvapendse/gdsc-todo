import { useState } from 'react'
import '../styles/Todo.css'
const PomoDoro = () => {
    const [timerStarted, setIsTimerStarted] = useState<boolean>(false);


    const startTimer = () => {
        console.log("timer started")
        let minutes = document.querySelector(".minutes") as HTMLElement;
        let seconds = document.querySelector(".seconds") as HTMLElement;

        let totalSeconds = 25 * 60;
        setIsTimerStarted(true);
        setInterval(() => {
            const currentMinutes = Math.floor(totalSeconds / 60);
            const currentSeconds = (totalSeconds % 60);
            console.log(currentMinutes, currentSeconds)
            totalSeconds--;

            minutes.innerText = String(currentMinutes).padStart(2, "0");
            seconds.innerText = String(currentSeconds).padStart(2, "0");
        }, 1000)

    }

    const quitPomodoro = () => {
        console.log("quitting...")
    }

    return (

        <div className='mainTodoContainer' style={{ alignItems: "center", justifyContent: 'center' }}>

            <div className="pomoDoroContainer" style={{ display: 'flex', flexDirection: "column", gap: "12px" }}>
                <button onClick={startTimer} style={{ padding: "5px", minWidth: "50vw" }} disabled={timerStarted == true}>Start Pomodoro</button>

                <div className="timer" style={{ height: "20vh", width: "100%", backgroundColor: "black", display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                    <h1 className="minutes" style={{ fontSize: '4rem' }}>25</h1>
                    <h1>:</h1>
                    <h1 className="seconds" style={{ fontSize: '4rem' }}>00</h1>
                </div>

            </div>
            {timerStarted == true && <button onClick={quitPomodoro}> Quit Pomodoro</button>}



        </div>




    )
}

export default PomoDoro