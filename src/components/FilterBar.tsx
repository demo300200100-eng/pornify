import React from 'react';
import { ChevronRight } from 'lucide-react';
import { VideoCategory } from '../types/video';

interface FilterBarProps {
  categories: VideoCategory[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  sectionTitle?: string;
  onSeeAll?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  sectionTitle = 'All Videos',
  onSeeAll,
}) => {
  // Ensure 'all' is always at the beginning with English label 'All'
  const allCategoryList = React.useMemo(() => {
    const listWithoutAll = categories.filter(c => c.id.toLowerCase() !== 'all');
    return [
      { id: 'all', name: 'All', nameEn: 'All', iconName: 'Sparkles' },
      ...listWithoutAll,
    ];
  }, [categories]);

  const isCurrentActiveAll = 
    !activeCategory || 
    activeCategory.toLowerCase() === 'all';

  return (
    <div className="w-full space-y-6 mb-6 font-sans">
      
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {allCategoryList.map((cat) => {
          const isAll = cat.id === 'all';
          const isActive = isAll ? isCurrentActiveAll : activeCategory.toLowerCase() === cat.id.toLowerCase();
          const displayName = cat.nameEn || cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold scale-102'
                  : 'bg-[#18181e] text-gray-300 hover:text-white hover:bg-[#22222a] border border-white/5'
              }`}
            >
              {displayName}
            </button>
          );
        })}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-5 rounded-full bg-amber-500"></div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            {sectionTitle}
          </h2>
        </div>

        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-400 hover:text-amber-400 transition-colors"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
