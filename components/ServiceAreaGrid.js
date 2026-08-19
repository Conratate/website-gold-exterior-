import { SERVICE_AREAS } from "@/lib/location";

// The same three route cards appear on the home and about pages — one copy so
// adding a city never means remembering to edit it twice.
export default function ServiceAreaGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {SERVICE_AREAS.map((area) => (
        <div
          key={area.name}
          className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm"
        >
          <h3 className="font-display text-lg font-bold text-charcoal-900">
            {area.name}
          </h3>
          <p className="mt-1 text-sm text-charcoal-600">{area.note}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {area.cities.map((city) => (
              <li
                key={city}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800"
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
