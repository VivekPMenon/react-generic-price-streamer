// import { useState, useEffect, useRef, useCallback } from 'react';
// import {WorkerBasedConnector} from "@/lib/utility/WorkerBasedConnector";
// import {Messenger} from "@/lib/utility/SubscriptionTypes";
// // import {LocalBridge} from "@/lib/utility/LocalBridge";
// import {SubscriptionManager} from "@/lib/utility/SubscriptionManager";
//
// const bridge = new WorkerBasedConnector('./SubscriptionWorker.js');
// // const bridge = new LocalBridge('');
// export const subscriptionManager: Messenger = new SubscriptionManager(bridge);
//
// const useSubscriptionManager = () => {
//     const subscriptionManager = useRef(null);
//
//     const subscribe = useCallback(() => {
//         if (ws.current) {
//             ws.current.close();
//         }
//
//         ws.current = new WebSocket(url);
//
//         ws.current.onopen = () => setReadyState(WebSocket.OPEN);
//         ws.current.onclose = () => setReadyState(WebSocket.CLOSED);
//         ws.current.onerror = () => setReadyState(WebSocket.CLOSING);
//
//         ws.current.onmessage = (event) => {
//             if (onMessage) {
//                 onMessage(event.data);
//             }
//         };
//     }, [url, onMessage]);
//
//     const sendMessage = useCallback((message) => {
//         if (readyState === WebSocket.OPEN && ws.current) {
//             ws.current.send(message);
//         }
//     }, [readyState]);
//
//     const close = useCallback(() => {
//         if (ws.current) {
//             ws.current.close();
//         }
//     }, []);
//
//     useEffect(() => {
//         connect();
//
//         return () => {
//             close();
//         };
//     }, [connect, close]);
//
//     return {
//         readyState,
//         sendMessage,
//         close,
//     };
// };
//
// export default useWebSocket;