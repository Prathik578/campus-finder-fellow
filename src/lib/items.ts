import { useEffect, useState } from "react";
import { z } from "zod";

export const CATEGORIES = [
  "Electronics",
  "Stationery",
  "Bags",
  "Clothing",
  "Accessories",
  "Water Bottles",
  "Documents",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];
export type ItemType = "lost" | "found";
export type ItemStatus = "lost" | "found" | "returned";

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  dateOccurred: string; // YYYY-MM-DD
  image: string | null; // data URL
  type: ItemType;
  status: ItemStatus;
  contactInstructions: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export const itemInputSchema = z.object({
  title: z.string().trim().min(3, "Give the item a short title (3+ characters)").max(80, "Keep the title under 80 characters"),
  description: z.string().trim().min(10, "Add a few details (10+ characters) so it can be identified").max(1000, "Keep it under 1000 characters"),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: "Choose a category" }) }),
  location: z.string().trim().min(2, "Where was it lost or found?").max(100, "Keep the location under 100 characters"),
  dateOccurred: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date")
    .refine((d) => d <= todayISO(), "The date can't be in the future"),
  image: z.string().nullable(),
  type: z.enum(["lost", "found"], { errorMap: () => ({ message: "Choose Lost or Found" }) }),
  contactInstructions: z
    .string()
    .trim()
    .min(5, "Explain how someone can safely reach you or collect the item")
    .max(300, "Keep it under 300 characters"),
});
export type ItemInput = z.infer<typeof itemInputSchema>;

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ---------- filtering ---------- */
export interface Filters {
  q: string;
  status: "all" | ItemStatus;
  category: "all" | Category;
  location: string; // "all" or exact location
  sort: "newest" | "oldest";
}
export const defaultFilters: Filters = { q: "", status: "all", category: "all", location: "all", sort: "newest" };

export function filterItems(items: Item[], f: Filters): Item[] {
  const terms = f.q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const out = items.filter((i) => {
    if (f.status !== "all" && i.status !== f.status) return false;
    if (f.category !== "all" && i.category !== f.category) return false;
    if (f.location !== "all" && i.location !== f.location) return false;
    if (terms.length) {
      const hay = `${i.title} ${i.description} ${i.location} ${i.category}`.toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    return true;
  });
  out.sort((a, b) =>
    f.sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt),
  );
  return out;
}

/* ---------- persistence (localStorage, this browser only) ---------- */
const KEY = "campus-lf-items-v1";
const listeners = new Set<() => void>();

function daysAgo(n: number, h = 10) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, 0, 0, 0);
  return d;
}
function seed(): Item[] {
  const mk = (
    id: string,
    n: number,
    p: Omit<Item, "id" | "createdAt" | "updatedAt" | "dateOccurred" | "image" | "isDemo">,
  ): Item => {
    const d = daysAgo(n);
    return { ...p, id, image: null, isDemo: true, dateOccurred: d.toISOString().slice(0, 10), createdAt: d.toISOString(), updatedAt: d.toISOString() };
  };
  return [
    mk("demo-bottle", 0, { title: "Blue steel water bottle", description: "32oz insulated bottle, navy blue with a mountain sticker and a dent near the base.", category: "Water Bottles", location: "Main Library", type: "found", status: "found", contactInstructions: "Handed in at the Library front desk — ask staff for the lost property box." }),
    mk("demo-calc", 1, { title: "TI-84 Plus calculator", description: "Black graphing calculator in a grey slide case. Initials scratched on the back.", category: "Electronics", location: "Science Building", type: "lost", status: "lost", contactInstructions: "Leave a note with the Science Building reception desk, room S-101." }),
    mk("demo-backpack", 2, { title: "Green canvas backpack", description: "Forest green backpack with a broken left zipper pull and a keychain carabiner.", category: "Bags", location: "Student Union", type: "found", status: "found", contactInstructions: "At the Student Union info desk. Describe the contents to claim it." }),
    mk("demo-notebook", 3, { title: "Spiral notebook — Organic Chem", description: "Yellow 5-subject notebook with handwritten chemistry notes. Very important for finals!", category: "Stationery", location: "Lecture Hall B", type: "lost", status: "lost", contactInstructions: "Drop it at the Chemistry department office; they'll contact me via the course portal." }),
    mk("demo-keys", 5, { title: "Set of keys with red lanyard", description: "Three keys on a red university lanyard with a small bottle-opener charm.", category: "Accessories", location: "Gym", type: "found", status: "returned", contactInstructions: "Collected from the Gym front desk." }),
    mk("demo-hoodie", 6, { title: "Grey university hoodie", description: "Medium grey pullover hoodie, faded logo, left on a bench.", category: "Clothing", location: "Cafeteria", type: "lost", status: "lost", contactInstructions: "Please hand to cafeteria staff — I check in daily at lunch." }),
  ];
}

export function loadItems(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Item[];
  } catch {
    return seed();
  }
}
function persist(items: Item[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    throw new Error("Your browser's storage is full. Try a smaller photo or remove old reports.");
  }
  listeners.forEach((l) => l());
}

export function createItem(input: ItemInput): Item {
  const now = new Date().toISOString();
  const item: Item = { ...input, id: crypto.randomUUID(), status: input.type, createdAt: now, updatedAt: now };
  persist([item, ...loadItems()]);
  return item;
}
export function updateItem(id: string, patch: Partial<Omit<Item, "id" | "createdAt">>) {
  const items = loadItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) throw new Error("Item not found");
  const prev = items[idx];
  const next: Item = { ...prev, ...patch, updatedAt: new Date().toISOString() };
  // Editing the type of an active item keeps status in sync; returned stays returned.
  if (patch.type && prev.status !== "returned" && !patch.status) next.status = patch.type;
  items[idx] = next;
  persist(items);
  return next;
}
export function deleteItem(id: string) {
  persist(loadItems().filter((i) => i.id !== id));
}
export function resetDemo() {
  localStorage.removeItem(KEY);
  loadItems();
  listeners.forEach((l) => l());
}

/** null while loading (before hydration). */
export function useItems(): Item[] | null {
  const [items, setItems] = useState<Item[] | null>(null);
  useEffect(() => {
    const l = () => setItems(loadItems());
    l();
    listeners.add(l);
    const onStorage = (e: StorageEvent) => e.key === KEY && l();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return items;
}

/** Resize an image file to a compact JPEG data URL. */
export async function fileToDataUrl(file: File, max = 900): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image must be under 10 MB");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Couldn't read that image"));
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.75);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function formatDate(iso: string) {
  const d = iso.length === 10 ? new Date(iso + "T12:00:00") : new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
