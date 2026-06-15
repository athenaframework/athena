import Navbar from '@/components/Navbar';
import HeroSection from '@/sections/HeroSection';
import ProcessSection from '@/sections/ProcessSection';
import AgentsSection from '@/sections/AgentsSection';
import CapabilitiesSection from '@/sections/CapabilitiesSection';
import DemoSection from '@/sections/DemoSection';
import WorkspaceCTASection from '@/sections/WorkspaceCTASection';
import Footer from '@/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProcessSection />
        <AgentsSection />
        <CapabilitiesSection />
        <DemoSection />
        <WorkspaceCTASection />
      </main>
      <Footer />
    </>
  );
}
