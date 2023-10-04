import { app } from '../firebase';
import '../styles/Task.css'
import { QueryDocumentSnapshot, DocumentData, getFirestore, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

type TaskType = {
    task: QueryDocumentSnapshot<DocumentData, DocumentData>
    userID: string | undefined
    setRerender: React.Dispatch<React.SetStateAction<boolean>>
    rerender: boolean
}

const firestore = getFirestore(app);

const Task = ({ task, userID, setRerender, rerender }: TaskType) => {



    const editTask = async () => {

        try {
            const newname = prompt("Enter new name")
            const newpriority = prompt("Enter priority (1->high,2->medium,3->low)") as String;

            const TaskReference = doc(firestore, `Users/${userID}/Tasks/${task.id}`)
            const taskSnapshot = await getDoc(TaskReference);
            await setDoc(TaskReference, {
                ...taskSnapshot.data(),
                name: newname,
                priority: newpriority,
            });
            setRerender(!rerender);
            console.log("hello")

        } catch (error) {
            console.log(error)
        }

    }


    const deleteTask = async () => {
        try {

            const TaskReference = doc(firestore, `Users/${userID}/Tasks/${task.id}`)
            await deleteDoc(TaskReference);
            setRerender(!rerender)
        } catch (error) {
            console.log(error)
        }
    }

    const ToggleComplete = async () => {
        const TaskReference = doc(firestore, `Users/${userID}/Tasks/${task.id}`)
        try {

            const taskSnapshot = await getDoc(TaskReference);
            taskSnapshot?.data()?.state == "Incomplete" ? await setDoc(TaskReference, {
                ...taskSnapshot.data(), state: "Complete"
            }) : await setDoc(TaskReference, {
                ...taskSnapshot.data(), state: "Incomplete"
            })
            setRerender(!rerender);
        } catch (error) {
            console.log(error)

        }
    }

    let { name, priority, state } = task.data();
    return (
        <div className="task-body">
            <div className="task-name" >
                {state == "Incomplete" && <p><b>{name}</b></p>}
                {state == "Complete" && <p style={{ textDecoration: "line-through" }}>{name}</p>}
                <p>P{priority}</p>
            </div>
            <div className="task-options">
                {state == "Incomplete" && <img onClick={ToggleComplete} src='https://cdn.pixabay.com/photo/2016/03/31/14/37/check-mark-1292787_640.png' style={{ width: "20px" }} />}
                {state == "Complete" && <p onClick={ToggleComplete}>Mark As Not Done</p>}
                <img src="https://cdn-icons-png.flaticon.com/512/3687/3687412.png" style={{ width: "25px" }} onClick={deleteTask} />
                <img onClick={editTask} style={{ width: "25px", backgroundColor: "white" }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg/1024px-Edit_icon_%28the_Noun_Project_30184%29.svg.png" />
            </div>

        </div>
    )
}

export default Task