/* ════════════════════════════════════════════════════
   AI TOOLS — Copywriter, Trends, Hashtags, Ideas
   Integrates with Claude API via backend endpoints
════════════════════════════════════════════════════ */

const aiTools = {

  /* ── Loading State ── */

  _setLoading(containerId, btnId, loading) {
    const btn = document.getElementById(btnId);
    const container = document.getElementById(containerId);
    if (btn) {
      btn.disabled = loading;
      if (loading) {
        btn.innerHTML = `<div class="ai-spinner" style="width:16px;height:16px;border-width:2px;margin:0 auto"></div>`;
      } else {
        const icons = { btnGenerateCopy:'✦', btnGetTrends:'🔥', btnGetHashtags:'#', btnGetIdeas:'💡', btnGetCarousel:'📊' };
        const labels = { btnGenerateCopy:'Gerar Copywriting', btnGetTrends:'Analisar Tendências', btnGetHashtags:'Gerar Hashtags Estratégicas', btnGetIdeas:'Gerar Ideias de Conteúdo', btnGetCarousel:'Criar Roteiro de Carrossel' };
        btn.innerHTML = `<span class="btn-ai-icon">${icons[btnId]||'✦'}</span> ${labels[btnId]||'Gerar'}`;
      }
    }
    if (container && loading) {
      container.classList.remove('hidden');
      container.innerHTML = `<div class="ai-loading"><div class="ai-spinner"></div><p>A IA está criando para você...<br><small>Isso pode levar alguns segundos</small></p></div>`;
    }
  },

  _showError(containerId, msg) {
    const container = document.getElementById(containerId);
    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `<div class="result-card" style="border-color:rgba(232,126,126,0.3)"><p style="color:#E87E7E;font-size:12px">❌ ${msg}</p></div>`;
    }
  },

  /* ── Copy to Clipboard ── */

  _copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Copiado!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
      window.studio && studio.showToast('Copiado para área de transferência!', 'success');
    }).catch(() => {
      window.studio && studio.showToast('Não foi possível copiar automaticamente.', 'error');
    });
  },

  /* ════════════════════════════════════════════════
     COPYWRITER
  ════════════════════════════════════════════════ */

  async generateCopy() {
    const nicho = document.getElementById('copy-nicho')?.value || 'empreendedorismo feminino';
    const produto = document.getElementById('copy-produto')?.value || 'produto premium';
    const objetivo = document.getElementById('copy-objetivo')?.value || 'engajamento';
    const tom = document.getElementById('copy-tom')?.value || 'elegante e empoderador';

    this._setLoading('copyResults', 'btnGenerateCopy', true);

    try {
      const res = await fetch('/api/social/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicho, produto, objetivo, tom }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.erro || 'Erro desconhecido');
      this._renderCopyResults(json.data);
    } catch (err) {
      this._setLoading('copyResults', 'btnGenerateCopy', false);
      this._showError('copyResults', err.message || 'Falha ao conectar com a IA');
    }
    this._setLoading('copyResults', 'btnGenerateCopy', false);
  },

  _renderCopyResults(data) {
    const container = document.getElementById('copyResults');
    if (!container) return;
    container.classList.remove('hidden');

    const hashtagsHtml = (data.hashtags || []).map(h =>
      `<span class="hashtag-tag" onclick="aiTools._copyText('${h}')" title="Clique para copiar">${h.startsWith('#') ? h : '#' + h}</span>`
    ).join('');

    container.innerHTML = `
      <!-- HOOK -->
      <div class="result-card">
        <div class="result-card-title">🎯 Hook — Para o Scroll</div>
        <div class="result-text" style="font-size:14px;font-weight:600;color:var(--gold)">${data.hook || ''}</div>
        <div class="flex gap-8 mt-8">
          <button class="result-copy-btn" onclick="aiTools._copyText('${(data.hook||'').replace(/'/g,"\\'")}', this)">📋 Copiar</button>
          <button class="result-insert-btn" onclick="editor.insertTextOnCanvas('${(data.hook||'').replace(/'/g,"\\'")}')">+ Inserir no Canvas</button>
        </div>
      </div>

      <!-- HEADLINE -->
      <div class="result-card">
        <div class="result-card-title">✨ Headline para Arte</div>
        <div class="result-text" style="font-size:15px;font-weight:700">${data.headline || ''}</div>
        ${data.subheadline ? `<div class="result-text" style="font-size:12px;color:var(--text-muted);margin-top:4px;font-style:italic">${data.subheadline}</div>` : ''}
        <div class="flex gap-8 mt-8">
          <button class="result-copy-btn" onclick="aiTools._copyText('${(data.headline||'').replace(/'/g,"\\'")}', this)">📋 Copiar</button>
          <button class="result-insert-btn" onclick="editor.insertTextOnCanvas('${(data.headline||'').replace(/'/g,"\\'")}')">+ Inserir no Canvas</button>
        </div>
      </div>

      <!-- LEGENDA CURTA -->
      <div class="result-card">
        <div class="result-card-title">📱 Legenda Curta (Stories/Feed)</div>
        <div class="result-text">${data.legenda_curta || ''}</div>
        <button class="result-copy-btn" onclick="aiTools._copyText(\`${(data.legenda_curta||'').replace(/`/g,"\\`")}\`, this)" style="margin-top:8px">📋 Copiar legenda</button>
      </div>

      <!-- LEGENDA LONGA -->
      <div class="result-card">
        <div class="result-card-title">📝 Legenda Completa (Feed)</div>
        <div class="result-text" style="max-height:140px;overflow-y:auto;line-height:1.7">${(data.legenda_longa||'').replace(/\n/g,'<br>')}</div>
        <button class="result-copy-btn" onclick="aiTools._copyText(\`${(data.legenda_longa||'').replace(/`/g,"\\`")}\`, this)" style="margin-top:8px">📋 Copiar legenda completa</button>
      </div>

      <!-- CTA -->
      <div class="result-card">
        <div class="result-card-title">🎯 Chamada Para Ação</div>
        <div class="result-text" style="color:var(--rose);font-weight:600">${data.cta || ''}</div>
        <div class="flex gap-8 mt-8">
          <button class="result-copy-btn" onclick="aiTools._copyText('${(data.cta||'').replace(/'/g,"\\'")}', this)">📋 Copiar</button>
          <button class="result-insert-btn" onclick="editor.insertTextOnCanvas('${(data.cta||'').replace(/'/g,"\\'")}')">+ Inserir no Canvas</button>
        </div>
      </div>

      <!-- HASHTAGS -->
      <div class="result-card">
        <div class="result-card-title"># Hashtags Estratégicas</div>
        <div class="hashtag-cloud">${hashtagsHtml}</div>
        <button class="result-copy-btn" onclick="aiTools._copyText('${(data.hashtags||[]).join(' ').replace(/'/g,"\\'")}', this)" style="margin-top:8px">📋 Copiar todas</button>
      </div>

      <!-- SUGESTÃO VISUAL -->
      ${data.sugestao_visual ? `
      <div class="result-card">
        <div class="result-card-title">🎨 Sugestão Visual</div>
        <div class="result-text" style="font-style:italic;color:var(--text-muted)">${data.sugestao_visual}</div>
      </div>` : ''}
    `;
  },

  /* ════════════════════════════════════════════════
     TRENDS
  ════════════════════════════════════════════════ */

  async getTrends() {
    this._setLoading('trendsResults', 'btnGetTrends', true);

    try {
      const res = await fetch('/api/social/trends');
      const json = await res.json();
      if (!json.ok) throw new Error(json.erro || 'Erro ao buscar tendências');
      this._renderTrendsResults(json.data);
    } catch (err) {
      this._showError('trendsResults', err.message);
    }
    this._setLoading('trendsResults', 'btnGetTrends', false);
  },

  _renderTrendsResults(data) {
    const container = document.getElementById('trendsResults');
    if (!container) return;
    container.classList.remove('hidden');

    const temas = (data.trending_temas || []).map(t => `
      <div class="trend-item">
        <div class="trend-item-header">
          <span class="trend-name">${t.emoji || '🔥'} ${t.tema}</span>
          <span class="trend-badge ${t.nivel_engajamento === 'muito alto' ? 'hot' : 'high'}">${t.nivel_engajamento || 'alto'}</span>
        </div>
        <div class="trend-desc">${t.descricao || ''}</div>
        ${t.hook_exemplo ? `<div class="trend-hook">"${t.hook_exemplo}"</div>` : ''}
        ${(t.formatos_ideais||[]).length ? `
          <div style="margin-top:5px;display:flex;gap:4px;flex-wrap:wrap">
            ${t.formatos_ideais.map(f => `<span class="idea-badge">${f}</span>`).join('')}
          </div>` : ''}
      </div>
    `).join('');

    const formatos = (data.formatos_virais || []).map(f => `
      <div class="trend-item">
        <div class="trend-name">📹 ${f.formato}</div>
        <div class="trend-desc">${f.por_que_funciona || ''}</div>
        ${f.dica_implementacao ? `<div class="trend-hook">💡 ${f.dica_implementacao}</div>` : ''}
      </div>
    `).join('');

    const palettes = (data.paletas_tendencia || []).map(p => `
      <div class="result-card" style="cursor:pointer" onclick="aiTools._applyPalette(${JSON.stringify(p.cores).replace(/"/g,"'")})">
        <div class="result-card-title">${p.nome}</div>
        <div class="palette-preview">
          ${(p.cores||[]).map(c => `<div class="palette-preview-swatch" style="background:${c};border-radius:4px" title="${c}"></div>`).join('')}
        </div>
        <div class="result-text" style="font-size:11px;color:var(--text-subtle);margin-top:4px">${p.vibe || ''}</div>
      </div>
    `).join('');

    const hooks = (data.hooks_virais || []).map(h => `
      <div style="padding:8px 10px;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:4px;cursor:pointer" onclick="editor.insertTextOnCanvas('${h.replace(/'/g,"\\'")}')">
        <div style="font-size:12px;color:var(--text)">"${h}"</div>
        <div style="font-size:10px;color:var(--text-subtle);margin-top:3px">Clique para inserir no canvas</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="result-card">
        <div class="result-card-title">🔥 Temas em Alta</div>
        ${temas || '<p class="empty-state">Nenhum tema encontrado</p>'}
      </div>

      ${formatos ? `<div class="result-card">
        <div class="result-card-title">📹 Formatos Virais</div>
        ${formatos}
      </div>` : ''}

      ${hooks ? `<div class="result-card">
        <div class="result-card-title">✨ Hooks Virais — Clique para Inserir</div>
        ${hooks}
      </div>` : ''}

      ${palettes ? `<div>
        <div class="result-card-title" style="padding:8px 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--gold)">🎨 Paletas em Tendência — Clique para Aplicar</div>
        ${palettes}
      </div>` : ''}

      ${(data.erros_evitar||[]).length ? `<div class="result-card">
        <div class="result-card-title">⚠️ Erros a Evitar</div>
        ${data.erros_evitar.map(e => `<div style="display:flex;gap:6px;font-size:12px;color:var(--text-muted);margin-bottom:5px">
          <span style="color:#E87E7E;flex-shrink:0">✗</span> ${e}
        </div>`).join('')}
      </div>` : ''}
    `;
  },

  _applyPalette(colors) {
    if (!colors || !colors.length) return;
    if (editor) editor.setBackground(colors[0]);
    window.studio && studio.showToast('Paleta aplicada ao background!', 'success');
  },

  /* ════════════════════════════════════════════════
     HASHTAGS
  ════════════════════════════════════════════════ */

  async getHashtags() {
    const tema = document.getElementById('hash-tema')?.value || 'empreendedorismo feminino';
    const nicho = document.getElementById('hash-nicho')?.value || 'negócios premium';

    this._setLoading('hashtagsResults', 'btnGetHashtags', true);

    try {
      const res = await fetch('/api/social/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, nicho }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.erro || 'Erro ao gerar hashtags');
      this._renderHashtagsResults(json.data);
    } catch (err) {
      this._showError('hashtagsResults', err.message);
    }
    this._setLoading('hashtagsResults', 'btnGetHashtags', false);
  },

  _renderHashtagsResults(data) {
    const container = document.getElementById('hashtagsResults');
    if (!container) return;
    container.classList.remove('hidden');

    const renderGroup = (title, tags, color = '#C9A84C') => {
      if (!tags || !tags.length) return '';
      const allTags = tags.join(' ');
      return `
        <div class="result-card">
          <div class="result-card-title">${title}</div>
          <div class="hashtag-cloud">
            ${tags.map(h => `<span class="hashtag-tag" onclick="aiTools._copyText('${h.replace(/'/g,"\\'")}',this)" style="border-color:${color}33;color:${color}">${h.startsWith('#')?h:'#'+h}</span>`).join('')}
          </div>
          <button class="result-copy-btn" onclick="aiTools._copyText('${allTags.replace(/'/g,"\\'")}', this)" style="margin-top:6px">📋 Copiar grupo</button>
        </div>
      `;
    };

    const allHashtags = [
      ...(data.hashtags_nicho || []),
      ...(data.hashtags_medio_alcance || []),
      ...(data.hashtags_alto_alcance || []),
      ...(data.hashtags_tendencia || []),
      ...(data.hashtags_publico_feminino || []),
    ].join(' ');

    container.innerHTML = `
      ${renderGroup('🎯 Nicho Específico (menor competição)', data.hashtags_nicho, '#6BCB77')}
      ${renderGroup('📊 Médio Alcance (mais recomendado)', data.hashtags_medio_alcance, '#C9A84C')}
      ${renderGroup('🚀 Alto Alcance', data.hashtags_alto_alcance, '#7EB8E8')}
      ${renderGroup('🔥 Em Tendência Agora', data.hashtags_tendencia, '#E87E7E')}
      ${renderGroup('💜 Público Feminino', data.hashtags_publico_feminino, '#E8B4B8')}

      ${data.estrategia_resumida ? `
      <div class="result-card" style="border-color:rgba(201,168,76,0.3)">
        <div class="result-card-title">💡 Estratégia de Uso</div>
        <div class="result-text" style="font-size:12px;line-height:1.7">${data.estrategia_resumida}</div>
      </div>` : ''}

      ${data.hashtag_branded_sugestao ? `
      <div class="result-card">
        <div class="result-card-title">✨ Hashtag da Sua Marca</div>
        <div class="result-text" style="font-size:18px;font-weight:700;color:var(--gold)">${data.hashtag_branded_sugestao}</div>
        <button class="result-copy-btn" onclick="aiTools._copyText('${(data.hashtag_branded_sugestao||'').replace(/'/g,"\\'")}',this)" style="margin-top:6px">📋 Copiar</button>
      </div>` : ''}

      <div class="result-card" style="background:rgba(201,168,76,0.05);border-color:rgba(201,168,76,0.3)">
        <div class="result-card-title">📋 Copiar TODAS as Hashtags</div>
        <div class="result-text" style="font-size:11px;color:var(--text-subtle);word-break:break-all;max-height:80px;overflow:hidden">${allHashtags.substring(0,200)}...</div>
        <button class="result-insert-btn" onclick="aiTools._copyText('${allHashtags.replace(/'/g,"\\'")}',this)" style="margin-top:8px">
          📋 Copiar Mix Completo
        </button>
      </div>
    `;
  },

  /* ════════════════════════════════════════════════
     CONTENT IDEAS
  ════════════════════════════════════════════════ */

  async getContentIdeas() {
    const nicho = document.getElementById('idea-nicho')?.value || 'empreendedorismo feminino';
    const objetivo = document.getElementById('idea-objetivo')?.value || 'crescimento de seguidores';
    const quantidade = document.getElementById('idea-quantidade')?.value || '10';

    this._setLoading('ideasResults', 'btnGetIdeas', true);

    try {
      const res = await fetch('/api/social/content-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicho, objetivo, quantidade: parseInt(quantidade) }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.erro || 'Erro ao gerar ideias');
      this._renderIdeasResults(json.data);
    } catch (err) {
      this._showError('ideasResults', err.message);
    }
    this._setLoading('ideasResults', 'btnGetIdeas', false);
  },

  _renderIdeasResults(data) {
    const container = document.getElementById('ideasResults');
    if (!container) return;
    container.classList.remove('hidden');

    const viralColors = { alto: '#6BCB77', médio: '#C9A84C', baixo: '#9990AA' };
    const formatIcons = { reels: '🎬', carrossel: '📊', post: '🖼', stories: '📱', carousel: '📊' };

    const items = (data.ideias || []).map(i => `
      <div class="idea-item">
        <div class="idea-header">
          <span class="idea-emoji">${i.emoji || formatIcons[i.formato] || '💡'}</span>
          <div>
            <div class="idea-title">${i.titulo || ''}</div>
            <div class="idea-meta">
              <span class="idea-badge" style="border-color:rgba(201,168,76,0.3);color:var(--gold)">${i.formato || 'post'}</span>
              <span class="idea-badge">${i.categoria || ''}</span>
              <span class="idea-badge" style="border-color:${viralColors[i.potencial_viral]||'#C9A84C'}33;color:${viralColors[i.potencial_viral]||'#C9A84C'}">viral: ${i.potencial_viral || 'médio'}</span>
              <span class="idea-badge">${i.nivel_producao || 'médio'}</span>
            </div>
          </div>
        </div>
        ${i.hook ? `<div class="trend-hook">"${i.hook}"</div>` : ''}
        <div class="idea-desc">${i.descricao || ''}</div>
        <button class="result-copy-btn" onclick="aiTools._copyText('${(i.titulo+': '+i.descricao).replace(/'/g,"\\'")}',this)" style="margin-top:6px">📋 Copiar ideia</button>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="result-card">
        <div class="result-card-title">💡 ${(data.ideias||[]).length} Ideias de Conteúdo</div>
        ${items || '<p class="empty-state">Nenhuma ideia gerada</p>'}
      </div>
    `;
  },

  /* ════════════════════════════════════════════════
     CAROUSEL SCRIPT
  ════════════════════════════════════════════════ */

  async getCarouselScript() {
    const tema = document.getElementById('car-tema')?.value || 'estratégias para empreendedoras';
    const slides = document.getElementById('car-slides')?.value || '7';
    const nicho = document.getElementById('car-nicho')?.value || 'negócios femininos';

    this._setLoading('carouselResults', 'btnGetCarousel', true);

    try {
      const res = await fetch('/api/social/carousel-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, slides: parseInt(slides), nicho }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.erro || 'Erro ao gerar roteiro');
      this._renderCarouselResults(json.data);
    } catch (err) {
      this._showError('carouselResults', err.message);
    }
    this._setLoading('carouselResults', 'btnGetCarousel', false);
  },

  _renderCarouselResults(data) {
    const container = document.getElementById('carouselResults');
    if (!container) return;
    container.classList.remove('hidden');

    const slideItems = (data.slides || []).map(s => `
      <div style="padding:10px;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:6px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <div style="width:24px;height:24px;background:rgba(201,168,76,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--gold);flex-shrink:0">${s.numero}</div>
          <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">${s.tipo || 'conteúdo'}</div>
        </div>
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">${s.titulo || ''}</div>
        ${s.subtitulo ? `<div style="font-size:11px;color:var(--gold);font-style:italic;margin-bottom:4px">${s.subtitulo}</div>` : ''}
        ${s.texto_corpo ? `<div style="font-size:12px;color:var(--text-muted);line-height:1.6">${s.texto_corpo}</div>` : ''}
        ${s.elemento_visual ? `<div style="font-size:10px;color:var(--text-subtle);margin-top:4px;font-style:italic">🎨 ${s.elemento_visual}</div>` : ''}
        <button class="result-copy-btn" onclick="aiTools._copyText('${((s.titulo||'')+' '+( s.texto_corpo||'')).replace(/'/g,"\\'")}',this)" style="margin-top:6px">+ Inserir slide</button>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="result-card" style="border-color:rgba(201,168,76,0.3)">
        <div class="result-card-title">📊 ${data.titulo_carrossel || 'Roteiro do Carrossel'}</div>
        ${data.promessa ? `<div style="font-size:12px;color:var(--text-muted);font-style:italic;margin-bottom:12px">✨ ${data.promessa}</div>` : ''}
        ${slideItems}
        ${data.cta_ultimo_slide ? `
          <div style="margin-top:8px;padding:10px;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.3);border-radius:var(--radius-sm)">
            <div style="font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">CTA Último Slide</div>
            <div style="font-size:13px;color:var(--text)">${data.cta_ultimo_slide}</div>
          </div>` : ''}
      </div>

      ${data.legenda_post ? `
      <div class="result-card">
        <div class="result-card-title">📝 Legenda do Post</div>
        <div class="result-text" style="max-height:120px;overflow-y:auto">${(data.legenda_post||'').replace(/\n/g,'<br>')}</div>
        <button class="result-copy-btn" onclick="aiTools._copyText(\`${(data.legenda_post||'').replace(/`/g,"\\`")}\`,this)" style="margin-top:8px">📋 Copiar legenda</button>
      </div>` : ''}

      ${data.dica_design ? `
      <div class="result-card">
        <div class="result-card-title">🎨 Dica de Design</div>
        <div class="result-text" style="font-style:italic;color:var(--text-muted)">${data.dica_design}</div>
      </div>` : ''}

      <button class="result-insert-btn" onclick="aiTools._applyCarouselToCanvas()" style="margin-top:8px">
        🎨 Aplicar Roteiro ao Canvas
      </button>
    `;

    // Store data for canvas application
    this._lastCarouselData = data;
  },

  _applyCarouselToCanvas(data) {
    const d = data || this._lastCarouselData;
    if (!d || !editor) return;

    // Switch to carousel format
    if (window.studio) studio.setFormat('carousel');

    setTimeout(() => {
      // Apply title slide
      const titleSlide = d.slides?.[0];
      if (titleSlide && editor) {
        editor.fabricCanvas.clear();
        editor.fabricCanvas.setBackgroundColor('#1A1228', () => {});

        const titleText = new fabric.Textbox(titleSlide.titulo || d.titulo_carrossel || '', {
          left: 90, top: 150, width: 900, fontSize: 76,
          fontFamily: 'Playfair Display', fill: '#F0ECE3',
          textAlign: 'center', fontWeight: '700', lineHeight: 1.1,
        });
        editor.fabricCanvas.add(titleText);

        if (titleSlide.subtitulo) {
          const subText = new fabric.Textbox(titleSlide.subtitulo, {
            left: 90, top: 380, width: 900, fontSize: 38,
            fontFamily: 'Cormorant Garamond', fill: '#C9A84C',
            textAlign: 'center', fontStyle: 'italic',
          });
          editor.fabricCanvas.add(subText);
        }

        editor.fabricCanvas.renderAll();
        editor._saveHistory();
      }
      window.studio && studio.showToast('Capa do carrossel aplicada!', 'success');
    }, 300);
  },

};
