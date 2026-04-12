/* ════════════════════════════════════════════════════
   STUDIO — Main App Controller
   Orchestrates UI, Editor, Templates & AI Tools
════════════════════════════════════════════════════ */

const studio = {

  /* ── State ── */
  currentFormat: 'post-square',
  currentTab: 'templates',
  currentTool: 'select',
  exportScale: 2,
  brandColors: ['#C9A84C', '#F0ECE3', '#1A1228', '#E8B4B8', '#0A0A14'],

  /* ════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════ */

  init() {
    this._setupTabs();
    this._setupFormatSelector();
    this._setupProperties();
    this._setupImageUpload();
    this._setupExportModal();
    this._setupKeyboardShortcuts();
    this._renderSidebarContent();
    this._renderTemplates();
    this._setupAINavTabs();
  },

  /* ════════════════════════════════════════════════
     TAB NAVIGATION
  ════════════════════════════════════════════════ */

  _setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });
  },

  switchTab(tab) {
    this.currentTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });

    // Show the right panel
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById('panel-' + tab);
    if (panel) panel.classList.remove('hidden');

    // Load content if needed
    if (tab === 'templates') this._renderTemplates();
    if (tab === 'brand') this._renderLuxuryPalettes();
  },

  /* ════════════════════════════════════════════════
     FORMAT SELECTOR
  ════════════════════════════════════════════════ */

  _setupFormatSelector() {
    document.querySelectorAll('.format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fmt = btn.dataset.format;
        this.setFormat(fmt);
      });
    });
  },

  setFormat(formatKey) {
    this.currentFormat = formatKey;

    // Update format buttons
    document.querySelectorAll('.format-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.format === formatKey);
    });

    // Update editor
    if (editor) editor.setFormat(formatKey);
  },

  /* ════════════════════════════════════════════════
     TOOL SELECTION
  ════════════════════════════════════════════════ */

  setTool(tool) {
    this.currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1));
    if (btn) btn.classList.add('active');

    if (!editor) return;
    if (tool === 'select') {
      editor.fabricCanvas.isDrawingMode = false;
      editor.fabricCanvas.selection = true;
    } else if (tool === 'text') {
      editor.addText('headline');
      this.setTool('select');
    } else if (tool === 'rect') {
      editor.addShape('rect');
      this.setTool('select');
    }
  },

  /* ════════════════════════════════════════════════
     ZOOM
  ════════════════════════════════════════════════ */

  zoom(delta) {
    if (editor) editor.zoomBy(delta);
  },

  zoomFit() {
    if (editor) editor.zoomFit();
  },

  /* ════════════════════════════════════════════════
     UNDO / REDO
  ════════════════════════════════════════════════ */

  _setupKeyboardShortcuts() {
    document.getElementById('btnUndo')?.addEventListener('click', () => {
      if (editor) editor.undo();
    });
    document.getElementById('btnRedo')?.addEventListener('click', () => {
      if (editor) editor.redo();
    });
  },

  /* ════════════════════════════════════════════════
     TEMPLATES
  ════════════════════════════════════════════════ */

  _renderTemplates(filterCat = 'all', query = '') {
    const grid = document.getElementById('templatesGrid');
    if (grid) renderTemplateCards(grid, filterCat, query);

    // Category buttons
    document.querySelectorAll('.cat-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const q = document.getElementById('templateSearch')?.value || '';
        this._renderTemplates(b.dataset.cat, q);
      });
    });

    // Search
    const searchInput = document.getElementById('templateSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const activeCat = document.querySelector('.cat-btn.active')?.dataset.cat || 'all';
        this._renderTemplates(activeCat, e.target.value);
      });
    }
  },

  applyTemplate(id) {
    if (!editor) return;

    const tpl = TEMPLATES.find(t => t.id === id);
    if (!tpl) return;

    // Switch to the right format
    this.setFormat(tpl.format);

    setTimeout(() => {
      applyTemplate(editor.fabricCanvas, id);
      editor._saveHistory();
      this.showToast('Template aplicado! ✦', 'success');
      // Deselect all
      editor.fabricCanvas.discardActiveObject();
      editor.fabricCanvas.renderAll();
    }, 100);
  },

  /* ════════════════════════════════════════════════
     TEXT ACTIONS
  ════════════════════════════════════════════════ */

  addText(style) {
    if (editor) editor.addText(style);
  },

  toggleBold() {
    if (!editor) return;
    const isBold = editor.toggleBold();
    document.getElementById('btn-bold')?.classList.toggle('active', isBold);
  },

  toggleItalic() {
    if (!editor) return;
    const isItalic = editor.toggleItalic();
    document.getElementById('btn-italic')?.classList.toggle('active', isItalic);
  },

  setAlign(align) {
    if (editor) editor.setAlign(align);
    ['left', 'center', 'right'].forEach(a => {
      document.getElementById('btn-align-' + a)?.classList.toggle('active', a === align);
    });
  },

  /* ════════════════════════════════════════════════
     SHAPE ACTIONS
  ════════════════════════════════════════════════ */

  addShape(type) {
    if (editor) editor.addShape(type);
  },

  /* ════════════════════════════════════════════════
     PROPERTIES PANEL
  ════════════════════════════════════════════════ */

  _setupProperties() {
    // Text properties
    document.getElementById('prop-text-content')?.addEventListener('input', (e) => {
      if (editor) editor.updateSelectedText({ text: e.target.value });
    });
    document.getElementById('prop-font-family')?.addEventListener('change', (e) => {
      if (editor) editor.updateSelectedText({ fontFamily: e.target.value });
    });
    document.getElementById('prop-font-size')?.addEventListener('input', (e) => {
      if (editor) editor.updateSelectedText({ fontSize: e.target.value });
    });
    document.getElementById('prop-letter-spacing')?.addEventListener('input', (e) => {
      if (editor) editor.updateSelectedText({ charSpacing: e.target.value });
    });
    document.getElementById('prop-text-color')?.addEventListener('input', (e) => {
      if (editor) editor.updateSelectedText({ fill: e.target.value });
    });
    document.getElementById('prop-opacity')?.addEventListener('input', (e) => {
      const val = e.target.value;
      document.getElementById('prop-opacity-label').textContent = val + '%';
      if (editor) editor.updateSelectedText({ opacity: val });
    });

    // Shape properties
    document.getElementById('prop-fill-color')?.addEventListener('input', (e) => {
      if (editor) editor.updateSelectedShape({ fill: e.target.value });
    });
    document.getElementById('prop-stroke-color')?.addEventListener('input', (e) => {
      if (editor) editor.updateSelectedShape({ stroke: e.target.value });
    });
    document.getElementById('prop-stroke-width')?.addEventListener('input', (e) => {
      if (editor) editor.updateSelectedShape({ strokeWidth: e.target.value });
    });
    document.getElementById('prop-shape-opacity')?.addEventListener('input', (e) => {
      const val = e.target.value;
      document.getElementById('prop-shape-opacity-label').textContent = val + '%';
      if (editor) editor.updateSelectedShape({ opacity: val });
    });
    document.getElementById('prop-shape-rx')?.addEventListener('input', (e) => {
      if (editor) editor.updateSelectedShape({ rx: e.target.value });
    });

    // Image opacity
    document.getElementById('prop-img-opacity')?.addEventListener('input', (e) => {
      const val = e.target.value;
      document.getElementById('prop-img-opacity-label').textContent = val + '%';
      const obj = editor?.getActiveObject();
      if (obj) {
        obj.set('opacity', val / 100);
        editor.fabricCanvas.renderAll();
      }
    });

    // Preset colors for text
    this._renderPresetColors('textPresetColors', (color) => {
      document.getElementById('prop-text-color').value = color;
      if (editor) editor.updateSelectedText({ fill: color });
    });
    this._renderPresetColors('fillPresetColors', (color) => {
      document.getElementById('prop-fill-color').value = color;
      if (editor) editor.updateSelectedShape({ fill: color });
    });
  },

  _renderPresetColors(containerId, onSelect) {
    const colors = ['#FFFFFF', '#F0ECE3', '#C9A84C', '#E8D5A3', '#E8B4B8', '#C27B82', '#6BCB77', '#7EB8E8', '#1A1228', '#0A0A14'];
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = colors.map(c => `
      <div class="preset-swatch" style="background:${c};${c === '#FFFFFF' ? 'border:1px solid rgba(255,255,255,0.2)' : ''}" onclick="(${onSelect.toString()})('${c}')" title="${c}"></div>
    `).join('');
  },

  onSelectionChange(obj) {
    const noSel = document.getElementById('no-selection-msg');
    const textProps = document.getElementById('text-properties');
    const shapeProps = document.getElementById('shape-properties');
    const imgProps = document.getElementById('image-properties');

    [noSel, textProps, shapeProps, imgProps].forEach(el => el?.classList.add('hidden'));

    if (!obj) {
      noSel?.classList.remove('hidden');
      return;
    }

    if (obj.type === 'textbox') {
      textProps?.classList.remove('hidden');
      if (editor) editor.syncPropsFromObject(obj);
    } else if (obj.type === 'image') {
      imgProps?.classList.remove('hidden');
      if (editor) editor.syncPropsFromObject(obj);
    } else {
      shapeProps?.classList.remove('hidden');
      if (editor) editor.syncPropsFromObject(obj);
    }
  },

  deleteSelected() {
    if (editor) editor.deleteSelected();
  },

  duplicateSelected() {
    if (editor) editor.duplicateSelected();
  },

  bringForward() {
    if (editor) editor.bringForward();
  },

  sendBackward() {
    if (editor) editor.sendBackward();
  },

  /* ════════════════════════════════════════════════
     IMAGE UPLOAD
  ════════════════════════════════════════════════ */

  _setupImageUpload() {
    const input = document.getElementById('imageUpload');
    const uploadZone = document.getElementById('uploadZone');

    input?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      this._processImageFile(file);
      input.value = '';
    });

    uploadZone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--gold)';
    });
    uploadZone?.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = '';
    });
    uploadZone?.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = '';
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) this._processImageFile(file);
    });
  },

  _processImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target.result;
      if (editor) {
        editor.addImage(dataURL);
      }
      this._addToMediaGrid(dataURL);
      this.showToast('Imagem adicionada ao canvas!', 'success');
    };
    reader.readAsDataURL(file);
  },

  _addToMediaGrid(dataURL) {
    const grid = document.getElementById('mediaGrid');
    if (!grid) return;

    // Remove empty state
    const empty = grid.querySelector('.empty-state');
    if (empty) empty.remove();

    const thumb = document.createElement('div');
    thumb.className = 'media-thumb';
    thumb.innerHTML = `<img src="${dataURL}" alt="Upload" />`;
    thumb.addEventListener('click', () => {
      if (editor) editor.addImage(dataURL);
      this.showToast('Imagem adicionada!', 'info');
    });
    grid.prepend(thumb);
  },

  /* ════════════════════════════════════════════════
     SIDEBAR CONTENT
  ════════════════════════════════════════════════ */

  _renderSidebarContent() {
    this._renderFontList();
    this._renderBgColors();
    this._renderGradients();
    this._renderLuxuryPalettes();
    this._renderBrandColors();
  },

  _renderFontList() {
    const container = document.getElementById('fontList');
    if (!container) return;
    const fonts = [
      { name: 'Playfair Display', style: 'font-family:"Playfair Display",serif; font-size:15px; font-style:italic' },
      { name: 'Cormorant Garamond', style: 'font-family:"Cormorant Garamond",serif; font-size:16px' },
      { name: 'Dancing Script', style: 'font-family:"Dancing Script",cursive; font-size:17px' },
      { name: 'Lora', style: 'font-family:"Lora",serif; font-size:14px; font-style:italic' },
      { name: 'DM Serif Display', style: 'font-family:"DM Serif Display",serif; font-size:15px' },
      { name: 'Raleway', style: 'font-family:"Raleway",sans-serif; font-size:14px; letter-spacing:2px' },
      { name: 'Josefin Sans', style: 'font-family:"Josefin Sans",sans-serif; font-size:13px; letter-spacing:2px; text-transform:uppercase' },
      { name: 'Montserrat', style: 'font-family:"Montserrat",sans-serif; font-size:14px; font-weight:300' },
    ];
    container.innerHTML = fonts.map(f => `
      <div class="font-item" style="${f.style}" onclick="if(editor){editor.addText('headline');const o=editor.getActiveObject();if(o){o.set('fontFamily','${f.name}');editor.fabricCanvas.renderAll();}}">${f.name}</div>
    `).join('');
  },

  _renderBgColors() {
    const container = document.getElementById('bgColorsGrid');
    if (!container) return;
    const colors = [
      '#0A0A14','#1A1228','#0D0D1A','#1A0A2E','#1A0A14',
      '#0A1A14','#0D1A0A','#1A1614','#1A1430','#121228',
      '#2A1A3A','#3A1A1A','#1A3A1A','#1A1A3A','#3A2A1A',
    ];
    container.innerHTML = colors.map(c => `
      <div class="bg-color-swatch" style="background:${c};border:1px solid rgba(255,255,255,0.05)" onclick="editor.setBackground('${c}')" title="${c}"></div>
    `).join('');
  },

  _renderGradients() {
    const container = document.getElementById('gradientsGrid');
    if (!container) return;
    const gradients = [
      { label: 'Midnight Gold', bg: 'linear-gradient(135deg,#0A0A14,#1A0A2E)', stops: [{offset:0,color:'#0A0A14'},{offset:1,color:'#1A0A2E'}] },
      { label: 'Rose Luxury', bg: 'linear-gradient(135deg,#1A0A14,#2E1A28)', stops: [{offset:0,color:'#1A0A14'},{offset:1,color:'#2E1A28'}] },
      { label: 'Forest Elite', bg: 'linear-gradient(135deg,#0A1A0A,#1A3A1A)', stops: [{offset:0,color:'#0A1A0A'},{offset:1,color:'#1A3A1A'}] },
      { label: 'Ocean Deep', bg: 'linear-gradient(135deg,#0A1430,#1A2A3A)', stops: [{offset:0,color:'#0A1430'},{offset:1,color:'#1A2A3A'}] },
      { label: 'Gold Noir', bg: 'linear-gradient(135deg,#1A1228,#C9A84C33)', stops: [{offset:0,color:'#1A1228'},{offset:0.7,color:'#2A1A3A'},{offset:1,color:'#3A2A0A'}] },
      { label: 'Blush Luxe', bg: 'linear-gradient(135deg,#1A0A14,#E8B4B833)', stops: [{offset:0,color:'#1A0A14'},{offset:1,color:'#3A1A28'}] },
      { label: 'Dark Emerald', bg: 'linear-gradient(135deg,#0A1A10,#1A2E20)', stops: [{offset:0,color:'#0A1A10'},{offset:1,color:'#1A2E20'}] },
      { label: 'Plum Rich', bg: 'linear-gradient(135deg,#1A0A2E,#2E1A3A)', stops: [{offset:0,color:'#1A0A2E'},{offset:1,color:'#2E1A3A'}] },
      { label: 'Bronze', bg: 'linear-gradient(135deg,#1A1210,#3A2A18)', stops: [{offset:0,color:'#1A1210'},{offset:1,color:'#3A2A18'}] },
      { label: 'Night Sky', bg: 'linear-gradient(180deg,#0A0A14,#1A1228,#2A1A3A)', stops: [{offset:0,color:'#0A0A14'},{offset:0.5,color:'#1A1228'},{offset:1,color:'#2A1A3A'}] },
    ];
    container.innerHTML = gradients.map(g => `
      <div class="gradient-swatch" style="background:${g.bg}" title="${g.label}"
        onclick="editor.setBackgroundGradient({stops:${JSON.stringify(g.stops)}})"></div>
    `).join('');
  },

  _renderLuxuryPalettes() {
    const container = document.getElementById('luxuryPalettes');
    if (!container) return;
    const palettes = [
      { name: 'Midnight Gold', colors: ['#0A0A14','#C9A84C','#F0ECE3','#E8D5A3'] },
      { name: 'Rose Luxe', colors: ['#1A0A14','#E8B4B8','#C27B82','#F0ECE3'] },
      { name: 'Forest Premium', colors: ['#0A1A0A','#6BCB77','#2A3A2A','#F0ECE3'] },
      { name: 'Ocean Royale', colors: ['#0A1430','#7EB8E8','#1A2A4A','#F0ECE3'] },
      { name: 'Classic Noir', colors: ['#0A0A0A','#FFFFFF','#C9A84C','#808080'] },
      { name: 'Lavender Premium', colors: ['#1A1228','#B4A0E8','#8A70C0','#F0ECE3'] },
    ];
    container.innerHTML = palettes.map(p => `
      <div class="palette-item" onclick="studio._applyLuxuryPalette(${JSON.stringify(p.colors)})" title="Aplicar paleta ${p.name}">
        <div class="palette-swatches">
          ${p.colors.map(c => `<div class="palette-swatch" style="background:${c}"></div>`).join('')}
        </div>
        <span class="palette-name">${p.name}</span>
      </div>
    `).join('');
  },

  _applyLuxuryPalette(colors) {
    if (editor && colors[0]) editor.setBackground(colors[0]);
    this.showToast(`Paleta aplicada!`, 'success');
  },

  _renderBrandColors() {
    const container = document.getElementById('brandColorsList');
    if (!container) return;
    this._refreshBrandColorsList();
  },

  _refreshBrandColorsList() {
    const container = document.getElementById('brandColorsList');
    if (!container) return;
    container.innerHTML = this.brandColors.map(c => `
      <div class="brand-color-chip" style="background:${c};${c === '#F0ECE3' ? 'border:1px solid rgba(255,255,255,0.2)' : ''}"
        onclick="editor.setBackground('${c}')" title="${c} — Clique para aplicar ao fundo"></div>
    `).join('');
  },

  addBrandColor() {
    const color = document.getElementById('brandColorPicker')?.value || '#C9A84C';
    if (!this.brandColors.includes(color)) {
      this.brandColors.unshift(color);
      this._refreshBrandColorsList();
      this.showToast('Cor adicionada à marca!', 'success');
    }
  },

  /* ════════════════════════════════════════════════
     AI PANEL NAVIGATION
  ════════════════════════════════════════════════ */

  _setupAINavTabs() {
    document.querySelectorAll('.ai-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        document.querySelectorAll('.ai-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.ai-tool-panel').forEach(p => p.classList.add('hidden'));
        const panel = document.getElementById('tool-' + tool);
        if (panel) panel.classList.remove('hidden');
      });
    });
  },

  /* ════════════════════════════════════════════════
     CAROUSEL SLIDES
  ════════════════════════════════════════════════ */

  addSlide() {
    if (editor) editor.addSlide();
  },

  /* ════════════════════════════════════════════════
     EXPORT
  ════════════════════════════════════════════════ */

  _setupExportModal() {
    document.getElementById('btnExport')?.addEventListener('click', () => {
      this.openExportModal();
    });

    document.querySelectorAll('.quality-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.exportScale = parseInt(btn.dataset.scale);
        this._updateExportInfo();
      });
    });

    document.querySelectorAll('[name="exportFormat"]').forEach(radio => {
      radio.addEventListener('change', () => this._updateExportInfo());
    });
  },

  openExportModal() {
    this._updateExportInfo();
    document.getElementById('exportModal')?.classList.remove('hidden');
  },

  closeModal(id) {
    document.getElementById(id)?.classList.add('hidden');
  },

  _updateExportInfo() {
    const fmt = FORMATS ? FORMATS[this.currentFormat] : { width: 1080, height: 1080 };
    const scale = this.exportScale || 2;
    const format = document.querySelector('[name="exportFormat"]:checked')?.value || 'png';
    const el = document.getElementById('exportInfo');
    if (el) {
      el.innerHTML = `
        <strong>Dimensões:</strong> ${fmt.width * scale} × ${fmt.height * scale}px &nbsp;·&nbsp;
        <strong>Formato:</strong> ${format.toUpperCase()} &nbsp;·&nbsp;
        <strong>Escala:</strong> ${scale}x
      `;
    }
  },

  downloadExport() {
    if (!editor) return;
    const format = document.querySelector('[name="exportFormat"]:checked')?.value || 'png';
    const scale = this.exportScale || 2;

    if (this.currentFormat === 'carousel') {
      editor.exportCarousel(format, scale).then(urls => {
        urls.forEach((url, i) => {
          if (!url) return;
          const a = document.createElement('a');
          a.href = url;
          a.download = `studio-slide-${i + 1}.${format}`;
          a.click();
        });
        this.showToast(`${urls.length} slides exportados!`, 'success');
        this.closeModal('exportModal');
      });
    } else {
      const dataURL = editor.exportCanvas(format, scale);
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = `studio-premium-${this.currentFormat}-${Date.now()}.${format}`;
      a.click();
      this.showToast('Arte exportada com sucesso!', 'success');
      this.closeModal('exportModal');
    }
  },

  /* ════════════════════════════════════════════════
     TOAST NOTIFICATIONS
  ════════════════════════════════════════════════ */

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✓', error: '✗', info: '✦' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '✦'}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  },

  /* ════════════════════════════════════════════════
     PREVIEW MODE
  ════════════════════════════════════════════════ */

  _setupPreview() {
    document.getElementById('btnPreview')?.addEventListener('click', () => {
      if (!editor) return;
      const dataURL = editor.exportCanvas('png', 1);
      const win = window.open('', '_blank');
      win.document.write(`<html><head><title>Preview</title><style>body{margin:0;background:#0A0A14;display:flex;align-items:center;justify-content:center;min-height:100vh}img{max-width:100%;max-height:100vh;box-shadow:0 0 80px rgba(201,168,76,0.1)}</style></head><body><img src="${dataURL}" /></body></html>`);
    });
  },

};

/* ════════════════════════════════════════════════
   STARTUP
════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure editor.js has initialized
  setTimeout(() => {
    studio.init();
    studio._setupPreview();

    // Welcome toast
    setTimeout(() => {
      studio.showToast('Studio Premium carregado ✦ Bem-vinda!', 'success');
    }, 800);
  }, 200);
});
