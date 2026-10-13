import {
  Utensils,
  ShoppingBag,
  CarFront,
  House,
  HeartPulse,
  GraduationCap,
  ReceiptText,
  Clapperboard,
  Plane,
  Banknote,
  Gift,
  ChartNoAxesCombined,
  Dumbbell,
  PawPrint,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const categoryIconMap: Record<string, LucideIcon> = {
  food: Utensils,
  shopping: ShoppingBag,
  transport: CarFront,
  home: House,
  health: HeartPulse,
  education: GraduationCap,
  bills: ReceiptText,
  entertainment: Clapperboard,
  travel: Plane,
  salary: Banknote,
  gift: Gift,
  investment: ChartNoAxesCombined,
  fitness: Dumbbell,
  pets: PawPrint,
};

export interface CategoryIconData {
  category_id: number;
  icon: string;
}

export function createCategoryIconLookup(categories: CategoryIconData[]) {
  return new Map(
    categories.map((category) => [category.category_id, category.icon]),
  );
}

export function getCategoryIcon(iconName: string | undefined): LucideIcon {
  if (!iconName) return Wallet;

  return categoryIconMap[iconName] ?? Wallet;
}

export function getCategoryIconById(
  categoryId: number,
  categoryIcons: Map<number, string>,
): LucideIcon {
  return getCategoryIcon(categoryIcons.get(categoryId));
}
