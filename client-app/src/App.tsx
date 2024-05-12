import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5002/api/activities')
    .then(response => {
        setActivities(response.data);
    });
  },[])

    
/* without  Axios Method 
  useEffect(() => {
    fetch('http://localhost:5002/api/activities')
      .then(response => response.json())
      .then(data => setActivities(data))
      .catch(error => console.error(error));
  }, []);
*/

  return (
    <div>
        <h1>Reactivities</h1>
        <ul>
          {activities.map((activity: any) => (
             <li key={activity.id}>
              {activity.title}
             </li> 
          ))}
        </ul>
    </div>
  ) 

}

export default App
