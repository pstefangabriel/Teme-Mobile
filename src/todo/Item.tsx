import React, { memo } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { getLogger } from '../core';
import { ItemProps } from './ItemProps';

const log = getLogger('Item');

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, text, date, close, onEdit }) => {
  const dateText = date ? new Date(date).toLocaleString() : '';
  log('render');
  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonLabel>
        <h2>{text}</h2>
        <p>{dateText}</p>
        <p>Close: {close ? 'Yes' : 'No'}</p>
      </IonLabel>
    </IonItem>
  );
};

export default memo(Item);
