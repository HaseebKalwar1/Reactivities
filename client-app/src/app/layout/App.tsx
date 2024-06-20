import { Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5002/api/activities')
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
    <>
        <NavBar/> 
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard activities={activities}/>
        </Container>
    </>
  ) 

}

export default App