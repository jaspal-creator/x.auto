import { createContext, useContext, useEffect, useState } from 'react';
import { NetworkStatusContextType, NetworkStatusProviderProps } from './types';

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true
});

export const useNetworkStatus = (): NetworkStatusContextType => {
  return useContext(NetworkStatusContext);
};

export const NetworkStatusProvider = ({ children }: NetworkStatusProviderProps) => {
  const [isOnline, setIsOnline] = useState(true);

  const checkConnection = async () => {
    try {
      const result = await window.network.checkOnline();
      setIsOnline(result);
    } catch {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkConnection();

    const interval = setInterval(() => {
      checkConnection();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>{children}</NetworkStatusContext.Provider>
  );
};
