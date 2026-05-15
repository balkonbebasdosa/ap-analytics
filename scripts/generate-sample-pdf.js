// Generates examples/menu-example.pdf — a minimal digital PDF with a real
// text layer so pdfjs-dist can extract name + price pairs.
const fs = require('fs');
const path = require('path');

const menuItems = [
  { name: 'Kopi Susu Spesial',    price: '25.000' },
  { name: 'Americano',            price: '20.000' },
  { name: 'Cappuccino',           price: '28.000' },
  { name: 'Matcha Latte',         price: '30.000' },
  { name: 'Teh Tarik',            price: '15.000' },
  { name: 'Es Teh Manis',         price: '10.000' },
  { name: 'Croissant',            price: '18.000' },
  { name: 'Nasi Goreng Spesial',  price: '35.000' },
  { name: 'Mie Goreng',           price: '30.000' },
  { name: 'Roti Bakar Coklat',    price: '20.000' },
];

function escapePdf(s) {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

// Build the page content stream (BT...ET block).
const lines = [
  'BT',
  '/F1 14 Tf',
  '50 750 Td',
  `(${escapePdf('MENU KAFE CONTOH')}) Tj`,
  '/F1 11 Tf',
];
for (const item of menuItems) {
  const pad = '.'.repeat(Math.max(5, 44 - item.name.length));
  lines.push('0 -22 Td');
  lines.push(`(${escapePdf(`${item.name} ${pad} Rp ${item.price}`)}) Tj`);
}
lines.push('ET');

const contentStream = lines.join('\n');
const contentLen = Buffer.byteLength(contentStream, 'latin1');

// Assemble PDF objects, tracking byte offsets for the xref table.
let pdf = '';
const off = {};

const add = (s) => { pdf += s; };

add('%PDF-1.4\n');

off[1] = Buffer.byteLength(pdf, 'latin1');
add('1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n');

off[2] = Buffer.byteLength(pdf, 'latin1');
add('2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n');

off[3] = Buffer.byteLength(pdf, 'latin1');
add('3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>\nendobj\n');

off[4] = Buffer.byteLength(pdf, 'latin1');
add(`4 0 obj\n<</Length ${contentLen}>>\nstream\n${contentStream}\nendstream\nendobj\n`);

off[5] = Buffer.byteLength(pdf, 'latin1');
add('5 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n');

const xrefOffset = Buffer.byteLength(pdf, 'latin1');
add('xref\n0 6\n');
add('0000000000 65535 f \n');
for (let i = 1; i <= 5; i++) {
  add(String(off[i]).padStart(10, '0') + ' 00000 n \n');
}
add(`trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF\n`);

const outDir = path.join(__dirname, '..', 'examples');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'menu-example.pdf');
fs.writeFileSync(outPath, pdf, 'latin1');
console.log(`Generated ${outPath}`);
