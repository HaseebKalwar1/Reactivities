import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  },[activityStore])

    
/* without  Axios Method 
  useEffect(() => {
    fetch('http://localhost:5002/api/activities')
      .then(response => response.json())
      .then(data => setActivities(data))
      .catch(error => console.error(error));
  }, []);
*/



if(activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

return (
  <>
    <NavBar />
    <Container style={{ marginTop: '7em' }}>
      <ActivityDashboard  />
    </Container>
  </>
);
}

export default observer(App);