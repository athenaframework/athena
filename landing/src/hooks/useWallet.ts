import { usePrivy } from '@privy-io/react-auth';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID as string;

function useWalletReal() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const walletAddress = user?.wallet?.address;
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null;

  return {
    ready,
    connected: authenticated,
    address: walletAddress,
    shortAddress,
    connect: login,
    disconnect: logout,
  };
}

function useWalletMock() {
  return {
    ready: true,
    connected: false,
    address: null,
    shortAddress: null,
    connect: () => alert('Wallet connection is disabled (VITE_PRIVY_APP_ID is not configured).'),
    disconnect: () => {},
  };
}

export const useWallet = PRIVY_APP_ID ? useWalletReal : useWalletMock;

