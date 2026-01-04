import { useEffect, useRef, useState } from 'react';

export type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed';

export interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export interface UseWebSocketReturn {
  send: (data: string | ArrayBuffer | Blob) => void;
  close: () => void;
  reconnect: () => void;
  status: WebSocketStatus;
  lastMessage: MessageEvent | null;
  error: Event | null;
}

const useWebSocket = (url: string | null, options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    onOpen,
    onClose,
    onMessage,
    onError,
    reconnect: shouldReconnect = false,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = () => {
    if (!url || typeof WebSocket === 'undefined') {
      return;
    }

    try {
      wsRef.current = new WebSocket(url);
      setStatus('connecting');

      wsRef.current.onopen = (event) => {
        setStatus('open');
        reconnectAttemptsRef.current = 0;
        onOpen?.(event);
      };

      wsRef.current.onclose = (event) => {
        setStatus('closed');
        onClose?.(event);

        if (shouldReconnect && reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onmessage = (event) => {
        setLastMessage(event);
        onMessage?.(event);
      };

      wsRef.current.onerror = (event) => {
        setError(event);
        setStatus('closed');
        onError?.(event);
      };
    } catch (err) {
      setError(err as Event);
      setStatus('closed');
    }
  };

  const send = (data: string | ArrayBuffer | Blob) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  };

  const close = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('closed');
  };

  const reconnect = () => {
    close();
    reconnectAttemptsRef.current = 0;
    connect();
  };

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      close();
    };
  }, [url]);

  return { send, close, reconnect, status, lastMessage, error };
};

export default useWebSocket;

