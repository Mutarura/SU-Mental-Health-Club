import { LightbulbIcon, PeopleIcon, BalanceIcon } from '../../components/icons';

export default function MissionSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-su-blue mb-4">Our Mission</h2>
          <div className="w-24 h-1 bg-su-red mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-su-blue rounded-full flex items-center justify-center mb-4 shadow-md">
              <LightbulbIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-su-blue mb-3">Mental Health Awareness</h3>
            <p className="text-gray-600">
              Promoting understanding and reducing stigma around mental health issues within the Strathmore University community.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-su-red rounded-full flex items-center justify-center mb-4 shadow-md">
              <PeopleIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-su-blue mb-3">Peer Support</h3>
            <p className="text-gray-600">
              Providing peer support and connecting students with professional resources to help them navigate mental health challenges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-su-gold rounded-full flex items-center justify-center mb-4 shadow-md">
              <BalanceIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-su-blue mb-3">Wellness & Growth</h3>
            <p className="text-gray-600">
              Fostering personal growth, resilience, and overall wellness through educational programs and community support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
