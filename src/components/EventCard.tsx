interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function EventCard({
  title,
  date,
  time,
  location,
  description,
}: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-strathmore-blue mb-2">{title}</h3>
      <p className="text-gray-600 mb-1">{date} at {time}</p>
      <p className="text-gray-600 mb-4">{location}</p>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
}