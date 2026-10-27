export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Squarified treemap (Bruls, Huizing & van Wijk): lays `values` out inside `rect` with tiles as
 * close to square as possible. Returns one rect per value, in input order.
 */
export function squarify(values: number[], rect: Rect): Rect[] {
  const total = values.reduce((a, b) => a + b, 0);
  const items = values
    .map((v, i) => ({ i, area: total > 0 ? (v / total) * rect.w * rect.h : 0 }))
    .sort((a, b) => b.area - a.area);
  const out: Rect[] = new Array(values.length);
  let { x, y, w, h } = rect;

  const sum = (row: typeof items) => row.reduce((a, r) => a + r.area, 0);
  const worst = (row: typeof items, side: number) => {
    const s = sum(row);
    const max = Math.max(...row.map((r) => r.area));
    const min = Math.min(...row.map((r) => r.area));
    return Math.max((side * side * max) / (s * s), (s * s) / (side * side * min));
  };
  const place = (row: typeof items) => {
    const s = sum(row);
    if (w >= h) {
      const cw = s / h;
      let cy = y;
      for (const r of row) {
        const rh = r.area / cw;
        out[r.i] = { x, y: cy, w: cw, h: rh };
        cy += rh;
      }
      x += cw;
      w -= cw;
    } else {
      const rh = s / w;
      let cx = x;
      for (const r of row) {
        const rw = r.area / rh;
        out[r.i] = { x: cx, y, w: rw, h: rh };
        cx += rw;
      }
      y += rh;
      h -= rh;
    }
  };

  let row: typeof items = [];
  for (let i = 0; i < items.length; ) {
    const side = Math.min(w, h);
    if (row.length === 0 || worst([...row, items[i]], side) <= worst(row, side)) {
      row.push(items[i]);
      i++;
    } else {
      place(row);
      row = [];
    }
  }
  if (row.length) place(row);
  return out;
}
