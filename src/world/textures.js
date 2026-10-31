import * as THREE from 'three';
import { mulberry32 } from './util';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

export function toTexture(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function wrapText(ctx, text, x, y, maxW, lineH, maxLines = 4) {
  const words = String(text).split(' ');
  let line = '';
  let n = 0;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y + n * lineH);
      line = w;
      n++;
      if (n >= maxLines) return;
    } else line = test;
  }
  ctx.fillText(line, x, y + n * lineH);
}

/** Clearly labelled stand‑in for a photograph the owner hasn't supplied yet. */
export function placeholderTexture(label, aspect = 1.5) {
  const w = 768;
  const h = Math.round(w / aspect);
  const [c, g] = canvas(w, h);
  const grad = g.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#2a2150');
  grad.addColorStop(1, '#14223f');
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(200,180,255,.55)';
  g.lineWidth = 4;
  g.setLineDash([16, 12]);
  g.strokeRect(18, 18, w - 36, h - 36);
  g.setLineDash([]);
  g.fillStyle = 'rgba(220,205,255,.9)';
  g.font = `600 ${Math.round(h * 0.11)}px "Inter Variable", Inter, system-ui, sans-serif`;
  g.textAlign = 'center';
  g.fillText('PHOTO PLACEHOLDER', w / 2, h * 0.42);
  g.fillStyle = '#fff';
  g.font = `600 ${Math.round(h * 0.085)}px "Inter Variable", Inter, system-ui, sans-serif`;
  wrapText(g, String(label).replace(/^\[|\]$/g, ''), w / 2, h * 0.58, w * 0.78, h * 0.1, 2);
  g.fillStyle = 'rgba(180,170,220,.8)';
  g.font = `500 ${Math.round(h * 0.06)}px "Inter Variable", Inter, system-ui, sans-serif`;
  g.fillText('replace in src/data/story.js', w / 2, h * 0.86);
  return toTexture(c);
}

export function softTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const [c, g] = canvas(128, 128);
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, inner);
  gr.addColorStop(1, outer);
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return toTexture(c);
}

export function shaftTexture() {
  const [c, g] = canvas(64, 256);
  const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, 'rgba(255,255,255,0.9)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 256);
  const gx = g.createLinearGradient(0, 0, 64, 0);
  gx.addColorStop(0, 'rgba(0,0,0,1)');
  gx.addColorStop(0.5, 'rgba(0,0,0,0)');
  gx.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-out';
  g.fillStyle = gx;
  g.fillRect(0, 0, 64, 256);
  return toTexture(c);
}

export function groundTexture(tile = 5, repeatX = 60, repeatY = 100) {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#c9c9c9';
  g.fillRect(0, 0, 256, 256);
  const r = mulberry32(7);
  for (let i = 0; i < 2600; i++) {
    const v = 150 + Math.floor(r() * 90);
    g.fillStyle = `rgba(${v},${v},${v},${0.35 + r() * 0.4})`;
    g.fillRect(r() * 256, r() * 256, 1 + r() * 3, 1 + r() * 3);
  }
  g.strokeStyle = 'rgba(255,255,255,.22)';
  for (let i = 0; i < 160; i++) {
    const x = r() * 256;
    const y = r() * 256;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (r() - 0.5) * 4, y - 3 - r() * 7);
    g.stroke();
  }
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  t.userData.tile = tile;
  return t;
}

export function pathTexture(repeatX) {
  const [c, g] = canvas(256, 128);
  g.fillStyle = '#d8d8d8';
  g.fillRect(0, 0, 256, 128);
  const r = mulberry32(21);
  for (let i = 0; i < 14; i++) {
    const x = (i % 7) * 36 + r() * 6 + (i > 6 ? 18 : 0);
    const y = (i > 6 ? 70 : 8) + r() * 6;
    g.fillStyle = `rgba(${150 + r() * 60},${150 + r() * 60},${150 + r() * 60},1)`;
    g.beginPath();
    g.roundRect(x, y, 30 + r() * 6, 46, 10);
    g.fill();
  }
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, 1);
  return t;
}

export function windowsTexture(seed = 3) {
  const [c, g] = canvas(128, 256);
  g.fillStyle = '#05060f';
  g.fillRect(0, 0, 128, 256);
  const r = mulberry32(seed);
  const cols = ['#4fd8ff', '#ff6ad5', '#ffd28a', '#9aa7ff', '#6dffb0'];
  for (let y = 6; y < 250; y += 14) {
    for (let x = 6; x < 122; x += 14) {
      if (r() > 0.55) {
        g.fillStyle = cols[Math.floor(r() * cols.length)];
        g.globalAlpha = 0.5 + r() * 0.5;
        g.fillRect(x, y, 8, 8);
      }
    }
  }
  g.globalAlpha = 1;
  return toTexture(c);
}

export function skylineTexture() {
  const [c, g] = canvas(1024, 256);
  const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#0a1230');
  gr.addColorStop(1, '#1d2d63');
  g.fillStyle = gr;
  g.fillRect(0, 0, 1024, 256);
  const r = mulberry32(11);
  for (let x = 0; x < 1024; ) {
    const w = 24 + r() * 44;
    const h = 40 + r() * 150;
    g.fillStyle = '#070b1d';
    g.fillRect(x, 256 - h, w, h);
    for (let y = 256 - h + 8; y < 248; y += 10)
      for (let xx = x + 4; xx < x + w - 6; xx += 9)
        if (r() > 0.5) {
          g.fillStyle = r() > 0.8 ? '#ffd28a' : '#7fb8ff';
          g.fillRect(xx, y, 4, 5);
        }
    x += w + 3;
  }
  return toTexture(c);
}

/** Holographic project card. Redraws itself when a screenshot finishes loading. */
export function makeProjectCanvas(project, img) {
  const w = 1024;
  const h = 640;
  const [c, g] = canvas(w, h);
  const draw = (image) => {
    const col = project.color || '#8b6cff';
    const bg = g.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0a0f26');
    bg.addColorStop(1, '#161040');
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    if (image) {
      const ia = image.width / image.height;
      const fa = w / h;
      let sw = image.width;
      let sh = image.height;
      let sx = 0;
      let sy = 0;
      if (ia > fa) {
        sw = image.height * fa;
        sx = (image.width - sw) / 2;
      } else {
        sh = image.width / fa;
        sy = (image.height - sh) / 2;
      }
      g.globalAlpha = 0.85;
      g.drawImage(image, sx, sy, sw, sh, 0, 0, w, h);
      g.globalAlpha = 1;
      const shade = g.createLinearGradient(0, h * 0.4, 0, h);
      shade.addColorStop(0, 'rgba(5,6,20,0)');
      shade.addColorStop(1, 'rgba(5,6,20,.92)');
      g.fillStyle = shade;
      g.fillRect(0, 0, w, h);
    } else {
      g.strokeStyle = col;
      g.globalAlpha = 0.18;
      for (let x = 0; x < w; x += 48) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, h);
        g.stroke();
      }
      for (let y = 0; y < h; y += 48) {
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(w, y);
        g.stroke();
      }
      g.globalAlpha = 1;
      g.fillStyle = col;
      g.globalAlpha = 0.16;
      g.beginPath();
      g.arc(w * 0.78, h * 0.3, 190, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
    }
    g.fillStyle = col;
    g.fillRect(48, h - 214, 8, 150);
    g.fillStyle = '#fff';
    g.font = '600 82px "Inter Variable", Inter, system-ui, sans-serif';
    g.textAlign = 'left';
    g.fillText(project.name, 78, h - 126);
    g.fillStyle = 'rgba(220,225,255,.88)';
    g.font = '500 38px "Inter Variable", Inter, system-ui, sans-serif';
    g.fillText(project.tagline || '', 80, h - 70);
    g.strokeStyle = col;
    g.lineWidth = 5;
    g.strokeRect(10, 10, w - 20, h - 20);
  };
  draw(img);
  return { canvas: c, redraw: draw };
}

export function gridTexture() {
  const [c, g] = canvas(128, 128);
  g.clearRect(0, 0, 128, 128);
  g.strokeStyle = 'rgba(95,120,255,0.9)';
  g.lineWidth = 2;
  g.strokeRect(1, 1, 126, 126);
  g.strokeStyle = 'rgba(140,110,255,0.25)';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(64, 0);
  g.lineTo(64, 128);
  g.moveTo(0, 64);
  g.lineTo(128, 64);
  g.stroke();
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
