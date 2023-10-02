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
            const editedTask = await setDoc(TaskReference, {
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
            const taskSnapshot = await deleteDoc(TaskReference);
            setRerender(!rerender)
        } catch (error) {
            console.log(error)
        }
    }

    const ToggleComplete = async () => {
        const TaskReference = doc(firestore, `Users/${userID}/Tasks/${task.id}`)
        try {

            const taskSnapshot = await getDoc(TaskReference);
            const toggledTaskState = taskSnapshot?.data()?.state == "Incomplete" ? await setDoc(TaskReference, {
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
                {state == "Incomplete" && <p>{name}</p>}
                {state == "Complete" && <p style={{ textDecoration: "line-through" }}>{name}</p>}
                <p>P{priority}</p>
            </div>
            <div className="task-options">
                {state == "Incomplete" && <p onClick={ToggleComplete}>Mark As Done</p>}
                {state == "Complete" && <p onClick={ToggleComplete}>Mark As Not Done</p>}
                <p onClick={deleteTask}>Delete Task</p>
                <p onClick={editTask}>Edit Task</p>
            </div>

        </div>
    )
}

export default Task