import { describe, it, expect, beforeEach } from "vitest";
import { filterItems, defaultFilters, itemInputSchema, loadItems, createItem, updateItem, deleteItem, type Item } from "./items";

const base = (p: Partial<Item>): Item => ({
  id: "x", title: "Thing", description: "desc", category: "Other", location: "Gym", dateOccurred: "2026-01-01",
  image: null, type: "lost", status: "lost", contactInstructions: "desk", createdAt: "2026-01-01T00:00:00Z", updatedAt: "", ...p,
});

describe("filterItems", () => {
  const items = [
    base({ id: "a", title: "Water bottle", category: "Water Bottles", location: "Library", status: "found", createdAt: "2026-01-02" }),
    base({ id: "b", title: "Calculator", description: "graphing", category: "Electronics", location: "Library", status: "lost", createdAt: "2026-01-03" }),
    base({ id: "c", title: "Keys", category: "Accessories", location: "Gym", status: "returned", createdAt: "2026-01-01" }),
  ];
  it("searches description, location and category", () => {
    expect(filterItems(items, { ...defaultFilters, q: "graphing" }).map((i) => i.id)).toEqual(["b"]);
    expect(filterItems(items, { ...defaultFilters, q: "gym" }).map((i) => i.id)).toEqual(["c"]);
    expect(filterItems(items, { ...defaultFilters, q: "electronics" }).map((i) => i.id)).toEqual(["b"]);
  });
  it("combines filters with search", () => {
    expect(filterItems(items, { ...defaultFilters, location: "Library", status: "found" }).map((i) => i.id)).toEqual(["a"]);
    expect(filterItems(items, { ...defaultFilters, location: "Library", q: "keys" })).toEqual([]);
  });
  it("sorts newest and oldest", () => {
    expect(filterItems(items, defaultFilters).map((i) => i.id)).toEqual(["b", "a", "c"]);
    expect(filterItems(items, { ...defaultFilters, sort: "oldest" }).map((i) => i.id)).toEqual(["c", "a", "b"]);
  });
});

describe("validation", () => {
  it("rejects missing required fields", () => {
    const r = itemInputSchema.safeParse({ title: "", description: "", category: "", location: "", dateOccurred: "", image: null, type: "", contactInstructions: "" });
    expect(r.success).toBe(false);
  });
});

describe("persistence", () => {
  beforeEach(() => localStorage.clear());
  it("status change updates the same record, no duplicate", () => {
    const start = loadItems().length;
    const it1 = createItem({ title: "Black umbrella", description: "Folding umbrella", category: "Other", location: "Gym", dateOccurred: "2026-01-01", image: null, type: "found", contactInstructions: "Gym desk" });
    expect(loadItems().length).toBe(start + 1);
    updateItem(it1.id, { status: "returned" });
    const all = loadItems();
    expect(all.length).toBe(start + 1);
    expect(all.find((i) => i.id === it1.id)?.status).toBe("returned");
    deleteItem(it1.id);
    expect(loadItems().length).toBe(start);
  });
});
