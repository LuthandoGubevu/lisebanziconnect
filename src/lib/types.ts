
import type { Timestamp } from 'firebase/firestore';
import type { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';


export interface Question {
  id: string;
  name: string;
  question: string;
  answer: string;
  createdAt: Timestamp | AdminTimestamp;
}

export interface Story {
  id: string;
  title: string;
  story: string;
  author: string;
  createdAt: Timestamp | AdminTimestamp;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp | AdminTimestamp;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp | AdminTimestamp;
}
