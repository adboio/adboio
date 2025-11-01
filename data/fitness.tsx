// Fitness data types
export interface WeightEntry {
  date: string;
  weight: number;
}

export interface FoodEntry {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
}

export interface Recipe {
  name: string;
  href: string;
  emoji?: string;
}

// Macro targets
export const macroTargets = {
  calories: 2361,
  protein: 225,
  carbs: 201,
  fat: 73,
};

// Recipe list
export const recipes: Recipe[] = [
  {
    name: "anabolic chili",
    href: "https://www.adboio.fit/anabolic-chili",
    emoji: '🫘'
  },
  {
    name: "chicken noodle soup",
    href: "https://www.adboio.fit/chicken-noodle-soup",
    emoji: '🍲'
  },
  {
    name: 'chicken salad',
    href: 'https://www.adboio.fit/chicken-salad',
    emoji: '🥗'
  },
  {
    name: 'pepperoni pizza',
    href: 'https://www.adboio.fit/pepperoni-pizza',
    emoji: '🍕'
  },
  {
    name: 'chicken chorizo breakfast burritos',
    href: 'https://www.adboio.fit/chicken-chorizo-breakfast-burrito',
    emoji: '🌯'
  },
  {
    name: 'high protein mayo',
    href: 'https://www.adboio.fit/high-protein-mayo',
    emoji: '🫙'
  }
];
