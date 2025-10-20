export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#3A5DAE]">
      <main className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Strathmore Mental Health Club</h1>
        <p className="mt-6 text-white text-lg">
          We're a student-led community focused on awareness, support, and resilience.
          Our mission is to foster open conversation, reduce stigma, and connect peers with resources.
        </p>
        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
            <p className="mt-2 text-white">
              To create a supportive, inclusive environment where students feel heard, valued,
              and empowered to prioritize mental health and wellbeing.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Our Story</h2>
            <p className="mt-2 text-white">
              Started by passionate students, we've grown into a vibrant community offering
              workshops, awareness campaigns, and peer support circles across campus.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Collaboration</h2>
            <p className="mt-2 text-white">
              We collaborate with the Strathmore Medical Centre and Student Affairs to ensure
              both peer support and professional referrals when needed.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
