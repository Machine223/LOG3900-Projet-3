import { SessionType } from './session-type';

export interface ISession {
    type: SessionType;
    timestamp: number;
}
