/* ════════════════════════════════════════════════════
   EDITOR — Fabric.js Canvas Controller
   Handles all canvas operations for Studio Premium
════════════════════════════════════════════════════ */

const FORMATS = {
  'post-square':   { width: 1080, height: 1080, label: 'Post 1:1 · 1080 × 1080px' },
  'post-portrait': { width: 1080, height: 1350, label: 'Post 4:5 · 1080 × 1350px' },
  'story':         { width: 1080, height: 1920, label: 'Story 9:16 · 1080 × 1920px' },
  'carousel':      { width: 1080, height: 1080, label: 'Carrossel · 1080 × 1080px' },
  'reel-cover':    { width: 1080, height: 1920, label: 'Reel Cover 9:16 · 1080 × 1920px' },
};

class Editor {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.fabricCanvas = null;
    this.currentFormat = 'post-square';
    this.scale = 1;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 40;
    this.isRecordingHistory = false;
    this.selectedObject = null;

    // Carousel
    this.slides = [null];  // array of JSON states per slide
    this.currentSlide = 0;

    // Upload tracking
    this.uploadedImages = [];

    this._init();
  }

  _init() {
    const fmt = FORMATS[this.currentFormat];

    this.fabricCanvas = new fabric.Canvas(this.canvasId, {
      backgroundColor: '#1A1228',
      selection: true,
      preserveObjectStacking: true,
      stopContextMenu: true,
    });

    this._setCanvasDimensions(fmt.width, fmt.height);
    this._bindEvents();
    this._saveHistory();
  }

  /* ── Dimensions & Scale ── */

  _setCanvasDimensions(width, height) {
    const fmt = FORMATS[this.currentFormat];
    const w = width || fmt.width;
    const h = height || fmt.height;

    const wrapper = document.getElementById('canvas-wrapper');
    if (!wrapper) return;

    const wrapW = wrapper.clientWidth - 80;
    const wrapH = wrapper.clientHeight - 80;

    const scaleX = wrapW / w;
    const scaleY = wrapH / h;
    this.scale = Math.min(scaleX, scaleY, 1);

    this.fabricCanvas.setDimensions({ width: w, height: h });
    this.fabricCanvas.setZoom(this.scale);

    const container = document.getElementById('canvas-container');
    if (container) {
      container.style.width = Math.round(w * this.scale) + 'px';
      container.style.height = Math.round(h * this.scale) + 'px';
    }

    this._updateZoomLabel();
  }

  zoomBy(delta) {
    const newScale = Math.max(0.1, Math.min(3, this.scale + delta));
    this.scale = newScale;
    this.fabricCanvas.setZoom(this.scale);
    const fmt = FORMATS[this.currentFormat];
    const container = document.getElementById('canvas-container');
    if (container) {
      container.style.width = Math.round(fmt.width * this.scale) + 'px';
      container.style.height = Math.round(fmt.height * this.scale) + 'px';
    }
    this._updateZoomLabel();
  }

  zoomFit() {
    const fmt = FORMATS[this.currentFormat];
    this._setCanvasDimensions(fmt.width, fmt.height);
  }

  _updateZoomLabel() {
    const el = document.getElementById('zoomLabel');
    if (el) el.textContent = Math.round(this.scale * 100) + '%';
  }

  /* ── Format Switching ── */

  setFormat(formatKey) {
    if (!FORMATS[formatKey]) return;

    // Save current slide state before switching
    this._saveCurrentSlide();
    this.currentFormat = formatKey;

    const fmt = FORMATS[formatKey];
    this.fabricCanvas.clear();
    this.fabricCanvas.setBackgroundColor('#1A1228', () => {});

    this._setCanvasDimensions(fmt.width, fmt.height);

    // Show/hide slides panel
    const slidesPanel = document.getElementById('slides-panel');
    if (slidesPanel) {
      slidesPanel.classList.toggle('hidden', formatKey !== 'carousel');
    }

    // Update label
    const label = document.getElementById('canvasFormatLabel');
    if (label) label.textContent = fmt.label;

    // Reset slides for carousel
    if (formatKey === 'carousel') {
      this.slides = [null];
      this.currentSlide = 0;
      this._renderSlideThumbs();
    }

    this._saveHistory();
    this.fabricCanvas.renderAll();
  }

  /* ── History (Undo/Redo) ── */

  _saveHistory() {
    if (this.isRecordingHistory) return;
    const json = JSON.stringify(this.fabricCanvas.toJSON(['id', 'name']));

    // Truncate future history when new action taken
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(json);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo() {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this._loadHistoryState(this.history[this.historyIndex]);
  }

  redo() {
    if (this.historyIndex >= this.history.length - 1) return;
    this.historyIndex++;
    this._loadHistoryState(this.history[this.historyIndex]);
  }

  _loadHistoryState(json) {
    this.isRecordingHistory = true;
    this.fabricCanvas.loadFromJSON(json, () => {
      this.fabricCanvas.renderAll();
      this.isRecordingHistory = false;
    });
  }

  /* ── Add Elements ── */

  addText(style = 'headline') {
    const styles = {
      headline:    { text: 'Seu Headline Aqui', fontSize: 72, fontFamily: 'Playfair Display', fill: '#F0ECE3', fontWeight: '700', textAlign: 'center' },
      subheadline: { text: 'Seu subtítulo elegante', fontSize: 40, fontFamily: 'Cormorant Garamond', fill: '#C9A84C', fontStyle: 'italic', textAlign: 'center' },
      body:        { text: 'Seu texto aqui. Escreva algo poderoso que conecte com sua audiência premium.', fontSize: 28, fontFamily: 'Montserrat', fill: 'rgba(240,236,227,0.85)', fontWeight: '300', width: 800 },
      quote:       { text: '"Sua citação poderosa vai aqui"', fontSize: 44, fontFamily: 'Lora', fill: '#F0ECE3', fontStyle: 'italic', textAlign: 'center' },
      script:      { text: 'Elegante & Poderosa', fontSize: 60, fontFamily: 'Dancing Script', fill: '#E8B4B8', textAlign: 'center' },
      label:       { text: 'ETIQUETA', fontSize: 18, fontFamily: 'Josefin Sans', fill: '#C9A84C', fontWeight: '600', charSpacing: 60, textAlign: 'center' },
    };

    const s = styles[style] || styles.headline;
    const fmt = FORMATS[this.currentFormat];
    const cx = fmt.width / 2;
    const cy = fmt.height / 2;

    const textObj = new fabric.Textbox(s.text, {
      left: cx - (s.width || 900) / 2,
      top: cy - s.fontSize,
      width: s.width || 900,
      fontSize: s.fontSize,
      fontFamily: s.fontFamily,
      fill: s.fill,
      textAlign: s.textAlign || 'left',
      fontWeight: s.fontWeight || 'normal',
      fontStyle: s.fontStyle || 'normal',
      charSpacing: s.charSpacing || 0,
      lineHeight: 1.2,
    });

    this.fabricCanvas.add(textObj);
    this.fabricCanvas.setActiveObject(textObj);
    this.fabricCanvas.renderAll();
    this._saveHistory();
  }

  addShape(type) {
    const fmt = FORMATS[this.currentFormat];
    const cx = fmt.width / 2;
    const cy = fmt.height / 2;
    let obj;

    switch (type) {
      case 'rect':
        obj = new fabric.Rect({ left: cx - 200, top: cy - 100, width: 400, height: 200, fill: 'rgba(201,168,76,0.15)', stroke: '#C9A84C', strokeWidth: 2, rx: 4 });
        break;
      case 'circle':
        obj = new fabric.Circle({ left: cx - 150, top: cy - 150, radius: 150, fill: 'rgba(201,168,76,0.15)', stroke: '#C9A84C', strokeWidth: 2 });
        break;
      case 'triangle':
        obj = new fabric.Triangle({ left: cx - 150, top: cy - 150, width: 300, height: 300, fill: 'rgba(232,180,184,0.15)', stroke: '#E8B4B8', strokeWidth: 2 });
        break;
      case 'diamond':
        obj = new fabric.Rect({ left: cx - 100, top: cy - 100, width: 200, height: 200, fill: 'rgba(201,168,76,0.15)', stroke: '#C9A84C', strokeWidth: 2, angle: 45 });
        break;
      case 'star':
        const starPath = this._starPath(cx, cy, 5, 120, 60);
        obj = new fabric.Path(starPath, { fill: 'rgba(201,168,76,0.15)', stroke: '#C9A84C', strokeWidth: 2 });
        break;
      case 'line':
        obj = new fabric.Line([cx - 200, cy, cx + 200, cy], { stroke: '#C9A84C', strokeWidth: 2 });
        break;
      default:
        return;
    }

    this.fabricCanvas.add(obj);
    this.fabricCanvas.setActiveObject(obj);
    this.fabricCanvas.renderAll();
    this._saveHistory();
  }

  _starPath(cx, cy, points, outerR, innerR) {
    let path = '';
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI / points) - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      path += (i === 0 ? 'M' : 'L') + x + ',' + y + ' ';
    }
    return path + 'Z';
  }

  addImage(dataURL, callback) {
    fabric.Image.fromURL(dataURL, (img) => {
      const fmt = FORMATS[this.currentFormat];
      const scale = Math.min(fmt.width * 0.8 / img.width, fmt.height * 0.8 / img.height);
      img.set({
        left: fmt.width / 2 - (img.width * scale) / 2,
        top: fmt.height / 2 - (img.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
      });
      this.fabricCanvas.add(img);
      this.fabricCanvas.setActiveObject(img);
      this.fabricCanvas.renderAll();
      this._saveHistory();
      if (callback) callback(img);
    });
  }

  setBackground(color) {
    this.fabricCanvas.setBackgroundColor(color, () => {
      this.fabricCanvas.renderAll();
      this._saveHistory();
    });
  }

  setBackgroundGradient(grad) {
    const fmt = FORMATS[this.currentFormat];
    const gradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords: grad.coords || { x1: 0, y1: 0, x2: fmt.width, y2: fmt.height },
      colorStops: grad.stops,
    });
    this.fabricCanvas.setBackgroundColor(gradient, () => {
      this.fabricCanvas.renderAll();
      this._saveHistory();
    });
  }

  /* ── Selection & Property Manipulation ── */

  getActiveObject() {
    return this.fabricCanvas.getActiveObject();
  }

  updateSelectedText(props) {
    const obj = this.getActiveObject();
    if (!obj || obj.type !== 'textbox') return;
    if (props.text !== undefined) obj.set('text', props.text);
    if (props.fontFamily !== undefined) obj.set('fontFamily', props.fontFamily);
    if (props.fontSize !== undefined) obj.set('fontSize', parseFloat(props.fontSize));
    if (props.fill !== undefined) obj.set('fill', props.fill);
    if (props.fontWeight !== undefined) obj.set('fontWeight', props.fontWeight === 'bold' ? 'bold' : 'normal');
    if (props.fontStyle !== undefined) obj.set('fontStyle', props.fontStyle === 'italic' ? 'italic' : 'normal');
    if (props.textAlign !== undefined) obj.set('textAlign', props.textAlign);
    if (props.charSpacing !== undefined) obj.set('charSpacing', parseFloat(props.charSpacing) * 10);
    if (props.opacity !== undefined) obj.set('opacity', parseFloat(props.opacity) / 100);
    this.fabricCanvas.renderAll();
    this._saveHistory();
  }

  updateSelectedShape(props) {
    const obj = this.getActiveObject();
    if (!obj) return;
    if (props.fill !== undefined) obj.set('fill', props.fill);
    if (props.stroke !== undefined) obj.set('stroke', props.stroke);
    if (props.strokeWidth !== undefined) obj.set('strokeWidth', parseFloat(props.strokeWidth));
    if (props.opacity !== undefined) obj.set('opacity', parseFloat(props.opacity) / 100);
    if (props.rx !== undefined) { obj.set('rx', parseFloat(props.rx)); obj.set('ry', parseFloat(props.rx)); }
    this.fabricCanvas.renderAll();
    this._saveHistory();
  }

  toggleBold() {
    const obj = this.getActiveObject();
    if (!obj || obj.type !== 'textbox') return;
    const isBold = obj.fontWeight === 'bold';
    obj.set('fontWeight', isBold ? 'normal' : 'bold');
    this.fabricCanvas.renderAll();
    this._saveHistory();
    return !isBold;
  }

  toggleItalic() {
    const obj = this.getActiveObject();
    if (!obj || obj.type !== 'textbox') return;
    const isItalic = obj.fontStyle === 'italic';
    obj.set('fontStyle', isItalic ? 'normal' : 'italic');
    this.fabricCanvas.renderAll();
    this._saveHistory();
    return !isItalic;
  }

  setAlign(align) {
    const obj = this.getActiveObject();
    if (!obj || obj.type !== 'textbox') return;
    obj.set('textAlign', align);
    this.fabricCanvas.renderAll();
    this._saveHistory();
  }

  deleteSelected() {
    const obj = this.getActiveObject();
    if (!obj) return;
    this.fabricCanvas.remove(obj);
    this.fabricCanvas.discardActiveObject();
    this.fabricCanvas.renderAll();
    this._saveHistory();
  }

  duplicateSelected() {
    const obj = this.getActiveObject();
    if (!obj) return;
    obj.clone((clone) => {
      clone.set({ left: obj.left + 20, top: obj.top + 20 });
      this.fabricCanvas.add(clone);
      this.fabricCanvas.setActiveObject(clone);
      this.fabricCanvas.renderAll();
      this._saveHistory();
    });
  }

  bringForward() {
    const obj = this.getActiveObject();
    if (!obj) return;
    this.fabricCanvas.bringForward(obj);
    this.fabricCanvas.renderAll();
    this._saveHistory();
  }

  sendBackward() {
    const obj = this.getActiveObject();
    if (!obj) return;
    this.fabricCanvas.sendBackwards(obj);
    this.fabricCanvas.renderAll();
    this._saveHistory();
  }

  /* ── Carousel Slides ── */

  _saveCurrentSlide() {
    if (this.currentFormat !== 'carousel') return;
    this.slides[this.currentSlide] = this.fabricCanvas.toJSON(['id']);
  }

  addSlide() {
    this._saveCurrentSlide();
    this.slides.push(null);
    this.currentSlide = this.slides.length - 1;
    this.fabricCanvas.clear();
    this.fabricCanvas.setBackgroundColor('#1A1228', () => this.fabricCanvas.renderAll());
    this._renderSlideThumbs();
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    this._saveCurrentSlide();
    this.currentSlide = index;
    if (this.slides[index]) {
      this.fabricCanvas.loadFromJSON(this.slides[index], () => {
        this.fabricCanvas.renderAll();
      });
    } else {
      this.fabricCanvas.clear();
      this.fabricCanvas.setBackgroundColor('#1A1228', () => this.fabricCanvas.renderAll());
    }
    this._renderSlideThumbs();
  }

  _renderSlideThumbs() {
    const list = document.getElementById('slidesList');
    if (!list) return;
    list.innerHTML = '';
    this.slides.forEach((_, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'slide-thumb' + (i === this.currentSlide ? ' active' : '');
      thumb.innerHTML = `
        <div style="width:100%;height:100%;background:#1A1228;display:flex;align-items:center;justify-content:center;font-family:'Josefin Sans';font-size:14px;color:rgba(255,255,255,0.3)">${i + 1}</div>
        <div class="slide-number">${i + 1}</div>
      `;
      thumb.addEventListener('click', () => this.goToSlide(i));
      list.appendChild(thumb);
    });
  }

  /* ── Export ── */

  exportCanvas(format = 'png', scale = 2) {
    this._saveCurrentSlide();
    const canvas = this.fabricCanvas;
    const prevZoom = canvas.getZoom();
    const fmt = FORMATS[this.currentFormat];

    // Temporarily set zoom to 1 for full resolution export
    canvas.setZoom(1);
    canvas.setDimensions({ width: fmt.width, height: fmt.height });

    const dataURL = canvas.toDataURL({
      format: format === 'jpg' ? 'jpeg' : 'png',
      quality: 0.95,
      multiplier: scale,
    });

    // Restore zoom
    canvas.setZoom(prevZoom);
    const container = document.getElementById('canvas-container');
    if (container) {
      canvas.setDimensions({ width: fmt.width, height: fmt.height });
    }

    return dataURL;
  }

  exportCarousel(format = 'png', scale = 2) {
    this._saveCurrentSlide();
    const urls = [];
    const fmt = FORMATS['carousel'];

    const exportSlide = (index) => {
      return new Promise((resolve) => {
        if (!this.slides[index]) {
          resolve(null);
          return;
        }
        this.fabricCanvas.loadFromJSON(this.slides[index], () => {
          const prevZoom = this.fabricCanvas.getZoom();
          this.fabricCanvas.setZoom(1);
          this.fabricCanvas.setDimensions({ width: fmt.width, height: fmt.height });

          const dataURL = this.fabricCanvas.toDataURL({
            format: format === 'jpg' ? 'jpeg' : 'png',
            quality: 0.95,
            multiplier: scale,
          });

          this.fabricCanvas.setZoom(prevZoom);
          urls.push(dataURL);
          resolve(dataURL);
        });
      });
    };

    return Promise.all(this.slides.map((_, i) => exportSlide(i))).then(() => urls);
  }

  /* ── Events ── */

  _bindEvents() {
    const canvas = this.fabricCanvas;

    canvas.on('selection:created', (e) => this._onSelectionChange(e.selected?.[0]));
    canvas.on('selection:updated', (e) => this._onSelectionChange(e.selected?.[0]));
    canvas.on('selection:cleared', () => this._onSelectionChange(null));
    canvas.on('object:modified', () => this._saveHistory());
    canvas.on('object:added', () => {
      // handled explicitly in add methods
    });
    canvas.on('text:changed', () => {
      const obj = canvas.getActiveObject();
      if (obj && obj.type === 'textbox') {
        const el = document.getElementById('prop-text-content');
        if (el) el.value = obj.text;
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); this.undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); this.redo(); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const obj = canvas.getActiveObject();
        if (obj) { e.preventDefault(); this.deleteSelected(); }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); this.duplicateSelected(); }
      if (e.key === 't' || e.key === 'T') { this.addText('headline'); }
      if (e.key === 'r' || e.key === 'R') { this.addShape('rect'); }
    });

    // Window resize
    window.addEventListener('resize', () => {
      const fmt = FORMATS[this.currentFormat];
      this._setCanvasDimensions(fmt.width, fmt.height);
    });
  }

  _onSelectionChange(obj) {
    this.selectedObject = obj;
    if (window.studio) window.studio.onSelectionChange(obj);
  }

  /* ── Property Panel Sync ── */

  syncPropsFromObject(obj) {
    if (!obj) return;

    if (obj.type === 'textbox') {
      const el = document.getElementById('prop-text-content');
      if (el) el.value = obj.text;
      const ff = document.getElementById('prop-font-family');
      if (ff) ff.value = obj.fontFamily || 'Montserrat';
      const fs = document.getElementById('prop-font-size');
      if (fs) fs.value = obj.fontSize || 40;
      const ls = document.getElementById('prop-letter-spacing');
      if (ls) ls.value = (obj.charSpacing || 0) / 10;
      const tc = document.getElementById('prop-text-color');
      if (tc && obj.fill && obj.fill.startsWith('#')) tc.value = obj.fill;
      const op = document.getElementById('prop-opacity');
      const opl = document.getElementById('prop-opacity-label');
      const val = Math.round((obj.opacity ?? 1) * 100);
      if (op) op.value = val;
      if (opl) opl.textContent = val + '%';
    } else if (obj.type !== 'image') {
      const fillColor = document.getElementById('prop-fill-color');
      if (fillColor && obj.fill && typeof obj.fill === 'string' && obj.fill.startsWith('#')) {
        fillColor.value = obj.fill;
      }
      const strokeColor = document.getElementById('prop-stroke-color');
      if (strokeColor && obj.stroke && obj.stroke.startsWith('#')) strokeColor.value = obj.stroke;
      const sw = document.getElementById('prop-stroke-width');
      if (sw) sw.value = obj.strokeWidth || 0;
      const op = document.getElementById('prop-shape-opacity');
      const opl = document.getElementById('prop-shape-opacity-label');
      const val = Math.round((obj.opacity ?? 1) * 100);
      if (op) op.value = val;
      if (opl) opl.textContent = val + '%';
    } else {
      const op = document.getElementById('prop-img-opacity');
      const opl = document.getElementById('prop-img-opacity-label');
      const val = Math.round((obj.opacity ?? 1) * 100);
      if (op) op.value = val;
      if (opl) opl.textContent = val + '%';
    }
  }

  insertTextOnCanvas(text) {
    const obj = this.fabricCanvas.getActiveObject();
    if (obj && obj.type === 'textbox') {
      obj.set('text', text);
      this.fabricCanvas.renderAll();
      this._saveHistory();
    } else {
      this.addText('body');
      const newObj = this.fabricCanvas.getActiveObject();
      if (newObj) {
        newObj.set('text', text);
        this.fabricCanvas.renderAll();
        this._saveHistory();
      }
    }
  }
}

// Instantiate the editor when DOM is ready
let editor;
document.addEventListener('DOMContentLoaded', () => {
  editor = new Editor('main-canvas');
});
