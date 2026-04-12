/* ════════════════════════════════════════════════════
   TEMPLATES — Premium Library
   Curated for Women Entrepreneurs
════════════════════════════════════════════════════ */

const TEMPLATES = [

  /* ── VENDAS ─────────────────────────────────── */
  {
    id: 'vendas-01',
    name: 'Oferta Premium',
    category: 'vendas',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#1A0A2E,#2D1855)', text: '#C9A84C' },
    canvas: {
      background: '#1A0A2E',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#1A0A2E', selectable: false },
        { type: 'rect', left: 40, top: 40, width: 1000, height: 1000, fill: 'transparent', stroke: '#C9A84C', strokeWidth: 2, rx: 4, selectable: false },
        { type: 'rect', left: 0, top: 480, width: 1080, height: 2, fill: 'rgba(201,168,76,0.3)', selectable: false },
        { type: 'text', text: 'OFERTA EXCLUSIVA', left: 540, top: 120, fontSize: 22, fontFamily: 'Josefin Sans', fill: '#C9A84C', textAlign: 'center', letterSpacing: 6, originX: 'center' },
        { type: 'text', text: 'Sua Transformação\nComeça Aqui', left: 540, top: 200, fontSize: 72, fontFamily: 'Playfair Display', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.1, fontWeight: '700', originX: 'center' },
        { type: 'text', text: 'Uma oportunidade única para mulheres que buscam\nexcelência e resultados extraordinários', left: 540, top: 400, fontSize: 28, fontFamily: 'Cormorant Garamond', fill: 'rgba(240,236,227,0.75)', textAlign: 'center', fontStyle: 'italic', originX: 'center' },
        { type: 'rect', left: 340, top: 550, width: 400, height: 80, fill: '#C9A84C', rx: 4, selectable: false },
        { type: 'text', text: 'QUERO TRANSFORMAR', left: 540, top: 590, fontSize: 22, fontFamily: 'Josefin Sans', fill: '#0A0A14', textAlign: 'center', fontWeight: '700', letterSpacing: 2, originX: 'center' },
        { type: 'text', text: '✦   vagas limitadas   ✦', left: 540, top: 700, fontSize: 20, fontFamily: 'Cormorant Garamond', fill: 'rgba(201,168,76,0.6)', textAlign: 'center', originX: 'center' },
      ]
    }
  },

  {
    id: 'vendas-02',
    name: 'Lançamento Gold',
    category: 'vendas',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#0D0D1A,#1A1530)', text: '#E8D5A3' },
    canvas: {
      background: '#0D0D1A',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 540, fill: '#12122A', selectable: false },
        { type: 'text', text: 'NOVO', left: 540, top: 80, fontSize: 18, fontFamily: 'Josefin Sans', fill: '#C9A84C', textAlign: 'center', letterSpacing: 8, originX: 'center' },
        { type: 'text', text: 'É hora de\nchegar ao\npróximo nível', left: 540, top: 160, fontSize: 82, fontFamily: 'Playfair Display', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.05, fontWeight: '700', originX: 'center' },
        { type: 'rect', left: 100, top: 530, width: 880, height: 1, fill: '#C9A84C', selectable: false },
        { type: 'text', text: 'Programa Premium para Mulheres Empreendedoras', left: 540, top: 570, fontSize: 26, fontFamily: 'Cormorant Garamond', fill: '#C9A84C', textAlign: 'center', fontStyle: 'italic', originX: 'center' },
        { type: 'text', text: 'INSCRIÇÕES ABERTAS → link na bio', left: 540, top: 660, fontSize: 20, fontFamily: 'Josefin Sans', fill: 'rgba(240,236,227,0.6)', textAlign: 'center', letterSpacing: 1, originX: 'center' },
      ]
    }
  },

  {
    id: 'vendas-03',
    name: 'Resultado Cliente',
    category: 'vendas',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#0F1A0F,#1A2E1A)', text: '#6BCB77' },
    canvas: {
      background: '#0F1A0F',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#0F1A0F', selectable: false },
        { type: 'text', text: 'RESULTADO REAL', left: 540, top: 80, fontSize: 18, fontFamily: 'Josefin Sans', fill: '#6BCB77', textAlign: 'center', letterSpacing: 6, originX: 'center' },
        { type: 'text', text: '"Finalmente\nalcancei o\nfaturamento\nque merecia"', left: 540, top: 160, fontSize: 68, fontFamily: 'Lora', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.1, fontStyle: 'italic', originX: 'center' },
        { type: 'text', text: '— Ana Paula, 3 meses no programa', left: 540, top: 640, fontSize: 22, fontFamily: 'Cormorant Garamond', fill: 'rgba(240,236,227,0.5)', textAlign: 'center', originX: 'center' },
        { type: 'rect', left: 200, top: 700, width: 680, height: 60, fill: 'rgba(107,203,119,0.12)', stroke: 'rgba(107,203,119,0.3)', strokeWidth: 1, rx: 30, selectable: false },
        { type: 'text', text: 'Quer ser a próxima?', left: 540, top: 730, fontSize: 20, fontFamily: 'Josefin Sans', fill: '#6BCB77', textAlign: 'center', letterSpacing: 2, originX: 'center' },
      ]
    }
  },

  /* ── MOTIVACIONAL ────────────────────────────── */
  {
    id: 'moti-01',
    name: 'Frase de Poder',
    category: 'motivacional',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#0A0A14,#1A1228)', text: '#E8B4B8' },
    canvas: {
      background: '#0A0A14',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#0A0A14', selectable: false },
        { type: 'text', text: '✦', left: 540, top: 140, fontSize: 40, fontFamily: 'Cormorant Garamond', fill: '#C9A84C', textAlign: 'center', originX: 'center' },
        { type: 'text', text: '"Você não está\nconstruindo um\nnegócio. Você está\nconstruindo um\nlegado."', left: 540, top: 220, fontSize: 64, fontFamily: 'Cormorant Garamond', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.15, fontStyle: 'italic', originX: 'center' },
        { type: 'text', text: '✦', left: 540, top: 840, fontSize: 40, fontFamily: 'Cormorant Garamond', fill: '#C9A84C', textAlign: 'center', originX: 'center' },
      ]
    }
  },

  {
    id: 'moti-02',
    name: 'Empoderamento',
    category: 'motivacional',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#1A0A14,#2E1A28)', text: '#E8B4B8' },
    canvas: {
      background: '#1A0A14',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#1A0A14', selectable: false },
        { type: 'rect', left: 540, top: 0, width: 1, height: 1080, fill: 'rgba(232,180,184,0.15)', selectable: false },
        { type: 'text', text: 'Ela não\npediu\npermissão', left: 270, top: 380, fontSize: 80, fontFamily: 'Playfair Display', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.1, fontWeight: '700', originX: 'center' },
        { type: 'text', text: 'ela simplesmente\nconstruiu.', left: 810, top: 420, fontSize: 44, fontFamily: 'Dancing Script', fill: '#E8B4B8', textAlign: 'center', lineHeight: 1.3, originX: 'center' },
      ]
    }
  },

  {
    id: 'moti-03',
    name: 'Manhã de Sucesso',
    category: 'motivacional',
    format: 'story',
    preview: { bg: 'linear-gradient(180deg,#C9A84C22,#1A1228)', text: '#F0ECE3' },
    canvas: {
      background: '#0D0D1A',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: '#0D0D1A', selectable: false },
        { type: 'text', text: 'Bom dia,\nEmpreendedora', left: 540, top: 320, fontSize: 88, fontFamily: 'Cormorant Garamond', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.1, fontStyle: 'italic', originX: 'center' },
        { type: 'rect', left: 340, top: 560, width: 400, height: 2, fill: '#C9A84C', selectable: false },
        { type: 'text', text: 'Hoje é mais um dia de construir\no que você merece.', left: 540, top: 610, fontSize: 38, fontFamily: 'Montserrat', fill: 'rgba(240,236,227,0.7)', textAlign: 'center', lineHeight: 1.5, fontWeight: '300', originX: 'center' },
        { type: 'text', text: '✦   inspire   •   crie   •   venda   ✦', left: 540, top: 800, fontSize: 24, fontFamily: 'Josefin Sans', fill: 'rgba(201,168,76,0.5)', textAlign: 'center', letterSpacing: 4, originX: 'center' },
      ]
    }
  },

  /* ── LIFESTYLE ───────────────────────────────── */
  {
    id: 'life-01',
    name: 'Lifestyle Premium',
    category: 'lifestyle',
    format: 'post-portrait',
    preview: { bg: 'linear-gradient(180deg,#1A1228,#0D0D1A)', text: '#C9A84C' },
    canvas: {
      background: '#1A1228',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1350, fill: '#1A1228', selectable: false },
        { type: 'rect', left: 60, top: 60, width: 960, height: 700, fill: '#12122A', rx: 8, selectable: false },
        { type: 'text', text: '[ sua foto aqui ]', left: 540, top: 410, fontSize: 28, fontFamily: 'Josefin Sans', fill: 'rgba(255,255,255,0.15)', textAlign: 'center', letterSpacing: 4, originX: 'center' },
        { type: 'text', text: 'Vida de\nEmpreendedora', left: 540, top: 840, fontSize: 76, fontFamily: 'Playfair Display', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.1, fontStyle: 'italic', originX: 'center' },
        { type: 'text', text: 'Liberdade. Propósito. Abundância.', left: 540, top: 1060, fontSize: 28, fontFamily: 'Josefin Sans', fill: '#C9A84C', textAlign: 'center', letterSpacing: 3, originX: 'center' },
        { type: 'text', text: '@suamarca', left: 540, top: 1160, fontSize: 24, fontFamily: 'Montserrat', fill: 'rgba(240,236,227,0.4)', textAlign: 'center', originX: 'center' },
      ]
    }
  },

  {
    id: 'life-02',
    name: 'Bastidores Chic',
    category: 'lifestyle',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#1A1614,#2A2420)', text: '#E8D5A3' },
    canvas: {
      background: '#1A1614',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#1A1614', selectable: false },
        { type: 'rect', left: 0, top: 700, width: 1080, height: 380, fill: 'rgba(10,10,20,0.7)', selectable: false },
        { type: 'text', text: 'Bastidores', left: 80, top: 740, fontSize: 70, fontFamily: 'Dancing Script', fill: '#E8D5A3', originX: 'left' },
        { type: 'text', text: 'do sucesso', left: 80, top: 820, fontSize: 70, fontFamily: 'Dancing Script', fill: 'rgba(232,213,163,0.5)', originX: 'left' },
        { type: 'rect', left: 80, top: 920, width: 200, height: 2, fill: '#C9A84C', selectable: false },
        { type: 'text', text: 'Onde a magia acontece 🌟', left: 80, top: 950, fontSize: 24, fontFamily: 'Montserrat', fill: 'rgba(240,236,227,0.7)', originX: 'left' },
      ]
    }
  },

  /* ── EDUCACIONAL ─────────────────────────────── */
  {
    id: 'edu-01',
    name: 'Top 3 Dicas',
    category: 'educacional',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#0A1A14,#162814)', text: '#6BCB77' },
    canvas: {
      background: '#0A1A14',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#0A1A14', selectable: false },
        { type: 'text', text: '3 coisas que toda\nempreendedora\nprecisa saber', left: 540, top: 80, fontSize: 66, fontFamily: 'Playfair Display', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.15, fontWeight: '700', originX: 'center' },
        { type: 'rect', left: 80, top: 380, width: 920, height: 1, fill: 'rgba(107,203,119,0.3)', selectable: false },
        { type: 'text', text: '01', left: 120, top: 420, fontSize: 56, fontFamily: 'Cormorant Garamond', fill: 'rgba(107,203,119,0.4)', fontWeight: '300' },
        { type: 'text', text: 'Sua marca é a\nsua maior venda', left: 200, top: 430, fontSize: 34, fontFamily: 'Montserrat', fill: '#F0ECE3', fontWeight: '500' },
        { type: 'text', text: '02', left: 120, top: 580, fontSize: 56, fontFamily: 'Cormorant Garamond', fill: 'rgba(107,203,119,0.4)', fontWeight: '300' },
        { type: 'text', text: 'Consistência supera\nperfeição sempre', left: 200, top: 590, fontSize: 34, fontFamily: 'Montserrat', fill: '#F0ECE3', fontWeight: '500' },
        { type: 'text', text: '03', left: 120, top: 740, fontSize: 56, fontFamily: 'Cormorant Garamond', fill: 'rgba(107,203,119,0.4)', fontWeight: '300' },
        { type: 'text', text: 'Invista em você\nantes de tudo', left: 200, top: 750, fontSize: 34, fontFamily: 'Montserrat', fill: '#F0ECE3', fontWeight: '500' },
        { type: 'text', text: 'Salve para não esquecer ✨', left: 540, top: 960, fontSize: 22, fontFamily: 'Josefin Sans', fill: '#6BCB77', textAlign: 'center', letterSpacing: 2, originX: 'center' },
      ]
    }
  },

  {
    id: 'edu-02',
    name: 'Tutorial Passo a Passo',
    category: 'educacional',
    format: 'carousel',
    preview: { bg: 'linear-gradient(135deg,#121228,#1E1E3A)', text: '#C9A84C' },
    canvas: {
      background: '#121228',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#121228', selectable: false },
        { type: 'text', text: 'PASSO 01', left: 540, top: 120, fontSize: 20, fontFamily: 'Josefin Sans', fill: '#C9A84C', textAlign: 'center', letterSpacing: 6, originX: 'center' },
        { type: 'text', text: 'Defina seu\npúblico ideal', left: 540, top: 200, fontSize: 76, fontFamily: 'Playfair Display', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.1, fontWeight: '700', originX: 'center' },
        { type: 'text', text: 'Antes de criar qualquer conteúdo,\nsaiba exatamente com quem você\nquer falar e o que ela precisa ouvir.', left: 540, top: 450, fontSize: 30, fontFamily: 'Cormorant Garamond', fill: 'rgba(240,236,227,0.7)', textAlign: 'center', lineHeight: 1.5, originX: 'center' },
        { type: 'rect', left: 340, top: 680, width: 400, height: 1, fill: '#C9A84C', selectable: false },
        { type: 'text', text: '→ arraste para continuar', left: 540, top: 900, fontSize: 18, fontFamily: 'Josefin Sans', fill: 'rgba(201,168,76,0.5)', textAlign: 'center', letterSpacing: 3, originX: 'center' },
      ]
    }
  },

  {
    id: 'edu-03',
    name: 'Fato & Dica',
    category: 'educacional',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#1A1430,#0D0D1A)', text: '#7EB8E8' },
    canvas: {
      background: '#1A1430',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#1A1430', selectable: false },
        { type: 'rect', left: 0, top: 0, width: 1080, height: 500, fill: 'rgba(126,184,232,0.08)', selectable: false },
        { type: 'text', text: 'VOCÊ SABIA?', left: 540, top: 100, fontSize: 20, fontFamily: 'Josefin Sans', fill: '#7EB8E8', textAlign: 'center', letterSpacing: 6, originX: 'center' },
        { type: 'text', text: '89%', left: 540, top: 180, fontSize: 180, fontFamily: 'Cormorant Garamond', fill: '#F0ECE3', textAlign: 'center', fontWeight: '300', originX: 'center' },
        { type: 'text', text: 'das empreendedoras de sucesso\nconsomem conteúdo educativo\ntodos os dias', left: 540, top: 420, fontSize: 28, fontFamily: 'Montserrat', fill: 'rgba(240,236,227,0.75)', textAlign: 'center', lineHeight: 1.5, fontWeight: '300', originX: 'center' },
        { type: 'rect', left: 200, top: 600, width: 680, height: 1, fill: 'rgba(126,184,232,0.3)', selectable: false },
        { type: 'text', text: 'DICA PREMIUM:', left: 540, top: 640, fontSize: 16, fontFamily: 'Josefin Sans', fill: '#7EB8E8', textAlign: 'center', letterSpacing: 4, originX: 'center' },
        { type: 'text', text: 'Reserve 30 minutos do seu dia\npara aprender algo novo sobre\nseu nicho ou sobre negócios.', left: 540, top: 700, fontSize: 28, fontFamily: 'Cormorant Garamond', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.5, fontStyle: 'italic', originX: 'center' },
      ]
    }
  },

  /* ── LANÇAMENTO ──────────────────────────────── */
  {
    id: 'lanc-01',
    name: 'Contagem Regressiva',
    category: 'lancamento',
    format: 'story',
    preview: { bg: 'linear-gradient(180deg,#1A0A2E,#0D0D1A)', text: '#C9A84C' },
    canvas: {
      background: '#1A0A2E',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: '#1A0A2E', selectable: false },
        { type: 'text', text: 'CHEGANDO EM BREVE', left: 540, top: 280, fontSize: 22, fontFamily: 'Josefin Sans', fill: '#C9A84C', textAlign: 'center', letterSpacing: 6, originX: 'center' },
        { type: 'text', text: 'Algo grande\nestá vindo...', left: 540, top: 380, fontSize: 90, fontFamily: 'Playfair Display', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.1, fontStyle: 'italic', originX: 'center' },
        { type: 'rect', left: 190, top: 660, width: 700, height: 180, fill: 'rgba(201,168,76,0.08)', stroke: '#C9A84C', strokeWidth: 1, rx: 8, selectable: false },
        { type: 'text', text: '07', left: 540, top: 695, fontSize: 110, fontFamily: 'Cormorant Garamond', fill: '#C9A84C', textAlign: 'center', fontWeight: '300', originX: 'center' },
        { type: 'text', text: 'DIAS', left: 540, top: 820, fontSize: 22, fontFamily: 'Josefin Sans', fill: 'rgba(201,168,76,0.6)', textAlign: 'center', letterSpacing: 8, originX: 'center' },
        { type: 'text', text: 'Ative as notificações para\nser a primeira a saber!', left: 540, top: 960, fontSize: 32, fontFamily: 'Cormorant Garamond', fill: 'rgba(240,236,227,0.7)', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5, originX: 'center' },
      ]
    }
  },

  {
    id: 'lanc-02',
    name: 'Abertura de Inscrições',
    category: 'lancamento',
    format: 'post-square',
    preview: { bg: 'linear-gradient(135deg,#0D1A0A,#182810)', text: '#C9A84C' },
    canvas: {
      background: '#0D1A0A',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#0D1A0A', selectable: false },
        { type: 'text', text: '✦ INSCRIÇÕES ABERTAS ✦', left: 540, top: 100, fontSize: 20, fontFamily: 'Josefin Sans', fill: '#C9A84C', textAlign: 'center', letterSpacing: 4, originX: 'center' },
        { type: 'text', text: 'A turma que\nmuda vidas', left: 540, top: 180, fontSize: 84, fontFamily: 'Playfair Display', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.05, fontWeight: '700', originX: 'center' },
        { type: 'text', text: 'já começou', left: 540, top: 430, fontSize: 84, fontFamily: 'Playfair Display', fill: '#C9A84C', textAlign: 'center', fontStyle: 'italic', originX: 'center' },
        { type: 'rect', left: 140, top: 580, width: 800, height: 90, fill: '#C9A84C', rx: 8, selectable: false },
        { type: 'text', text: 'GARANTIR MINHA VAGA', left: 540, top: 625, fontSize: 26, fontFamily: 'Josefin Sans', fill: '#0A0A14', textAlign: 'center', fontWeight: '700', letterSpacing: 2, originX: 'center' },
        { type: 'text', text: 'apenas 30 vagas disponíveis • link na bio', left: 540, top: 740, fontSize: 20, fontFamily: 'Cormorant Garamond', fill: 'rgba(201,168,76,0.5)', textAlign: 'center', originX: 'center' },
      ]
    }
  },

  /* ── REEL COVERS ─────────────────────────────── */
  {
    id: 'reel-01',
    name: 'Reel Cover Chic',
    category: 'lancamento',
    format: 'reel-cover',
    preview: { bg: 'linear-gradient(180deg,#0A0A14,#1A1228)', text: '#C9A84C' },
    canvas: {
      background: '#0A0A14',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: '#0A0A14', selectable: false },
        { type: 'rect', left: 60, top: 60, width: 960, height: 1800, fill: 'transparent', stroke: 'rgba(201,168,76,0.3)', strokeWidth: 1, rx: 4, selectable: false },
        { type: 'text', text: '▶', left: 540, top: 740, fontSize: 80, fontFamily: 'Montserrat', fill: 'rgba(201,168,76,0.6)', textAlign: 'center', originX: 'center' },
        { type: 'text', text: 'Novo Vídeo', left: 540, top: 920, fontSize: 72, fontFamily: 'Dancing Script', fill: '#F0ECE3', textAlign: 'center', originX: 'center' },
        { type: 'text', text: 'ASSISTA AGORA', left: 540, top: 1040, fontSize: 22, fontFamily: 'Josefin Sans', fill: '#C9A84C', textAlign: 'center', letterSpacing: 6, originX: 'center' },
      ]
    }
  },

  /* ── STORY EXTRAS ────────────────────────────── */
  {
    id: 'story-01',
    name: 'Story Elegante',
    category: 'lifestyle',
    format: 'story',
    preview: { bg: 'linear-gradient(180deg,#0A0A14,#1A0A1A)', text: '#E8B4B8' },
    canvas: {
      background: '#0A0A14',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: '#0A0A14', selectable: false },
        { type: 'text', text: 'hoje no escritório', left: 540, top: 260, fontSize: 52, fontFamily: 'Dancing Script', fill: '#E8B4B8', textAlign: 'center', originX: 'center' },
        { type: 'rect', left: 140, top: 380, width: 800, height: 800, fill: '#12122A', rx: 12, selectable: false },
        { type: 'text', text: '[ foto ]', left: 540, top: 780, fontSize: 28, fontFamily: 'Josefin Sans', fill: 'rgba(255,255,255,0.1)', textAlign: 'center', letterSpacing: 6, originX: 'center' },
        { type: 'text', text: '✨ construindo o futuro,\num dia de cada vez ✨', left: 540, top: 1280, fontSize: 36, fontFamily: 'Cormorant Garamond', fill: 'rgba(240,236,227,0.8)', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5, originX: 'center' },
      ]
    }
  },

  {
    id: 'story-02',
    name: 'Story CTA',
    category: 'vendas',
    format: 'story',
    preview: { bg: 'linear-gradient(180deg,#1A0A0A,#2E1010)', text: '#E87E7E' },
    canvas: {
      background: '#1A0A0A',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: '#1A0A0A', selectable: false },
        { type: 'text', text: 'ÚLTIMAS', left: 540, top: 320, fontSize: 100, fontFamily: 'Josefin Sans', fill: '#F0ECE3', textAlign: 'center', fontWeight: '700', letterSpacing: 4, originX: 'center' },
        { type: 'text', text: 'VAGAS', left: 540, top: 430, fontSize: 100, fontFamily: 'Josefin Sans', fill: '#E87E7E', textAlign: 'center', fontWeight: '700', letterSpacing: 4, originX: 'center' },
        { type: 'text', text: 'disponíveis', left: 540, top: 540, fontSize: 52, fontFamily: 'Dancing Script', fill: 'rgba(240,236,227,0.6)', textAlign: 'center', originX: 'center' },
        { type: 'rect', left: 0, top: 660, width: 1080, height: 2, fill: 'rgba(232,126,126,0.3)', selectable: false },
        { type: 'text', text: 'Não perca essa\noportunidade única', left: 540, top: 720, fontSize: 52, fontFamily: 'Cormorant Garamond', fill: '#F0ECE3', textAlign: 'center', lineHeight: 1.3, fontStyle: 'italic', originX: 'center' },
        { type: 'rect', left: 190, top: 920, width: 700, height: 90, fill: '#E87E7E', rx: 8, selectable: false },
        { type: 'text', text: 'SWIPE UP ↑', left: 540, top: 965, fontSize: 26, fontFamily: 'Josefin Sans', fill: '#FFF', textAlign: 'center', fontWeight: '700', letterSpacing: 4, originX: 'center' },
      ]
    }
  },

];

/* ────────────────────────────────────────────────── */
/* Template Renderer: applies a template to fabric canvas */
/* ────────────────────────────────────────────────── */

function applyTemplate(canvas, templateId) {
  const tpl = TEMPLATES.find(t => t.id === templateId);
  if (!tpl || !canvas) return;

  canvas.clear();
  canvas.setBackgroundColor(tpl.canvas.background, canvas.renderAll.bind(canvas));

  tpl.canvas.objects.forEach(obj => {
    let fabricObj;

    if (obj.type === 'rect') {
      fabricObj = new fabric.Rect({
        left: obj.left, top: obj.top,
        width: obj.width, height: obj.height,
        fill: obj.fill || 'transparent',
        stroke: obj.stroke || null,
        strokeWidth: obj.strokeWidth || 0,
        rx: obj.rx || 0, ry: obj.rx || 0,
        selectable: obj.selectable !== false,
        evented: obj.selectable !== false,
        originX: obj.originX || 'left',
        originY: obj.originY || 'top',
        opacity: obj.opacity !== undefined ? obj.opacity : 1,
      });
    } else if (obj.type === 'text') {
      fabricObj = new fabric.Textbox(obj.text || '', {
        left: obj.left, top: obj.top,
        fontSize: obj.fontSize || 40,
        fontFamily: obj.fontFamily || 'Montserrat',
        fill: obj.fill || '#FFFFFF',
        textAlign: obj.textAlign || 'left',
        lineHeight: obj.lineHeight || 1.2,
        fontWeight: obj.fontWeight || 'normal',
        fontStyle: obj.fontStyle || 'normal',
        charSpacing: (obj.letterSpacing || 0) * 10,
        originX: obj.originX || 'left',
        originY: obj.originY || 'top',
        width: obj.width || (obj.textAlign === 'center' ? 1000 : 900),
      });
      if (obj.originX === 'center') {
        fabricObj.set({ left: obj.left - (fabricObj.width / 2) });
      }
    }

    if (fabricObj) canvas.add(fabricObj);
  });

  canvas.renderAll();
}

/* ────────────────────────────────────────────────── */
/* Render template thumbnails in the sidebar */
/* ────────────────────────────────────────────────── */

function renderTemplateCards(container, filterCategory = 'all', searchQuery = '') {
  if (!container) return;
  container.innerHTML = '';

  const filtered = TEMPLATES.filter(tpl => {
    const matchCat = filterCategory === 'all' || tpl.category === filterCategory;
    const matchSearch = !searchQuery || tpl.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state" style="grid-column:span 2">Nenhum template encontrado.</p>';
    return;
  }

  filtered.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.dataset.id = tpl.id;
    card.innerHTML = `
      <div class="template-preview" style="background:${tpl.preview.bg}; color:${tpl.preview.text}">
        <span style="font-size:10px;font-weight:700;letter-spacing:1px;opacity:.7;font-family:'Josefin Sans',sans-serif;text-transform:uppercase">${categoryLabel(tpl.category)}</span>
        <span style="font-size:14px;font-family:'Playfair Display',serif;text-align:center;margin-top:4px;color:${tpl.preview.text};line-height:1.2">${tpl.name}</span>
        <span style="font-size:9px;opacity:.5;font-family:'Josefin Sans',sans-serif;letter-spacing:1px;margin-top:4px">${formatLabel(tpl.format)}</span>
      </div>
      <div class="template-name">${tpl.name}</div>
    `;
    card.addEventListener('click', () => {
      window.studio && studio.applyTemplate(tpl.id);
    });
    container.appendChild(card);
  });
}

function categoryLabel(cat) {
  const map = { vendas:'Vendas', motivacional:'Poder', lifestyle:'Lifestyle', educacional:'Dicas', lancamento:'Lançamento' };
  return map[cat] || cat;
}

function formatLabel(fmt) {
  const map = { 'post-square':'Post 1:1', 'post-portrait':'Post 4:5', 'story':'Story 9:16', 'carousel':'Carrossel', 'reel-cover':'Reel Cover' };
  return map[fmt] || fmt;
}
