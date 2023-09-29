import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, UserCredential } from 'firebase/auth';
import { auth } from './firebase';
import Todo from './components/Todo';
import './App.css';

const App = (): JSX.Element => {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState<UserCredential | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginHandler = async () => {
    try {
      setLoading(true);
      const data = await signInWithPopup(auth, provider);
      setUser(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to log in. Please try again.'); // Provide a user-friendly error message.
      setLoading(false);
      console.error(error);
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while authentication is in progress.
  }

  if (user) {
    return <Todo user={user.user} />; // Assuming 'user' contains the user data.
  }

  return (
    <div id="appContainer">
      <button onClick={loginHandler}>Login With Google</button>
      {error && <p className="error">{error}</p>} {/* Display error message if there's an error. */}
    </div>
  );
}

export default App;
