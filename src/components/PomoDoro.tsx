import { useState } from 'react'
import '../styles/Todo.css'
import Todo from './Todo';
import { User } from 'firebase/auth';

interface PropType {
    user: User
}
const PomoDoro = ({ user }: PropType) => {
    const [timerStarted, setIsTimerStarted] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<any>(null);
    const [goBack, setGoBack] = useState<boolean>(false);

    const startTimer = () => {
        console.log("timer started")
        let minutes = document.querySelector(".minutes") as HTMLElement;
        let seconds = document.querySelector(".seconds") as HTMLElement;

        let totalSeconds = 25 * 60 - 1;
        setIsTimerStarted(true);

        const interval = setInterval(() => {
            console.log("hello")
            const currentMinutes = Math.floor(totalSeconds / 60);
            const currentSeconds = totalSeconds % 60;
            console.log(currentMinutes, currentSeconds)

            minutes.innerText = String(currentMinutes).padStart(2, "0");
            seconds.innerText = String(currentSeconds).padStart(2, "0");

            if (totalSeconds === 0) {
                clearInterval(intervalId); // Clear the interval when the timer is done
                setIsTimerStarted(false);
            } else {
                totalSeconds--;
            }
        }, 1000);

        setIntervalId(interval); // Store the interval ID in state
    }

    const quitPomodoro = () => {
        console.log("quitting")
        setIsTimerStarted(false); // Set timerStarted to false to disable the Start Pomodoro button
        clearInterval(intervalId); // Clear the interval
        let mins = document.querySelector(".minutes") as HTMLElement
        let sec = document.querySelector(".seconds") as HTMLElement
        mins.innerText = "25"; sec.innerText = "00"
    }
    if (goBack) {
        return <Todo user={user} />

    }

    return (
        <div className='mainTodoContainer' style={{ alignItems: "center", justifyContent: 'center' }}>
            <div className="pomoDoroContainer" style={{ display: 'flex', flexDirection: "column", gap: "12px" }}>
                <button onClick={startTimer} style={{ padding: "5px", minWidth: "50vw" }} disabled={timerStarted === true}>Start Pomodoro</button>
                <div className="timer" style={{ height: "20vh", width: "100%", backgroundColor: "black", display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                    <h1 className="minutes" style={{ fontSize: '4rem' }}>25</h1>
                    <h1>:</h1>
                    <h1 className="seconds" style={{ fontSize: '4rem' }}>00</h1>
                </div>
            </div>
            {timerStarted === true && <button onClick={quitPomodoro}>Quit Pomodoro</button>}
            <button style={{ marginTop: "14px" }} onClick={() => {
                quitPomodoro();
                setGoBack(true)
            }
            }
            >Go Back</button>
        </div>
    )
}

export default PomoDoro
