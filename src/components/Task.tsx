import '../styles/Task.css'
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

type TaskType = {
    task: QueryDocumentSnapshot<DocumentData, DocumentData>
}

const Task = ({ task }: TaskType) => {

    let { name, priority } = task.data();
    return (
        <div className="task-body">
            <div className="task-name">
                <p>{name}</p>
                <p>P{priority}</p>
            </div>
            <div className="task-options">
                <p>Mark As Done</p>
                <p>Edit Task</p>
            </div>

        </div>
    )
}

export default Task