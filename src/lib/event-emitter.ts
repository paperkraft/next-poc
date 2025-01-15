import { EventEmitter } from 'events';

const notificationEmitter = new EventEmitter();
notificationEmitter.setMaxListeners(100);
export default notificationEmitter;