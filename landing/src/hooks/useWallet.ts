import { usePrivy } from '@privy-io/react-auth';

export function useWallet() {
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
