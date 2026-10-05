import beer from '../assets/beer-bottle.png'

export default function BeerCount({
  count = 0,
  max = 12,
  beerSrc = beer,
  size = 10,
  className,
  ariaLabel,
  maxIcons = 6, // Maximum number of icons to display
}: {
  count?: number; 
  max?: number;
  beerSrc?: string; 
  emptyBeerSrc?: string;
  size?: number; 
  className?: string; 
  ariaLabel?: string;
  maxIcons?: number;
}) {
  const safeMax = max;
  const n = Math.max(0, Math.min(count, safeMax));
  const displayCount = Math.min(n, maxIcons); // Cap at maxIcons
  const remainder = n > maxIcons ? n - maxIcons : 0; // Calculate remainder

  return (
    <div className="group relative inline-flex items-center gap-0.5">
      {/* Beer bottle icons (capped at maxIcons) */}
      <div
        className={`inline-flex items-center gap-0.5 sm:gap-1 ${className ?? ""}`}
        role="img"
        aria-label={ariaLabel ?? `Beers consumed: ${n} of ${safeMax}`}
      >
        {Array.from({ length: displayCount }).map((_, i) => (
          <img 
            key={i} 
            src={beerSrc} 
            alt="beer bottle" 
            width={size} 
            height={size}
            className="inline-block w-3 sm:w-4" 
            draggable={false} 
          />
        ))}
      </div>
      
      {/* +N remainder badge */}
      {remainder > 0 && (
        <span className="ml-1 text-xs font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
          +{remainder}
        </span>
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          {n} {n === 1 ? 'Pint' : 'Pints'} consumed
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}