import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-su-blue to-blue-600 text-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left md:flex md:items-center md:justify-between gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Strathmore Mental Health Club
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-gray-200 leading-relaxed">
              Promoting mental wellness and providing support for the Strathmore University community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
              <Link
                href="/gallery"
                className="bg-su-red hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-xl"
              >
                View Gallery
              </Link>
              <Link
                href="/resources"
                className="bg-white hover:bg-gray-100 text-su-blue font-semibold py-3 px-8 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-xl"
              >
                Explore Resources
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:w-1/2 items-center justify-center relative">
            <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-2xl flex items-center justify-center mt-8 md:mt-0 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/mental-health-club-logo.png.png"
                alt="SU Mental Health Club Logo"
                width={400}
                height={400}
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
