import { User } from 'firebase/auth'
import '../styles/Todo.css'
import { FormEvent, useEffect, useRef } from 'react'
import { addDoc, collection, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '../firebase'

interface PropType {
    user: User
}

const firestore = getFirestore(app);


const Todo = ({ user }: PropType): JSX.Element => {




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
            }
            else {
                console.log("user already present in firestore:", result.docs[0].data())
            }
        }
        checkUser()
    }, [])

    const taskSubmitHandler = (e: FormEvent) => {
        e.preventDefault();

        // Access the values using refs
        const taskName = taskNameRef.current?.value;
        const taskPriority = taskPriorityRef.current?.value;

        // Now you can use taskName and taskPriority as needed
        console.log('Task Name:', taskName);
        console.log('Task Priority:', taskPriority);

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
                <input type="text" placeholder='task name' ref={taskNameRef} />
                <input type="number" placeholder='task priority' ref={taskPriorityRef} />
                <button type='submit'></button>
            </form>

            <main className='tasksContainer'>
                {/* Display tasks here */}
            </main>
        </div>
    )
}

export default Todo
