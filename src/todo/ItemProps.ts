export interface ItemProps {
  _id?: string;
  text: string;
  date?: string; // ISO string or undefined if not set by server
  close?: boolean; // optional boolean flag
}
