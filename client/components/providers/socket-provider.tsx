'use client';
import { getSocketToken } from '@/app/actions/socket.action';
import { getServerUrl } from '@/utils/get-server';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children } : SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    let socketInstance: Socket;

    const connectToSocket = async () => {

      const res = await getSocketToken();
      const serverUrl = await getServerUrl();

      if (!res.ok || !res.socketToken) {
        console.error('Failed to retrieve socket token:', res.message);
        return;
      }

      socketInstance = io(serverUrl || 'http://localhost:5000', {
        autoConnect: true,
        transports: ['websocket'],
        auth: {
          token: res.socketToken,
        },
      });

      socketInstance.on('connect', () => {
        console.log('Connected to server');
        setError(null);
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from server');
        setError('Disconnected from server');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setError('Connection error: ' + error.message);
        setIsConnected(false);
      });

      setSocket(socketInstance);
    }

    connectToSocket();

    // Cleanup on unmount
    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="bg-accent p-6 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Connection Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if(!isConnected){
    return (
      <div>Loading...</div>
    )
  }

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
