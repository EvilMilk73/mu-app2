import Dexie from 'dexie';

export const db = new Dexie('Images');
db.version(1).stores({
  images: '++id, sourceUrl, image' // Primary key and indexed props
});