
import { HistoryEvent } from '../../types';

export const learningHistorySeed: HistoryEvent[] = [
  {
    id: 'seed-1',
    timestamp: new Date('2026-04-01').getTime(),
    type: 'resource_consumed',
    title: 'Completed Angela Yu Python Day 1-5',
    source: 'Imported Learning History'
  },
  {
    id: 'seed-2',
    timestamp: new Date('2026-04-15').getTime(),
    type: 'reading_completed',
    title: 'Finished Deep Work Part 1',
    source: 'Imported Learning History'
  }
];
