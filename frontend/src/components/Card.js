export default function Card({ title, value, growth }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h3 className="text-gray-500">{title}</h3>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-green-500 text-sm">{growth}</p>
    </div>
  );
}