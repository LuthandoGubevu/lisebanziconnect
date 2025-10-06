import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

// This is a typed event emitter.
// We can define the event names and the payload types for each event.
interface TypedEventEmitter {
  on(event: 'permission-error', listener: (error: FirestorePermissionError) => void): this;
  off(event: 'permission-error', listener: (error: FirestorePermissionError) => void): this;
  emit(event: 'permission-error', error: FirestorePermissionError): boolean;
}

class TypedEventEmitter extends EventEmitter {}

export const errorEmitter = new TypedEventEmitter();
