import { useWallet } from '@/hooks/useWallet';
import { Wallet } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'white';

interface ConnectWalletButtonProps {
  variant?: Variant;
  className?: string;
  fullLabel?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'text-white gradient-cta hover:gradient-cta-hover hover:shadow-cta',
  secondary:
    'text-deep-blue bg-transparent border border-deep-blue/30 hover:bg-white hover:border-deep-blue/50',
  white:
    'text-deep-blue bg-white hover:bg-white/90',
};

export default function ConnectWalletButton({
  variant = 'primary',
  className = '',
  fullLabel = true,
}: ConnectWalletButtonProps) {
  const { ready, connected, shortAddress, connect, disconnect } = useWallet();

  if (!ready) {
    return (
      <button
        disabled
        className={`font-body font-semibold text-sm px-7 py-3 rounded-button transition-all duration-200 opacity-60 ${variantClasses[variant]} ${className}`}
      >
        Loading…
      </button>
    );
  }

  if (connected) {
    return (
      <button
        onClick={disconnect}
        title="Click to disconnect"
        className={`font-body font-semibold text-sm px-7 py-3 rounded-button transition-all duration-200 inline-flex items-center gap-2 ${variantClasses[variant]} ${className}`}
      >
        <Wallet className="w-4 h-4" />
        {shortAddress}
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      className={`font-body font-semibold text-sm px-7 py-3 rounded-button transition-all duration-200 ${variantClasses[variant]} ${className}`}
    >
      {fullLabel ? 'Connect Wallet' : 'Connect'}
    </button>
  );
}
