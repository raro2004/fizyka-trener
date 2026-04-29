// circuit-svg.js — proste rysowanie schematów obwodów jako SVG
// Bardzo uproszczone: rysuje sieć szeregowo-równoległą bez topologii rozgałęzionej

(function (global) {
  "use strict";

  const RES_W = 80, RES_H = 22, GAP = 18;

  function isLeaf(n) {
    return typeof n === "number" || (n && "R" in n && !n.children);
  }
  function leafR(n) { return typeof n === "number" ? n : n.R; }
  function leafId(n) { return typeof n === "number" ? null : n.id; }

  // Zwraca rozmiar potrzebny do narysowania danego węzła
  function size(net) {
    if (isLeaf(net)) return { w: RES_W, h: RES_H + 8 };
    if (net.type === "s") {
      let w = 0, h = 0;
      net.children.forEach(c => {
        const s = size(c); w += s.w + GAP; h = Math.max(h, s.h);
      });
      return { w: w - GAP, h };
    }
    if (net.type === "p") {
      let w = 0, h = 0;
      net.children.forEach(c => {
        const s = size(c); w = Math.max(w, s.w); h += s.h + 6;
      });
      return { w: w + 60, h: h - 6 };
    }
  }

  // Renderuje węzeł zaczynając w (x, y) — y to oś środkowa
  function render(net, x, y) {
    if (isLeaf(net)) {
      const id = leafId(net), R = leafR(net);
      const cx = x + RES_W/2;
      const label = (id ? `R${id}=` : "") + R + "Ω";
      return `
        <line x1="${x}" y1="${y}" x2="${x+10}" y2="${y}" class="wire"/>
        <rect x="${x+10}" y="${y - RES_H/2}" width="${RES_W-20}" height="${RES_H}" class="resistor"/>
        <line x1="${x+RES_W-10}" y1="${y}" x2="${x+RES_W}" y2="${y}" class="wire"/>
        <text x="${cx}" y="${y - RES_H/2 - 6}" class="reslabel">${label}</text>
      `;
    }
    if (net.type === "s") {
      let svg = "", cx = x;
      net.children.forEach(c => {
        const s = size(c);
        svg += render(c, cx, y);
        cx += s.w;
        if (c !== net.children[net.children.length-1]) {
          svg += `<line x1="${cx}" y1="${y}" x2="${cx+GAP}" y2="${y}" class="wire"/>`;
          cx += GAP;
        }
      });
      return svg;
    }
    if (net.type === "p") {
      const total = size(net);
      let svg = "";
      // pionowe szyny
      const top = y - total.h/2;
      const bot = y + total.h/2;
      svg += `<line x1="${x}" y1="${top}" x2="${x}" y2="${bot}" class="wire"/>`;
      svg += `<line x1="${x+total.w}" y1="${top}" x2="${x+total.w}" y2="${bot}" class="wire"/>`;
      // poziome wprowadzenie/wyjście
      svg += `<line x1="${x-10}" y1="${y}" x2="${x}" y2="${y}" class="wire"/>`;
      svg += `<line x1="${x+total.w}" y1="${y}" x2="${x+total.w+10}" y2="${y}" class="wire"/>`;
      let cy = top;
      net.children.forEach(c => {
        const s = size(c);
        const childY = cy + s.h/2;
        // poziome doprowadzenia do gałęzi
        const innerW = s.w;
        const startX = x + (total.w - innerW) / 2;
        svg += `<line x1="${x}" y1="${childY}" x2="${startX}" y2="${childY}" class="wire"/>`;
        svg += render(c, startX, childY);
        svg += `<line x1="${startX + innerW}" y1="${childY}" x2="${x+total.w}" y2="${childY}" class="wire"/>`;
        cy += s.h + 6;
      });
      return svg;
    }
  }

  // Główna funkcja: SVG z baterią/zaciskami albo bez
  function drawCircuit(net, opts) {
    opts = opts || {};
    const includeBattery = opts.battery;
    const U = opts.U;
    const inner = size(net);
    const padX = 50, padY = 30;
    const W = inner.w + padX*2 + (includeBattery ? 80 : 20);
    const H = inner.h + padY*2 + 20;
    const startX = padX + (includeBattery ? 60 : 0);
    const y = H / 2;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" class="circuit-svg">`;
    svg += `<style>
      .wire { stroke: #2c3e50; stroke-width: 2; fill: none; }
      .resistor { fill: #fbeec1; stroke: #2c3e50; stroke-width: 2; }
      .reslabel { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; fill: #2c3e50; text-anchor: middle; }
      .battery { stroke: #2c3e50; stroke-width: 2; fill: none; }
      .battlabel { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; fill: #2c3e50; font-weight: 600; }
    </style>`;
    if (includeBattery) {
      // Bateria po lewej, łącząca górę i dół, oporniki w pętli
      const bx = padX, by = y;
      svg += `<line x1="${bx}" y1="${by-15}" x2="${bx}" y2="${by-3}" class="battery"/>`;
      svg += `<line x1="${bx-10}" y1="${by-3}" x2="${bx+10}" y2="${by-3}" class="battery"/>`;
      svg += `<line x1="${bx-6}" y1="${by+3}" x2="${bx+6}" y2="${by+3}" class="battery"/>`;
      svg += `<line x1="${bx}" y1="${by+3}" x2="${bx}" y2="${by+15}" class="battery"/>`;
      svg += `<text x="${bx + 18}" y="${by+5}" class="battlabel">U=${U}V</text>`;
      // pętla
      const top = padY, bot = H - padY;
      svg += `<line x1="${bx}" y1="${by-15}" x2="${bx}" y2="${top}" class="wire"/>`;
      svg += `<line x1="${bx}" y1="${top}" x2="${startX + inner.w + 30}" y2="${top}" class="wire"/>`;
      svg += `<line x1="${startX + inner.w + 30}" y1="${top}" x2="${startX + inner.w + 30}" y2="${y}" class="wire"/>`;
      svg += `<line x1="${startX + inner.w}" y1="${y}" x2="${startX + inner.w + 30}" y2="${y}" class="wire"/>`;
      svg += `<line x1="${bx}" y1="${by+15}" x2="${bx}" y2="${bot}" class="wire"/>`;
      svg += `<line x1="${bx}" y1="${bot}" x2="${startX - 10}" y2="${bot}" class="wire"/>`;
      svg += `<line x1="${startX - 10}" y1="${bot}" x2="${startX - 10}" y2="${y}" class="wire"/>`;
      svg += `<line x1="${startX - 10}" y1="${y}" x2="${startX}" y2="${y}" class="wire"/>`;
    } else {
      svg += `<line x1="${startX - 12}" y1="${y}" x2="${startX}" y2="${y}" class="wire"/>`;
      svg += `<circle cx="${startX - 12}" cy="${y}" r="3" class="resistor"/>`;
      svg += `<line x1="${startX + inner.w}" y1="${y}" x2="${startX + inner.w + 12}" y2="${y}" class="wire"/>`;
      svg += `<circle cx="${startX + inner.w + 12}" cy="${y}" r="3" class="resistor"/>`;
    }
    svg += render(net, startX, y);
    svg += `</svg>`;
    return svg;
  }

  global.CircuitSVG = { drawCircuit };
})(typeof window !== "undefined" ? window : globalThis);
