import { md6hash } from './md6.js';


export const ws = new WebSocket('ws://localhost:8080');

export function wsSendForm(value: { name: string, password: string }): void {
    const md6 = md6hash();
    value.password = md6.hex(value.password);

    const data = {
        ...value,
        hashName: md6.hex(value.name.toUpperCase())
    }

    ws.send(JSON.stringify({action: 'AUTH', data: JSON.stringify(data)}));
}

export function wsSendPing() {
    ws.send(JSON.stringify({action: 'PING'}));
}

export function wsSendCommand(command: string) {
    const data = {
        command: command
    }
    ws.send(JSON.stringify({action: 'COMMAND', data: JSON.stringify(data)}));
}