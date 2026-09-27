// Mock "client database": outlets, channels, products, ingredients and recipes.
// Replace with real API responses later — shapes are intentionally simple.

export type Outlet = { id: string; name: string; area: string; type: "store" | "flagship" | "airport"; weight: number };
export const outlets: Outlet[] = [
  { id: "sdn", name: "Sadashivnagar Flagship", area: "Sadashivnagar", type: "flagship", weight: 0.2 },
  { id: "ind", name: "Indiranagar", area: "Indiranagar", type: "store", weight: 0.18 },
  { id: "kor", name: "Koramangala", area: "Koramangala", type: "store", weight: 0.16 },
  { id: "hsr", name: "HSR Layout", area: "HSR Layout", type: "store", weight: 0.13 },
  { id: "wtf", name: "Whitefield", area: "Whitefield", type: "store", weight: 0.12 },
  { id: "ecy", name: "Electronic City", area: "Electronic City", type: "store", weight: 0.1 },
  { id: "air", name: "Airport (KIA T2)", area: "Devanahalli", type: "airport", weight: 0.11 },
];
export type CloudKitchen = { id: string; name: string; area: string; capacity: number; serves: string[] };
export const cloudKitchens: CloudKitchen[] = [
  { id: "ck-south", name: "Bommanahalli Hub", area: "Bommanahalli", capacity: 120, serves: ["Koramangala", "HSR Layout"] },
  { id: "ck-central", name: "Yeshwanthpur Hub", area: "Yeshwanthpur", capacity: 100, serves: ["Sadashivnagar"] },
  { id: "ck-airport", name: "Devanahalli Hub", area: "Devanahalli", capacity: 50, serves: ["Airport (KIA T2)"] },
  { id: "ck-jpn", name: "JP Nagar Hub", area: "JP Nagar", capacity: 70, serves: ["JP Nagar"] },
  { id: "ck-mrt", name: "Marathahalli Hub", area: "Marathahalli", capacity: 70, serves: ["Whitefield"] },
  { id: "ck-hbr", name: "Hebbal Hub", area: "Hebbal", capacity: 60, serves: ["Hebbal"] },
  { id: "ck-bnr", name: "Bannerghatta Hub", area: "Bannerghatta Rd", capacity: 55, serves: ["Bannerghatta"] },
  { id: "ck-rrn", name: "RR Nagar Hub", area: "RR Nagar", capacity: 45, serves: ["RR Nagar"] },
  { id: "ck-ecy", name: "Electronic City Hub", area: "Electronic City", capacity: 60, serves: ["Electronic City"] },
  { id: "ck-mlw", name: "Malleshwaram Hub", area: "Malleshwaram", capacity: 50, serves: ["Malleshwaram"] },
  { id: "ck-ind", name: "Indiranagar Hub", area: "Indiranagar", capacity: 65, serves: ["Indiranagar"] },
  { id: "ck-sjp", name: "Sarjapur Hub", area: "Sarjapur", capacity: 55, serves: ["Sarjapur"] },
];
export const cloudKitchen = cloudKitchens[0];

export type ChannelId = "swiggy" | "zomato" | "website" | "corporate" | "social" | "other";
export type Channel = { id: ChannelId; name: string; share: number; takeRate: number; color: string };
export const channels: Channel[] = [
  { id: "swiggy", name: "Swiggy", share: 0.31, takeRate: 28, color: "hsl(var(--chart-1))" },
  { id: "zomato", name: "Zomato", share: 0.26, takeRate: 26, color: "hsl(var(--chart-4))" },
  { id: "website", name: "Own Website", share: 0.17, takeRate: 3, color: "hsl(var(--chart-2))" },
  { id: "corporate", name: "Corporate", share: 0.12, takeRate: 0, color: "hsl(var(--chart-5))" },
  { id: "social", name: "Social Media", share: 0.08, takeRate: 5, color: "hsl(var(--chart-3))" },
  { id: "other", name: "Other Aggregators", share: 0.06, takeRate: 22, color: "hsl(var(--muted-foreground))" },
];

export type Ingredient = { id: string; name: string; unit: "kg" | "L"; price: number };
export const ingredients: Ingredient[] = [
  { id: "choc", name: "Belgian dark chocolate", unit: "kg", price: 950 },
  { id: "cream", name: "Fresh cream", unit: "kg", price: 380 },
  { id: "flour", name: "Refined flour (maida)", unit: "kg", price: 48 },
  { id: "sugar", name: "Castor sugar", unit: "kg", price: 44 },
  { id: "butter", name: "Unsalted butter", unit: "kg", price: 520 },
  { id: "milk", name: "Condensed milk", unit: "kg", price: 260 },
  { id: "cocoa", name: "Cocoa powder", unit: "kg", price: 720 },
  { id: "cheese", name: "Cream cheese", unit: "kg", price: 640 },
  { id: "blueberry", name: "Blueberry compote", unit: "kg", price: 480 },
  { id: "mascarpone", name: "Mascarpone", unit: "kg", price: 1100 },
  { id: "coffee", name: "Espresso concentrate", unit: "L", price: 1400 },
  { id: "mango", name: "Alphonso mango pulp", unit: "kg", price: 220 },
  { id: "pineapple", name: "Pineapple crush", unit: "kg", price: 160 },
  { id: "hazelnut", name: "Hazelnut praline paste", unit: "kg", price: 1800 },
  { id: "almond", name: "Almond flour", unit: "kg", price: 1200 },
  { id: "vanilla", name: "Vanilla extract", unit: "L", price: 3000 },
];

export type Product = {
  id: string; name: string; price: number; unitCost: number; weight: number; shelfLifeHrs: number;
  recipe: { ingredientId: string; grams: number }[]; // grams (or ml) per unit
};
export const products: Product[] = [
  { id: "vanilla", name: "Vanilla Cake", price: 650, unitCost: 250, weight: 0.14, shelfLifeHrs: 48, recipe: [{ ingredientId: "flour", grams: 160 }, { ingredientId: "sugar", grams: 120 }, { ingredientId: "cream", grams: 200 }, { ingredientId: "butter", grams: 60 }, { ingredientId: "vanilla", grams: 8 }] },
  { id: "belgian", name: "Belgian Dark Chocolate Cake", price: 950, unitCost: 390, weight: 0.16, shelfLifeHrs: 48, recipe: [{ ingredientId: "choc", grams: 180 }, { ingredientId: "cream", grams: 220 }, { ingredientId: "flour", grams: 140 }, { ingredientId: "cocoa", grams: 30 }, { ingredientId: "butter", grams: 70 }, { ingredientId: "sugar", grams: 100 }] },
  { id: "redvelvet", name: "Red Velvet Cake", price: 850, unitCost: 330, weight: 0.12, shelfLifeHrs: 48, recipe: [{ ingredientId: "flour", grams: 150 }, { ingredientId: "cheese", grams: 160 }, { ingredientId: "cream", grams: 120 }, { ingredientId: "cocoa", grams: 12 }, { ingredientId: "sugar", grams: 110 }] },
  { id: "cheesecake", name: "Blueberry Cheesecake", price: 1100, unitCost: 520, weight: 0.08, shelfLifeHrs: 36, recipe: [{ ingredientId: "cheese", grams: 380 }, { ingredientId: "blueberry", grams: 150 }, { ingredientId: "butter", grams: 60 }, { ingredientId: "sugar", grams: 70 }] },
  { id: "tiramisu", name: "Tiramisu Jar", price: 320, unitCost: 120, weight: 0.1, shelfLifeHrs: 36, recipe: [{ ingredientId: "mascarpone", grams: 70 }, { ingredientId: "coffee", grams: 20 }, { ingredientId: "cream", grams: 40 }, { ingredientId: "cocoa", grams: 4 }] },
  { id: "mango", name: "Mango Mousse", price: 280, unitCost: 95, weight: 0.08, shelfLifeHrs: 30, recipe: [{ ingredientId: "mango", grams: 120 }, { ingredientId: "cream", grams: 80 }, { ingredientId: "sugar", grams: 25 }] },
  { id: "pineapple", name: "Pineapple Pastry", price: 120, unitCost: 55, weight: 0.12, shelfLifeHrs: 30, recipe: [{ ingredientId: "flour", grams: 35 }, { ingredientId: "pineapple", grams: 40 }, { ingredientId: "cream", grams: 50 }, { ingredientId: "sugar", grams: 20 }] },
  { id: "hazelnut", name: "Hazelnut Praline Cake", price: 1250, unitCost: 610, weight: 0.05, shelfLifeHrs: 72, recipe: [{ ingredientId: "hazelnut", grams: 140 }, { ingredientId: "choc", grams: 120 }, { ingredientId: "cream", grams: 200 }, { ingredientId: "flour", grams: 120 }] },
  { id: "macaron", name: "Macaron Box (6)", price: 540, unitCost: 210, weight: 0.07, shelfLifeHrs: 96, recipe: [{ ingredientId: "almond", grams: 90 }, { ingredientId: "sugar", grams: 90 }, { ingredientId: "butter", grams: 30 }] },
  { id: "brownie", name: "Fudge Brownie Box", price: 450, unitCost: 240, weight: 0.08, shelfLifeHrs: 120, recipe: [{ ingredientId: "choc", grams: 110 }, { ingredientId: "butter", grams: 80 }, { ingredientId: "flour", grams: 60 }, { ingredientId: "sugar", grams: 90 }] },
];

export const productById = (id: string) => products.find((p) => p.id === id)!;
export const outletById = (id: string) => outlets.find((o) => o.id === id)!;
export const channelById = (id: string) => channels.find((c) => c.id === id)!;
