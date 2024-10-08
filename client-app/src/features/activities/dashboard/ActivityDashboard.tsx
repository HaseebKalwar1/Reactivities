import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';
import { PagingParams } from '../../../app/models/Pagination';
import InfiniteScroll from 'react-infinite-scroller';

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { loadActivities, setPagingParams, pagination } = activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
}

    /* without  Axios Method 
    useEffect(() => {
      fetch('http://localhost:5002/api/activities')
        .then(response => response.json())
        .then(data => setActivities(data))
        .catch(error => console.error(error));
    }, []);
  */
    useEffect(() => {
      loadActivities();
  }, [loadActivities])
  
    return (
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}
                        >
                            <ActivityList />
                        </InfiniteScroll>
                    )}
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width='10'>
                <Loader active={loadingNext} />
            </Grid.Column>

        </Grid>
    )
})