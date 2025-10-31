export interface ItemProps {
  id?: string;
  text: string;
  // display-only / server-managed fields
  date?: string; // ISO string from server
  close?: boolean; // optional flag
}
