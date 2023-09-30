import { User } from 'firebase/auth'
import '../styles/Todo.css'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { DocumentData, QueryDocumentSnapshot, addDoc, collection, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '../firebase'
import Task from './Task'
import { DocumentReference } from 'firebase/firestore/lite'

interface PropType {
    user: User
}
interface Task {
    name: String;
    priority: number;

}





const firestore = getFirestore(app);


const Todo = ({ user }: PropType): JSX.Element => {
    const [currentUser, setCurrentUser] = useState<DocumentReference<DocumentData, DocumentData> | QueryDocumentSnapshot<DocumentData, DocumentData>>();




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


    const updateTasks = async (currID: string) => {
        const TasksRef = collection(firestore, `Users/${currID}/Tasks`);
        const TaskDocs = await getDocs(TasksRef);
        const tasks = TaskDocs.docs;
        tasks.forEach((item) => {
            console.log(item.data())
        })

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

    return (
        <div className="mainTodoContainer">
            <header>
                <h3>Welcome {user.displayName}</h3>
                {
                    user.photoURL &&
                    <img src={user.photoURL} alt="" />
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
                <Task />
            </main>
        </div>
    )
}

export default Todo
