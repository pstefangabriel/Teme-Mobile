import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList, IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonButton,
  IonText,
  IonToast,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger, useNetwork } from '../core';
import { ItemContext } from './ItemProvider';
import { AuthContext } from '../auth';

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { logout } = useContext(AuthContext);
  const { networkStatus } = useNetwork();
  const online = networkStatus.connected;

  const [toastMsg, setToastMsg] = useState('');

  // Log and notify when network connectivity changes
  useEffect(() => {
    if (online) {
      log('Network status changed: online');
      setToastMsg('Back online');
    } else {
      log('Network status changed: offline');
      setToastMsg('You are offline');
    }
  }, [online]);

  // Search text state (filters by Name/text)
  const [searchText, setSearchText] = useState('');
  // Filter for Close flag: all | open | closed
  const [closeFilter, setCloseFilter] = useState<'all' | 'open' | 'closed'>('all');

  // Derived filtered list based on search and filter
  const filteredItems = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return (items || [])
      .filter(it => (text ? it.text.toLowerCase().includes(text) : true))
      .filter(it => {
        if (closeFilter === 'closed') return !!it.close;
        if (closeFilter === 'open') return !it.close;
        return true;
      });
  }, [items, searchText, closeFilter]);

  // Infinite scroll state: how many items are currently visible
  const pageSize = 4;
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Reset visible count when the filter or search changes to ensure UX stays consistent
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [searchText, closeFilter]);

  // Also reset when the underlying items list changes significantly
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items]);

  const pageItems = useMemo(() => filteredItems.slice(0, visibleCount), [filteredItems, visibleCount]);
  const infiniteDisabled = pageItems.length >= filteredItems.length;

  const loadMore = async (ev: CustomEvent<void>) => {
    // Simulate a small delay to mimic realistic loading time
    setTimeout(() => {
      setVisibleCount(c => Math.min(filteredItems.length, c + pageSize));
      (ev.target as HTMLIonInfiniteScrollElement).complete();
    }, 300);
  };

  const handleLogout = () => {
    logout?.();
    history.push('/login');
  };

  log('render', { fetching, total: items?.length, filtered: filteredItems.length, visible: visibleCount });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Item List</IonTitle>
          {/* Show network status and provide a Logout action */}
          <IonButtons slot="end">
            <IonText color={online ? 'success' : 'medium'} style={{ marginRight: 12 }}>{online ? 'Online' : 'Offline'}</IonText>
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items"/>
        {/* A small toast to make connectivity changes visible */}
        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={1500} onDidDismiss={() => setToastMsg('')} />

        {/* Search: filter by Name/text, inspired by ionicPagingFilteringApp */}
        <IonSearchbar
          value={searchText}
          onIonInput={e => setSearchText(e.detail.value || '')}
          placeholder="Search by name"
        />

        {/* Filter: select by Close flag (All/Open/Closed) */}
        <IonItem>
          <IonLabel>Filter</IonLabel>
          <IonSelect value={closeFilter} onIonChange={e => setCloseFilter(e.detail.value)} interface="popover">
            <IonSelectOption value="all">All</IonSelectOption>
            <IonSelectOption value="open">Open</IonSelectOption>
            <IonSelectOption value="closed">Closed</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* List: render only currently visible items; the rest load on scroll */}
        {pageItems && (
          <IonList>
            {pageItems.map(({ _id, text, date, close }) => (
              <Item key={_id} _id={_id} text={text} date={date} close={close} onEdit={id => history.push(`/item/${id}`)}/>
            ))}
          </IonList>
        )}
        {filteredItems.length === 0 && !fetching && (
          <IonItem>
            <IonLabel>No items found</IonLabel>
          </IonItem>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>

        <IonInfiniteScroll onIonInfinite={loadMore} threshold="100px" disabled={infiniteDisabled}>
          <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more items..." />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
