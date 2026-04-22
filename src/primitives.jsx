// ============================================================
// PRIMITIVES — Pill, strategy meta, TemplatePreview SVG
// ============================================================

const L = window.LucideIcons;

// ---- Pill ---------------------------------------------------
window.Pill = ({ children, tone = 'neutral', className = '' }) => {
  const tones = {
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    purple:  'bg-violet-50 text-violet-800 border-violet-200',
    green:   'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber:   'bg-amber-50 text-amber-800 border-amber-200',
    rose:    'bg-rose-50 text-rose-800 border-rose-200',
    ink:     'bg-stone-900 text-white border-stone-900',
    subtle:  'bg-white text-stone-600 border-stone-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border text-[10.5px] font-medium tracking-[0.01em] ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
};

// ---- Strategy meta -----------------------------------------
window.STRATEGY_META = {
  static:   { label: 'Static',     iconKey: 'Lock',     tone: 'neutral', swatch: '#78716C', desc: 'Fixed, non-varying content' },
  rule:     { label: 'Rule-based', iconKey: 'Database', tone: 'purple',  swatch: '#7C3AED', desc: 'Data block binding with transforms' },
  textgen:  { label: 'Text Gen',   iconKey: 'Type',     tone: 'amber',   swatch: '#D97706', desc: 'LLM-generated copy with constraints' },
  imagegen: { label: 'Image Gen',  iconKey: 'Sparkles', tone: 'rose',    swatch: '#E11D48', desc: 'Model-generated imagery' },
};

window.LayerTypeIcon = ({ type, className = 'w-3 h-3' }) => {
  if (type === 'text' || type === 'textgen') return <L.Type className={className} />;
  if (type === 'image') return <L.ImageIcon className={className} />;
  if (type === 'vector') return <L.Box className={className} />;
  return <L.Circle className={className} />;
};

// ---- KeyCap -------------------------------------------------
window.KeyCap = ({ children }) => (
  <kbd className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-[3px] border border-stone-200 bg-white text-[10px] font-mono text-stone-600 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
    {children}
  </kbd>
);

// ---- TemplatePreview (multi-layout) ------------------------
window.TemplatePreview = ({ selectedId, onSelect, brandId = 'dermdoc', layoutKey = 'benefits', showGrid = false }) => {
  const brand = window.BRANDS.find(b => b.id === brandId) || window.BRANDS[0];
  const p = brand.palette;
  const W = 500, H = 500;
  const isSelected = (id) => selectedId === id;
  const dimOthers = !!selectedId;
  const opacityFor = (id) => dimOthers ? (isSelected(id) ? 1 : 0.32) : 1;
  const sel = (id) => ({
    cursor: onSelect ? 'pointer' : 'default',
    opacity: opacityFor(id),
    transition: 'opacity 180ms ease',
  });
  const ring = (x, y, w, h) => (
    <rect x={x} y={y} width={w} height={h} fill="none" stroke="#5B4FE9" strokeWidth="2.5" strokeDasharray="6 4" rx="2" />
  );

  // Benefits Hero layout (default)
  if (layoutKey === 'benefits' || !layoutKey) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block" preserveAspectRatio="xMidYMid meet">
        {showGrid && (
          <g opacity="0.08">
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={`v${i}`} x1={i * (W/24)} y1="0" x2={i * (W/24)} y2={H} stroke="#000" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * (H/24)} x2={W} y2={i * (H/24)} stroke="#000" strokeWidth="0.5" />
            ))}
          </g>
        )}
        <g onClick={() => onSelect && onSelect('bg_left')} style={sel('bg_left')}>
          <rect x="0" y="0" width={W/2} height={H} fill={p.left} />
          {isSelected('bg_left') && ring(2, 2, W/2 - 4, H - 4)}
        </g>
        <g onClick={() => onSelect && onSelect('bg_right')} style={sel('bg_right')}>
          <rect x={W/2} y="0" width={W/2} height={H} fill={p.right} />
          {isSelected('bg_right') && ring(W/2 + 2, 2, W/2 - 4, H - 4)}
        </g>
        <g onClick={() => onSelect && onSelect('brand_logo')} style={sel('brand_logo')}>
          <text x="28" y="65" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="22" letterSpacing="1">{brand.name}</text>
          {isSelected('brand_logo') && ring(24, 43, 140, 30)}
        </g>
        <g onClick={() => onSelect && onSelect('ing_pill_bg')} style={sel('ing_pill_bg')}>
          <rect x="28" y="85" width="120" height="32" fill={p.ink} rx="2" />
          {isSelected('ing_pill_bg') && ring(26, 83, 124, 36)}
        </g>
        <g onClick={() => onSelect && onSelect('ing_name')} style={sel('ing_name')}>
          <text x="36" y="108" fill={brandId === 'nybae' ? p.ink : '#fff'} fontFamily="Geist" fontWeight="700" fontSize="18" letterSpacing="1">SQUALANE</text>
          {isSelected('ing_name') && ring(34, 93, 108, 22)}
        </g>
        <g onClick={() => onSelect && onSelect('category')} style={sel('category')}>
          <text x="28" y="148" fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="22">body lotion</text>
          {isSelected('category') && ring(24, 128, 150, 28)}
        </g>
        <g onClick={() => onSelect && onSelect('benefit_1_icon')} style={sel('benefit_1_icon')}>
          <circle cx="40" cy="218" r="8" fill="none" stroke={p.ink} strokeWidth="1.5" />
          <path d="M 38 216 Q 40 212 42 216 Q 44 220 40 224 Q 36 220 38 216" fill="none" stroke={p.ink} strokeWidth="1.5" />
          {isSelected('benefit_1_icon') && ring(28, 206, 24, 24)}
        </g>
        <g onClick={() => onSelect && onSelect('benefit_1_text')} style={sel('benefit_1_text')}>
          <text x="58" y="224" fill={p.ink} fontFamily="Geist" fontWeight="500" fontSize="17">Skin Softening</text>
          {isSelected('benefit_1_text') && ring(54, 206, 160, 22)}
        </g>
        <g onClick={() => onSelect && onSelect('benefit_2_icon')} style={sel('benefit_2_icon')}>
          <circle cx="40" cy="258" r="8" fill="none" stroke={p.ink} strokeWidth="1.5" />
          <path d="M 38 256 Q 40 252 42 256 Q 44 260 40 264 Q 36 260 38 256" fill="none" stroke={p.ink} strokeWidth="1.5" />
          {isSelected('benefit_2_icon') && ring(28, 246, 24, 24)}
        </g>
        <g onClick={() => onSelect && onSelect('benefit_2_text')} style={sel('benefit_2_text')}>
          <text x="58" y="264" fill={p.ink} fontFamily="Geist" fontWeight="500" fontSize="17">Locks Hydration</text>
          {isSelected('benefit_2_text') && ring(54, 246, 160, 22)}
        </g>
        <g onClick={() => onSelect && onSelect('hashtag')} style={sel('hashtag')}>
          <text x="28" y="348" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="16">#HydratedSkin</text>
          {isSelected('hashtag') && ring(24, 330, 150, 24)}
        </g>
        <g onClick={() => onSelect && onSelect('cta_bg')} style={sel('cta_bg')}>
          <rect x="28" y="400" width="100" height="36" fill="#FFFFFF" rx="2" />
          {isSelected('cta_bg') && ring(26, 398, 104, 40)}
        </g>
        <g onClick={() => onSelect && onSelect('cta_text')} style={sel('cta_text')}>
          <text x="48" y="424" fill={p.ink} fontFamily="Geist" fontWeight="600" fontSize="13" letterSpacing="1">BUY NOW</text>
          {isSelected('cta_text') && ring(44, 408, 72, 22)}
        </g>
        <g onClick={() => onSelect && onSelect('hero_product')} style={sel('hero_product')}>
          <rect x="320" y="160" width="100" height="180" fill="#FFFFFF" rx="4" />
          <rect x="340" y="140" width="60" height="28" fill="#FFFFFF" rx="2" />
          <rect x="330" y="205" width="80" height="40" fill={p.accent} opacity="0.15" />
          <text x="370" y="228" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="10" textAnchor="middle">{brand.name}</text>
          <text x="370" y="256" fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="8" textAnchor="middle">SQUALANE</text>
          <text x="370" y="270" fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="8" textAnchor="middle">BODY LOTION</text>
          {isSelected('hero_product') && ring(316, 136, 108, 208)}
        </g>
        <g onClick={() => onSelect && onSelect('decor_1')} style={sel('decor_1')}>
          <circle cx="300" cy="400" r="14" fill="#FFFFFF" opacity="0.7" />
          <circle cx="455" cy="380" r="9" fill="#FFFFFF" opacity="0.5" />
          <circle cx="410" cy="430" r="18" fill="#FFFFFF" opacity="0.6" />
          {isSelected('decor_1') && ring(282, 360, 190, 95)}
        </g>
      </svg>
    );
  }

  // Rich Pack Shot — full-bleed product
  if (layoutKey === 'pack') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block">
        <rect x="0" y="0" width={W} height={H} fill={p.left} />
        <text x={W/2} y="72" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="18" letterSpacing="2" textAnchor="middle">{brand.name}</text>
        <rect x={W/2 - 60} y="140" width="120" height="220" fill="#FFFFFF" rx="4" />
        <rect x={W/2 - 40} y="118" width="80" height="28" fill="#FFFFFF" rx="2" />
        <text x={W/2} y="240" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="11" textAnchor="middle">{brand.name}</text>
        <text x={W/2} y="270" fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="9" textAnchor="middle">SQUALANE</text>
        <text x={W/2} y="284" fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="9" textAnchor="middle">BODY LOTION</text>
        <text x={W/2} y="420" fill={p.ink} fontFamily="Geist" fontWeight="600" fontSize="14" textAnchor="middle" letterSpacing="1">SHOP NOW →</text>
      </svg>
    );
  }

  // Before / After — split vertical
  if (layoutKey === 'beforeafter') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block">
        <rect x="0" y="0" width={W/2} height={H} fill="#D9CEB8" />
        <rect x={W/2} y="0" width={W/2} height={H} fill={p.right} />
        <text x={W/4} y="50" fill={p.ink} fontFamily="Geist" fontWeight="500" fontSize="14" letterSpacing="3" textAnchor="middle">BEFORE</text>
        <text x={W/2 + W/4} y="50" fill={p.ink} fontFamily="Geist" fontWeight="500" fontSize="14" letterSpacing="3" textAnchor="middle">AFTER</text>
        <circle cx={W/4} cy={H/2 + 20} r="70" fill="#C4B59A" />
        <circle cx={W/2 + W/4} cy={H/2 + 20} r="70" fill={p.accent} opacity="0.35" />
        <text x={W/2} y={H - 50} fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="16" textAnchor="middle" letterSpacing="1">4 WEEKS</text>
      </svg>
    );
  }

  // Hero Ingredients
  if (layoutKey === 'ingredients') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block">
        <rect x="0" y="0" width={W} height={H} fill={p.right} />
        <text x="32" y="58" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="20" letterSpacing="1">{brand.name}</text>
        <text x="32" y="110" fill={p.ink} fontFamily="Fraunces" fontWeight="500" fontSize="48">Squalane</text>
        <text x="32" y="145" fill={p.ink} fontFamily="Fraunces" fontWeight="400" fontSize="22" fontStyle="italic">from olives.</text>
        <circle cx="140" cy="340" r="70" fill={p.left} opacity="0.9" />
        <circle cx="260" cy="380" r="45" fill={p.accent} opacity="0.4" />
        <rect x="320" y="160" width="140" height="280" fill="#FFFFFF" rx="8" />
        <text x="32" y={H - 40} fill={p.ink} fontFamily="Geist" fontWeight="600" fontSize="12" letterSpacing="2">EXPLORE THE RANGE</text>
      </svg>
    );
  }

  // Texture / Routine fallback
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block">
      <rect x="0" y="0" width={W} height={H} fill={p.left} />
      <rect x="60" y="60" width={W - 120} height={H - 120} fill={p.right} opacity="0.5" />
      <text x={W/2} y={H/2} fill={p.ink} fontFamily="Fraunces" fontWeight="500" fontSize="36" textAnchor="middle">{layoutKey}</text>
      <text x={W/2} y={H/2 + 36} fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="12" textAnchor="middle" opacity="0.6">{brand.name} · placeholder layout</text>
    </svg>
  );
};

// ---- Strategy dot ------------------------------------------
window.StrategyDot = ({ strategy, className = '' }) => {
  const meta = window.STRATEGY_META[strategy];
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${className}`} style={{ backgroundColor: meta.swatch }} />;
};

// ---- Section header for a run row -------------------------
window.SectionLabel = ({ children, right }) => (
  <div className="flex items-end justify-between mb-3">
    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-400">{children}</div>
    {right}
  </div>
);
