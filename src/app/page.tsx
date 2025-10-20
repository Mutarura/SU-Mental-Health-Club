import Hero from '../components/home/Hero';
import QuoteCarousel from '../components/home/QuoteCarousel';
import MissionSection from '../components/home/MissionSection';
import EventsPreview from '../components/home/EventsPreview';
import MonthlyAwareness from '../components/home/MonthlyAwareness';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <QuoteCarousel />
      <MonthlyAwareness />
      <MissionSection />
      <EventsPreview />
    </div>
  );
}
