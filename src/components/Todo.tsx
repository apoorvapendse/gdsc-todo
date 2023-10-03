import { User } from 'firebase/auth'
import '../styles/Todo.css'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { DocumentData, QueryDocumentSnapshot, addDoc, collection, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '../firebase'
import Task from './Task'
import { DocumentReference } from 'firebase/firestore/lite'
import PomoDoro from './PomoDoro'

interface PropType {
    user: User
}
interface Task {
    name: String;
    priority: number;
    state: "Complete" | "Incomplete"

}





const firestore = getFirestore(app);


const Todo = ({ user }: PropType): JSX.Element => {
    const [currentUser, setCurrentUser] = useState<DocumentReference<DocumentData, DocumentData> | QueryDocumentSnapshot<DocumentData, DocumentData>>();
    const [tasks, setTasks] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>();
    const [rerender, setRerender] = useState<boolean>(false);
    const [isPomoDoro, setIsPomoDoro] = useState<boolean>(false);

    //useEffect to createNewUser in firestore if he is already not present
    useEffect(() => {
        console.log("useeffect running")

        //checks whether user is already present in the firestore
        async function checkUser() {
            const userRef = collection(firestore, "Users");
            const userQuery = query(userRef, where("email", "==", user.email));
            const result = await getDocs(userQuery);
            if (result.docs.length == 0) {
                const newUser = await addDoc(userRef, {
                    email: user.email
                })

                console.log("User created successfully:", newUser)
                setCurrentUser(newUser)
            }
            else {
                console.log("user already present in firestore:", result.docs[0].data())
                setCurrentUser(result.docs[0])
            }
        }
        checkUser()

    }, [])
    useEffect(() => {
        if (currentUser)
            updateTasks(currentUser.id)
    }, [currentUser, rerender])


    const updateTasks = async (currID: string) => {
        const TasksRef = collection(firestore, `Users/${currID}/Tasks`);
        const TaskDocs = await getDocs(TasksRef);
        const tasks = TaskDocs.docs;

        const prevTasks: QueryDocumentSnapshot<DocumentData, DocumentData>[] = []
        tasks.forEach((item) => {
            prevTasks.push(item)
        })

        prevTasks.sort((a, b) => a.data().priority - b.data().priority)


        setTasks(prevTasks)
        console.log(tasks)
    }

    const taskSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();

        // Access the values using refs
        const taskName = taskNameRef.current?.value;
        const taskPriority = taskPriorityRef.current?.value;

        // Now you can use taskName and taskPriority as needed
        console.log('Task Name:', taskName);
        console.log('Task Priority:', taskPriority);


        const currID = currentUser?.id;
        console.log(currID)

        const userReference = collection(firestore, `Users/${currID}/Tasks`);
        const task: Task = {
            name: taskName as string,
            priority: taskPriority != undefined ? +taskPriority : 1,
            state: "Incomplete"
        }

        const newTask = await addDoc(userReference, task);
        console.log("TaskAdded:", newTask);

        if (currID)
            updateTasks(currID);
        // Clear the form inputs if needed


        if (taskNameRef.current) {
            taskNameRef.current.value = '';
        }
        if (taskPriorityRef.current) {
            taskPriorityRef.current.value = '';
        }
    }

    const taskNameRef = useRef<HTMLInputElement>(null);
    const taskPriorityRef = useRef<HTMLInputElement>(null);
    if (isPomoDoro) {
        return <PomoDoro />
    }

    return (
        <div className="mainTodoContainer">
            <header>
                <h3>Welcome {user.displayName}</h3>
                {
                    user.photoURL && <div style={{ display: "flex", justifyContent: "center" }}>
                        <button style={{ padding: "3px" }} onClick={() => setIsPomoDoro(true)}>Pomodoro</button>
                        <img src={user.photoURL} alt="" />
                    </div>
                }
            </header>




            <form className='tasksAdder' onSubmit={taskSubmitHandler} >
                Enter your task
                <input type="text" placeholder='task name' ref={taskNameRef} required />
                <input type="number" placeholder='task priority' ref={taskPriorityRef} required />
                <button type='submit'>Add Task</button>
            </form>

            <main className='tasksContainer'>
                {/* Display tasks here */}
                {tasks && tasks.map((item) =>
                    <Task task={item} userID={currentUser?.id} setRerender={setRerender} rerender={rerender} />
                )}
            </main>
        </div>
    )
}

export default Todo
