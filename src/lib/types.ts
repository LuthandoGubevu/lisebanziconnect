import type { Timestamp } from 'firebase/firestore';

export interface Question {
  id: string;
  name: string;
  question: string;
  answer: string;
  createdAt: Timestamp;
}

export interface Story {
  id: string;
  title: string;
  story: string;
  author: string;
  createdAt: Timestamp;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp;
}
