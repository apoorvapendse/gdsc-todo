import { app } from '../firebase';
import '../styles/Task.css'
import { QueryDocumentSnapshot, DocumentData, getFirestore, doc, setDoc } from 'firebase/firestore';

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
            const taskSnapshot = await setDoc(TaskReference, {
                name: newname,
                priority: +newpriority,
                state: "incomplete"
            });
            setRerender(!rerender);
            console.log("hello")

        } catch (error) {
            console.log(error)
        }

    }
    let { name, priority } = task.data();
    return (
        <div className="task-body">
            <div className="task-name" >
                <p>{name}</p>
                <p>P{priority}</p>
            </div>
            <div className="task-options">
                <p>Mark As Done</p>
                <p onClick={editTask}>Edit Task</p>
            </div>

        </div>
    )
}

export default Task