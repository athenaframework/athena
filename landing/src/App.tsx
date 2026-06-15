import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';
import Home from './pages/Home';

gsap.registerPlugin(ScrollTrigger);

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID as string;

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  if (!PRIVY_APP_ID) {
    return <Home />;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#4A90C2',
        },
        loginMethods: ['wallet', 'email', 'google'],
        defaultChain: base,
        supportedChains: [base, baseSepolia],
      }}
    >
      <Home />
    </PrivyProvider>
  );
}
