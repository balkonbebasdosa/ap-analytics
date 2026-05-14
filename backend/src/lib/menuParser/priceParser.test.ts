import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePrice, extractPriceFromLine } from "./priceParser";

test("parsePrice handles Indonesian Rupiah formats", () => {
  assert.equal(parsePrice("Rp 35.000"), 35000);
  assert.equal(parsePrice("35.000"), 35000);
  assert.equal(parsePrice("35000"), 35000);
  assert.equal(parsePrice("Rp1.500.000"), 1500000);
  assert.equal(parsePrice("8.000"), 8000);
});

test("parsePrice handles US-style and decimal formats", () => {
  assert.equal(parsePrice("Rp35,000"), 35000);
  assert.equal(parsePrice("25,000.50"), 25000.5);
  assert.equal(parsePrice("25.000,50"), 25000.5);
  assert.equal(parsePrice("8.5"), 8.5);
});

test("parsePrice rejects non-prices", () => {
  assert.equal(parsePrice(""), null);
  assert.equal(parsePrice("Kopi Susu"), null);
  assert.equal(parsePrice(null), null);
  assert.equal(parsePrice("-5"), 5); // sign stripped; treated as 5, not negative
});

test("parsePrice passes through numbers", () => {
  assert.equal(parsePrice(35000), 35000);
  assert.equal(parsePrice(0), 0);
});

test("extractPriceFromLine splits name and price from a menu row", () => {
  assert.deepEqual(extractPriceFromLine("Kopi Susu Spesial ........ Rp 25.000"), {
    name: "Kopi Susu Spesial",
    price: 25000,
  });
  assert.deepEqual(extractPriceFromLine("Croissant   18.000"), {
    name: "Croissant",
    price: 18000,
  });
});

test("extractPriceFromLine ignores incidental numbers", () => {
  // "2" is not money-like (no separator, <3 digits, no 'rp'); no price found.
  const r = extractPriceFromLine("Paket Hemat 2 orang");
  assert.equal(r.price, null);
  assert.equal(r.name, "Paket Hemat 2 orang");
});
