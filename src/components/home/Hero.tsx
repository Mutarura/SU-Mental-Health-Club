import Link from 'next/link';
import { HeartIcon } from '../../components/icons';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-su-blue to-blue-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left md:flex md:items-center md:justify-between gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Strathmore Mental Health Club
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Promoting mental wellness and providing support for the Strathmore University community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/events"
                className="bg-su-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                See Events
              </Link>
              <Link
                href="/resources"
                className="bg-white hover:bg-gray-100 text-su-blue font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                Explore Resources
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:w-1/2 items-center justify-center">
            <div className="w-full max-w-md aspect-square bg-gradient-to-b from-su-gold to-white/20 rounded-2xl border-4 border-white/20 flex items-center justify-center backdrop-blur-sm mt-8 md:mt-0 shadow-2xl">
              <div className="text-center">
                <HeartIcon className="w-32 h-32 text-su-red mx-auto mb-6" />
                <p className="text-su-blue text-lg font-bold">Mental Wellness</p>
                <p className="text-gray-700 text-sm mt-2">Community Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
