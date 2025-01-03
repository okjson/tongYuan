export class WebSocketService {
    constructor(url) {
        this.url = url;
        this.connection = null;
    }

    connect() {
        this.connection = new WebSocket(this.url);

        this.connection.onopen = () => {
            console.log('WebSocket connected');
        };

        this.connection.onmessage = (event) => {
            console.log('Received message:', event.data);

        };

        this.connection.onclose = () => {
            console.log('WebSocket closed');
        };

        this.connection.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    send(message) {
        if (this.connection && this.connection.readyState === WebSocket.OPEN) {
            this.connection.send(message);
            console.log('1');
        } else {
            console.error('WebSocket is not connected');
        }
    }
}
const webSocketService = new WebSocketService('ws://192.168.255.151:8769');
webSocketService.connect();

export default webSocketService;