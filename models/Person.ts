import * as Crypto from 'expo-crypto';

export interface Person {
  id: string;
  name: string;
  email: string;
  details: string;
  photoUri?: string;
}

// Produces a uniquely identified, empty contact ready to be filled in by the edit screen.
export function createBlankPerson(): Person {
  return { id: Crypto.randomUUID(), name: '', email: '', details: '' };
}
