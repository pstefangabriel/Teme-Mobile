import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, date, close, onEdit }) => {
  const dateText = date ? new Date(date).toLocaleString() : '';
  return (
    <IonItem onClick={() => onEdit(_id)}>
      <IonLabel>
        <h2>{text}</h2>
        <p>{dateText}</p>
        <p>Close: {close ? 'Yes' : 'No'}</p>
      </IonLabel>
    </IonItem>
  );
};

export default Item;
