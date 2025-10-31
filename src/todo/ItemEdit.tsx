import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonToggle
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [text, setText] = useState('');
  const [close, setClose] = useState(false);
  const [item, setItem] = useState<ItemProps>();
  const [dirty, setDirty] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Reset guards when switching the edited item (route id changes)
  useEffect(() => {
    setDirty(false);
    setInitialized(false);
  }, [match.params.id]);

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const found = items?.find(it => it._id === routeId);
    setItem(found);

    // Initialize once per route id
    if (!initialized) {
      if (found) {
        setText(found.text);
        setClose(!!found.close);
      } else {
        setText('');
        setClose(false);
      }
      setInitialized(true);
      return;
    }

    // After initialization, only update from store if not dirty and editing an existing item
    if (found && !dirty) {
      setText(found.text);
      setClose(!!found.close);
    }
  }, [match.params.id, items, dirty, initialized]);

  const handleSave = useCallback(() => {
    const editedItem: ItemProps = item ? { ...item, text, close } : { text, close };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  }, [item, saveItem, text, close, history]);

  const onTextChange = (value: string) => {
    setText(value);
    setDirty(true);
  };

  const onCloseChange = (checked: boolean) => {
    setClose(!!checked);
    setDirty(true);
  };

  const dateText = item?.date ? new Date(item.date).toLocaleString() : '';
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput value={text} onIonChange={e => onTextChange(e.detail.value || '')} />
        </IonItem>
        <IonItem>
          <IonLabel>Date</IonLabel>
          <IonInput value={dateText} readonly={true} />
        </IonItem>
        <IonItem>
          <IonLabel>Close</IonLabel>
          <IonToggle checked={close} onIonChange={e => onCloseChange(!!e.detail.checked)} />
        </IonItem>
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
