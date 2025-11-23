import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full" dir="rtl">
      <div className="flex gap-2 pb-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge
            variant={selectedCategory === null ? 'default' : 'secondary'}
            className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm hover-elevate active-elevate-2"
            onClick={() => onSelectCategory(null)}
            data-testid="category-all"
          >
            الكل
          </Badge>
        </motion.div>
        {categories.map((category) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm hover-elevate active-elevate-2"
              onClick={() => onSelectCategory(category)}
              data-testid={`category-${category}`}
            >
              {category}
            </Badge>
          </motion.div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
