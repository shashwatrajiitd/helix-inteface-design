// ============================================================
// LAYER CONFIGURATOR
// ============================================================
const L = window.LucideIcons;

window.LayerConfigurator = ({ onNext, onBack, stepper }) => {
  const [selected, setSelected] = React.useState('hero_product');
  const [layers, setLayers] = React.useState(window.DETECTED_LAYERS);
  const [brand, setBrand] = React.useState('dermdoc');
  const updateLayer = (id, patch) => setLayers(layers.map(l => l.id === id ? { ...l, ...patch } : l));
  const current = layers.find(l => l.id === selected);
  const counts = layers.reduce((acc, l) => { acc[l.strategy] = (acc[l.strategy] || 0) + 1; return acc; }, {});

  return (
    <div className="flex h-full">
      <div className="w-[260px] border-r border-stone-200 bg-stone-50/40 flex flex-col">
        <div className="p-4 border-b border-stone-200">
          {stepper && <div className="mb-3 scale-[0.88] origin-left">{stepper}</div>}
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1">Detected slots</div>
          <div className="flex items-baseline justify-between">
            <div className="font-display text-[20px] font-medium text-stone-900 tracking-[-0.01em]">{layers.length} slots</div>
            <button className="text-[10.5px] text-violet-700 hover:text-violet-900 font-medium flex items-center gap-1"><L.Bot className="w-3 h-3" /> Auto-fill</button>
          </div>
          <div className="mt-2.5 flex items-center gap-1 flex-wrap">
            {Object.entries(window.STRATEGY_META).map(([k, m]) => {
              const Icon = L[m.iconKey];
              return <window.Pill key={k} tone={m.tone}><Icon className="w-2.5 h-2.5" /> {counts[k] || 0}</window.Pill>;
            })}
          </div>
        </div>
        <div className="flex-1 overflow-auto py-1">
          {layers.map(l => {
            const meta = window.STRATEGY_META[l.strategy];
            const Icon = L[meta.iconKey];
            const isSel = l.id === selected;
            return (
              <button key={l.id} onClick={() => setSelected(l.id)} className={`w-full flex items-center gap-2 px-4 py-1.5 text-left ${isSel ? 'bg-white border-l-2 border-stone-900' : 'hover:bg-white/70 border-l-2 border-transparent'}`}>
                <window.LayerTypeIcon type={l.type} className="w-2.5 h-2.5 text-stone-400 flex-shrink-0" />
                <span className={`flex-1 text-[11.5px] font-mono truncate ${isSel ? 'text-stone-900' : 'text-stone-600'}`}>{l.name}</span>
                <Icon className="w-2.5 h-2.5" style={{ color: meta.swatch }} />
              </button>
            );
          })}
        </div>
        <div className="p-3 border-t border-stone-200 flex items-center justify-between">
          <button onClick={onBack} className="text-[11.5px] text-stone-500 hover:text-stone-900 flex items-center gap-1"><L.ArrowLeft className="w-3 h-3" /> Back</button>
          <button onClick={onNext} className="px-3 h-7 rounded-md bg-stone-900 text-white text-[11.5px] font-medium hover:bg-stone-800">Review <L.ArrowRight className="w-3 h-3 inline" /></button>
        </div>
      </div>

      <div className="flex-1 bg-stone-100 flex flex-col">
        <div className="px-5 py-2.5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="text-[10.5px] font-mono text-stone-500">benefits_hero_v3.psd · 1080×1080</div>
          <div className="flex items-center gap-1">
            {window.BRANDS.slice(0, 3).map(b => (
              <button key={b.id} onClick={() => setBrand(b.id)} className={`px-2.5 h-6 rounded text-[10.5px] ${brand === b.id ? 'bg-stone-900 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}>{b.name}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)]" style={{ width: 420, height: 420 }}>
            <window.TemplatePreview selectedId={selected} onSelect={setSelected} brandId={brand} />
          </div>
        </div>
        <div className="px-5 py-2.5 bg-white border-t border-stone-200 text-[10.5px] text-stone-500 flex items-center justify-between">
          <div>Click any region to configure · <window.KeyCap>⌥</window.KeyCap> <window.KeyCap>D</window.KeyCap> dry-run</div>
          <div>Est. ~6s · ₹2.40/variant</div>
        </div>
      </div>

      <div className="w-[380px] border-l border-stone-200 bg-white flex flex-col">
        {current && (
          <>
            <div className="p-5 border-b border-stone-200">
              <div className="flex items-center gap-2 mb-2"><window.LayerTypeIcon type={current.type} className="w-2.5 h-2.5 text-stone-500" /><span className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500">{current.type} layer</span></div>
              <div className="font-display text-[19px] font-medium text-stone-900 tracking-[-0.01em] mb-1">{current.name}</div>
              <div className="text-[10.5px] font-mono text-stone-400">zone · x{current.zone.x}% y{current.zone.y}% · {current.zone.w}×{current.zone.h}</div>
            </div>

            <div className="p-5 border-b border-stone-200">
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-2.5">Fill strategy</div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(window.STRATEGY_META).map(([key, m]) => {
                  const Icon = L[m.iconKey];
                  const active = current.strategy === key;
                  const suggested = current.suggestion === key;
                  return (
                    <button key={key} onClick={() => updateLayer(current.id, { strategy: key })} className={`flex items-center gap-1.5 p-2 rounded-md border transition-all text-left ${active ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}>
                      <Icon className="w-3 h-3" style={{ color: m.swatch }} />
                      <span className="text-[11.5px] font-semibold text-stone-900 flex-1">{m.label}</span>
                      {suggested && !active && <span className="text-[9px] font-mono text-violet-600">suggested</span>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-[10.5px] text-stone-500">{window.STRATEGY_META[current.strategy].desc}</div>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {current.strategy === 'static'   && <StaticConfig layer={current} />}
              {current.strategy === 'rule'     && <RuleConfig layer={current} />}
              {current.strategy === 'textgen'  && <TextGenConfig layer={current} />}
              {current.strategy === 'imagegen' && <ImageGenConfig layer={current} />}
            </div>

            <div className="border-t border-stone-200 p-3 flex items-center justify-between">
              <button className="text-[10.5px] text-stone-500 flex items-center gap-1 hover:text-stone-900"><L.Play className="w-3 h-3" /> Dry-run</button>
              <button className="text-[10.5px] bg-stone-900 text-white px-3 h-7 rounded-md hover:bg-stone-800 flex items-center gap-1"><L.Save className="w-3 h-3" /> Save slot</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const FieldLabel = ({ children }) => <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">{children}</label>;

const StaticConfig = ({ layer }) => (
  <div className="space-y-4">
    <div><FieldLabel>Literal value</FieldLabel><input defaultValue={layer.id === 'cta_text' ? 'BUY NOW' : layer.id === 'cta_bg' ? '#FFFFFF' : ''} className="w-full text-[12.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8 font-mono" /><div className="mt-1 text-[10.5px] text-stone-400">Never varies across runs.</div></div>
  </div>
);

const RuleConfig = ({ layer }) => (
  <div className="space-y-4">
    <div><FieldLabel>Data block</FieldLabel><select className="w-full text-[12.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8">{window.DATA_BLOCKS.map(d => <option key={d.id}>{d.label} ({d.rows})</option>)}</select></div>
    <div>
      <div className="flex items-center justify-between mb-1.5"><FieldLabel>Binding</FieldLabel><button className="text-[9.5px] font-mono text-violet-700 mb-1.5">visual binder</button></div>
      <input defaultValue={layer.id === 'bg_left' ? 'palette_library.primary_light[{brand_id}]' : 'catalog.field[{product_id}]'} className="w-full text-[12px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8 font-mono" />
      <div className="mt-1 flex items-center gap-1 text-[10.5px] text-emerald-700"><L.Check className="w-2.5 h-2.5" /> resolves for DERMDOC · BL_0241</div>
    </div>
    <div><FieldLabel>Transform</FieldLabel><select className="w-full text-[12.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8"><option>none</option><option>uppercase</option><option>truncate(25)</option></select></div>
    <div className="p-3 bg-stone-50 border border-stone-200 rounded-md"><div className="text-[9.5px] font-mono uppercase tracking-wider text-stone-400 mb-1">Preview</div><div className="text-[12.5px] font-mono text-stone-900">{layer.id === 'brand_logo' ? 'DERMDOC' : layer.id === 'ing_name' ? 'SQUALANE' : layer.id === 'category' ? 'body lotion' : layer.id === 'bg_left' ? '#E8DEF8' : '—'}</div></div>
  </div>
);

const TextGenConfig = ({ layer }) => {
  const d = { benefit_1_text: { prompt: 'Rephrase the benefit {benefit_1} as a 2–3 word front-of-pack claim. Keep clinical confidence.', max: 24 }, benefit_2_text: { prompt: 'Rephrase {benefit_2} as a complementary 2–3 word claim.', max: 24 }, hashtag: { prompt: 'Branded hashtag for {brand_name} × {hero_ingredient}. PascalCase.', max: 18 } }[layer.id] || { prompt: '', max: 40 };
  return (
    <div className="space-y-4">
      <div><div className="flex items-center justify-between mb-1.5"><FieldLabel>Prompt template</FieldLabel><button className="text-[9.5px] font-mono text-violet-700 mb-1.5">+ variable</button></div><textarea rows={4} defaultValue={d.prompt} className="w-full text-[12px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 font-mono resize-none" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel>Model</FieldLabel><select className="w-full text-[12.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8"><option>gemini-2.5-flash</option><option>claude-haiku-4.5</option></select></div>
        <div><FieldLabel>Max chars</FieldLabel><input type="number" defaultValue={d.max} className="w-full text-[12.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8 tabular-nums" /></div>
      </div>
      <div><FieldLabel>Tone</FieldLabel><div className="flex gap-1.5 flex-wrap">{['clinical-confident', 'warm', 'playful', 'bold'].map(t => <button key={t} className={`px-2.5 h-6 rounded text-[10.5px] border ${t === 'clinical-confident' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200'}`}>{t}</button>)}</div></div>
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md"><div className="text-[9.5px] font-mono uppercase tracking-wider text-amber-700 mb-1">Dry-run · DERMDOC</div><div className="text-[12.5px] text-stone-900 font-medium">{layer.id === 'benefit_1_text' ? '"Softens Skin"' : layer.id === 'benefit_2_text' ? '"Locks Hydration"' : layer.id === 'hashtag' ? '#HydratedSkin' : '—'}</div><div className="text-[9.5px] text-amber-700 mt-1">~180 tokens · ₹0.04</div></div>
    </div>
  );
};

const ImageGenConfig = ({ layer }) => (
  <div className="space-y-4">
    <div><FieldLabel>Prompt template</FieldLabel><textarea rows={5} defaultValue={`Studio product photograph of {product_name}. {brand_palette_primary} backdrop. Soft key light 45° left. {brand_name} lockup visible. Photoreal, e-commerce quality.`} className="w-full text-[11.5px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 font-mono resize-none" /></div>
    <div><FieldLabel>Reference image</FieldLabel><div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-md"><div className="w-9 h-9 bg-stone-200 rounded flex-shrink-0" /><div className="flex-1 min-w-0"><div className="text-[11.5px] text-stone-800 truncate font-mono">catalog.product_image[{'{product_id}'}]</div><div className="text-[9.5px] text-stone-500">Rule-bound · multimodal</div></div></div></div>
    <div className="grid grid-cols-2 gap-3">
      <div><FieldLabel>Model</FieldLabel><select className="w-full text-[12.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8"><option>imagen-3.0-fast</option><option>imagen-3.0-quality</option><option>nano-banana</option></select></div>
      <div><FieldLabel>Aspect</FieldLabel><input readOnly defaultValue="auto" className="w-full text-[12.5px] bg-stone-100 border border-stone-200 rounded-md px-3 h-8 text-stone-500" /></div>
    </div>
    <div><FieldLabel>Negative prompt</FieldLabel><input defaultValue="text, watermark, distorted packaging, multiple bottles" className="w-full text-[11.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8 font-mono" /></div>
    <div className="p-3 bg-rose-50 border border-rose-200 rounded-md"><div className="text-[9.5px] font-mono uppercase tracking-wider text-rose-700 mb-1">Est. render cost</div><div className="text-[12.5px] text-stone-900 font-medium tabular-nums">₹2.20 · ~4.1s</div></div>
  </div>
);

// ============================================================
// TEMPLATE DETAIL
// ============================================================
window.TemplateDetail = ({ template, onBack, onCreateRun }) => (
  <div className="max-w-[1200px] mx-auto px-6 pt-6 pb-24">
    <div className="grid grid-cols-[1.8fr_1fr] gap-7">
      <div>
        <div className="aspect-square bg-white border border-stone-200 rounded-xl overflow-hidden"><window.TemplatePreview layoutKey={template.layoutKey} /></div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          {template.status === 'active' && <window.Pill tone="green"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active</window.Pill>}
          {template.status === 'draft' && <window.Pill tone="amber">Draft</window.Pill>}
          <window.Pill tone="subtle">{template.aspect}</window.Pill>
        </div>
        <h1 className="font-display text-[30px] font-medium text-stone-900 tracking-[-0.02em] mb-0.5">{template.name}</h1>
        <div className="text-[10.5px] font-mono text-stone-500 mb-5 tracking-wide">{template.code}</div>

        <div className="pb-5 border-b border-stone-200">
          <div className="grid grid-cols-2 gap-y-2.5 text-[11.5px]">
            <div><div className="text-stone-500">Owner</div><div className="text-stone-900 font-medium mt-0.5">{template.owner}</div></div>
            <div><div className="text-stone-500">Last modified</div><div className="text-stone-900 font-medium mt-0.5">{template.updated}</div></div>
            <div><div className="text-stone-500">Slot count</div><div className="text-stone-900 font-medium mt-0.5 tabular-nums">{template.layers}</div></div>
            <div><div className="text-stone-500">Total runs</div><div className="text-stone-900 font-medium mt-0.5 tabular-nums">{template.runs.toLocaleString()}</div></div>
            <div><div className="text-stone-500">Avg CTR</div><div className="text-emerald-700 font-medium mt-0.5 tabular-nums">{template.ctr}</div></div>
            <div><div className="text-stone-500">Cost/variant</div><div className="text-stone-900 font-medium mt-0.5 tabular-nums">₹2.40</div></div>
          </div>
        </div>

        <div className="py-5 border-b border-stone-200">
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-2">Slot breakdown</div>
          <div className="flex h-1.5 rounded-full overflow-hidden bg-stone-100 mb-3">
            <div style={{ width: '13%', backgroundColor: '#78716C' }} />
            <div style={{ width: '60%', backgroundColor: '#7C3AED' }} />
            <div style={{ width: '20%', backgroundColor: '#D97706' }} />
            <div style={{ width: '7%',  backgroundColor: '#E11D48' }} />
          </div>
          <div className="space-y-1 text-[11px]">
            {[['Static', 2, '#78716C'], ['Rule-based', 9, '#7C3AED'], ['Text Gen', 3, '#D97706'], ['Image Gen', 1, '#E11D48']].map(([l, n, c]) => (
              <div key={l} className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} /><span className="text-stone-600 flex-1">{l}</span><span className="font-mono text-stone-900 tabular-nums">{n}</span></div>
            ))}
          </div>
        </div>

        <div className="pt-5 space-y-2">
          <button onClick={onCreateRun} className="w-full h-10 bg-stone-900 text-white rounded-md text-[12.5px] font-medium hover:bg-stone-800 flex items-center justify-center gap-2"><L.Play className="w-3.5 h-3.5" /> Create a run</button>
          <button className="w-full h-10 border border-stone-200 bg-white text-stone-700 rounded-md text-[12.5px] font-medium hover:border-stone-400 flex items-center justify-center gap-2"><L.Edit3 className="w-3.5 h-3.5" /> Edit configuration</button>
        </div>
      </div>
    </div>
  </div>
);
