import Hero from '../components/home/Hero';
import QuoteCarousel from '../components/home/QuoteCarousel';
import MissionSection from '../components/home/MissionSection';
import EventsPreview from '../components/home/EventsPreview';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <QuoteCarousel />
      <MissionSection />
      <EventsPreview />
    </div>
  );
}
