export default function MonthlyAwareness() {
  return (
    <section className="max-w-5xl mx-auto my-10 px-4">
      <div className="bg-su-blue text-white p-8 rounded-2xl shadow-md text-center">
        <div className="flex justify-end">
          <div className="w-12 h-12 rounded-full bg-su-gold flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">
          October: Mental Health Awareness Month
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          Join us in promoting mental wellness and supporting your peers across campus. 
          Together, we can break the stigma and create a more supportive community.
        </p>
        <div className="mt-6">
          <div className="w-16 h-1 bg-su-gold mx-auto"></div>
        </div>
      </div>
    </section>
  );
}