// ============================================================
// CREATE RUN MODAL — with Variation Axes
// ============================================================
const L = window.LucideIcons;

const AX_BASES = [
  { var: '{campaign_context}', label: 'campaign context', presets: ['Hydration Week', 'Winter Glow', 'Dry Skin Rescue', 'Vitamin Refresh'] },
  { var: '{tone}',              label: 'tone',             presets: ['clinical-confident', 'warm', 'playful', 'bold'] },
  { var: '{season}',            label: 'season',           presets: ['Winter', 'Monsoon', 'Summer', 'Festive'] },
  { var: '{angle}',             label: 'creative angle',   presets: ['benefit-led', 'ingredient-led', 'texture', 'routine', 'comparison'] },
];

window.CreateRunModal = ({ template, onClose, onComplete }) => {
  const [mode, setMode] = React.useState('manual');
  const [products, setProducts] = React.useState(12);
  const [campaign, setCampaign] = React.useState('Hydration Week W17');
  const [approval, setApproval] = React.useState('brand-auto');
  const [axes, setAxes] = React.useState([
    { id: 'ax1', var: '{season}',            mode: 'fix',  fixValue: 'Winter', values: [] },
    { id: 'ax2', var: '{campaign_context}', mode: 'vary', fixValue: '',       values: ['Hydration Week', 'Winter Glow', 'Dry Skin Rescue'] },
    { id: 'ax3', var: '{tone}',              mode: 'vary', fixValue: '',       values: ['clinical-confident', 'warm'] },
  ]);

  const multiplier = axes.filter(a => a.mode === 'vary').reduce((acc, a) => acc * Math.max(1, a.values.length), 1);
  const totalVariants = mode === 'manual' ? products * multiplier : 8;
  const estCost = (totalVariants * 2.4).toFixed(2);
  const estTime = Math.ceil(totalVariants * 6 / 10);

  const updateAxis = (id, patch) => setAxes(axes.map(a => a.id === id ? { ...a, ...patch } : a));
  const removeAxis = (id) => setAxes(axes.filter(a => a.id !== id));
  const addAxis = () => {
    const unused = AX_BASES.find(b => !axes.some(a => a.var === b.var)) || AX_BASES[0];
    setAxes([...axes, { id: `ax${Date.now()}`, var: unused.var, mode: 'vary', fixValue: '', values: [unused.presets[0]] }]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAFAF8] w-full max-w-[1080px] max-h-[92vh] rounded-xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden border border-stone-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-white">
          <div>
            <div className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-stone-400 mb-0.5">New Run · {template.name}</div>
            <div className="font-display text-[17px] font-medium text-stone-900">{template.code}</div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-md text-stone-500"><L.X className="w-4 h-4" /></button>
        </div>

        <div className="px-5 pt-3 border-b border-stone-200 bg-white">
          <div className="flex gap-1">
            {[
              { id: 'manual', label: 'Manual', icon: 'Play', desc: 'Pick products + axes · fire renders' },
              { id: 'scheduled', label: 'Scheduled', icon: 'Calendar', desc: 'Recurring · cron rule' },
              { id: 'agent', label: 'Agent · Ideation', icon: 'Bot', desc: '5 angle variants/SKU · autonomous' },
            ].map(m => {
              const Icon = L[m.icon];
              return (
                <button key={m.id} onClick={() => setMode(m.id)} className={`flex items-center gap-1.5 px-3 h-8 border-b-2 text-[12px] font-medium transition-colors ${mode === m.id ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'}`}>
                  <Icon className="w-3 h-3" />{m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-[1fr_340px] gap-0 h-full">
            <div className="p-6 space-y-5">
              {mode === 'manual' && (
                <>
                  <div className="bg-white border border-stone-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-md bg-stone-900 text-white flex items-center justify-center text-[10px] font-mono font-semibold">1</div>
                      <div className="font-display text-[16px] font-medium text-stone-900">Products</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button className="h-9 rounded-md border border-stone-900 bg-stone-50 text-[11.5px] font-medium text-stone-900 flex flex-col items-start justify-center px-3"><span>From segment</span><span className="text-[9.5px] font-mono text-stone-500">DERMDOC · all SKUs</span></button>
                      <button className="h-9 rounded-md border border-stone-200 bg-white text-[11.5px] text-stone-600 hover:border-stone-400">Upload CSV</button>
                      <button className="h-9 rounded-md border border-stone-200 bg-white text-[11.5px] text-stone-600 hover:border-stone-400">Pick manually</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="range" min="1" max="120" value={products} onChange={(e) => setProducts(Number(e.target.value))} className="flex-1 accent-stone-900" />
                      <div className="text-[12px] font-mono tabular-nums text-stone-900 w-[6ch] text-right">{products} SKUs</div>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-stone-900 text-white flex items-center justify-center text-[10px] font-mono font-semibold">2</div>
                      <div className="font-display text-[16px] font-medium text-stone-900">Run context</div>
                    </div>
                    <p className="text-[11.5px] text-stone-500 mb-3 ml-7">Injected into every prompt and rule binding in this run.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1">Campaign</label>
                        <input value={campaign} onChange={(e) => setCampaign(e.target.value)} className="w-full text-[12.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1">Intent</label>
                        <select className="w-full text-[12.5px] bg-stone-50 border border-stone-200 rounded-md px-3 h-8"><option>Paid acquisition</option><option>CRM</option><option>PDP</option></select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-violet-600 text-white flex items-center justify-center text-[10px] font-mono font-semibold">3</div>
                        <div className="font-display text-[16px] font-medium text-stone-900">Variation axes</div>
                        <window.Pill tone="purple">× {multiplier} variants/SKU</window.Pill>
                      </div>
                      <button onClick={addAxis} className="h-7 px-2 text-[11px] font-medium text-violet-700 hover:bg-violet-50 rounded-md flex items-center gap-1"><L.Plus className="w-3 h-3" /> Add axis</button>
                    </div>
                    <p className="text-[11.5px] text-stone-500 mb-4 ml-7">Define what <em>varies</em> across variants. Fix the rest. Vary-axes cross-multiply.</p>

                    <div className="space-y-2">
                      {axes.map((ax) => {
                        const base = AX_BASES.find(b => b.var === ax.var);
                        return (
                          <div key={ax.id} className="p-3 bg-stone-50/60 border border-stone-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2.5">
                              <select value={ax.var} onChange={(e) => updateAxis(ax.id, { var: e.target.value })} className="text-[11.5px] font-mono bg-white border border-stone-200 rounded px-2 h-7">
                                {AX_BASES.map(b => <option key={b.var} value={b.var}>{b.var}</option>)}
                              </select>
                              <div className="flex items-center bg-white border border-stone-200 rounded p-0.5">
                                <button onClick={() => updateAxis(ax.id, { mode: 'fix' })}  className={`px-2 h-5 rounded text-[10.5px] ${ax.mode === 'fix'  ? 'bg-stone-900 text-white' : 'text-stone-500'}`}>fix</button>
                                <button onClick={() => updateAxis(ax.id, { mode: 'vary' })} className={`px-2 h-5 rounded text-[10.5px] ${ax.mode === 'vary' ? 'bg-violet-600 text-white' : 'text-stone-500'}`}>vary</button>
                              </div>
                              <span className="text-[10.5px] text-stone-500">across</span>
                              {ax.mode === 'fix' ? (
                                <select value={ax.fixValue || base?.presets[0]} onChange={(e) => updateAxis(ax.id, { fixValue: e.target.value })} className="flex-1 text-[11.5px] bg-white border border-stone-200 rounded px-2 h-7">
                                  {base?.presets.map(p => <option key={p}>{p}</option>)}
                                </select>
                              ) : (
                                <span className="flex-1 text-[10.5px] text-stone-500 tabular-nums">{ax.values.length} values · × factor</span>
                              )}
                              <button onClick={() => removeAxis(ax.id)} className="p-1 text-stone-400 hover:text-rose-600"><L.X className="w-3 h-3" /></button>
                            </div>

                            {ax.mode === 'vary' && (
                              <div className="flex flex-wrap gap-1 pl-1">
                                {base?.presets.map(p => {
                                  const on = ax.values.includes(p);
                                  return (
                                    <button key={p} onClick={() => updateAxis(ax.id, { values: on ? ax.values.filter(v => v !== p) : [...ax.values, p] })}
                                      className={`px-2 h-6 rounded text-[10.5px] border transition-colors ${on ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}>
                                      {on && <L.Check className="w-2.5 h-2.5 inline mr-0.5" strokeWidth={3} />}{p}
                                    </button>
                                  );
                                })}
                                <button className="px-2 h-6 rounded text-[10.5px] border border-dashed border-stone-300 text-stone-500 hover:border-stone-500">+ custom</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 bg-violet-50/40 border border-violet-200 rounded-lg flex items-start gap-2.5">
                      <L.Calculator className="w-3.5 h-3.5 text-violet-700 flex-shrink-0 mt-0.5" />
                      <div className="text-[11.5px] text-violet-900 leading-relaxed">
                        <span className="font-mono">{products} SKUs</span> ×{' '}
                        {axes.filter(a => a.mode === 'vary').map((a, i) => <React.Fragment key={a.id}>{i > 0 && ' × '}<span className="font-mono">{a.values.length}</span></React.Fragment>)}
                        {' '}= <span className="font-semibold tabular-nums">{totalVariants.toLocaleString()} variants</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-md bg-stone-900 text-white flex items-center justify-center text-[10px] font-mono font-semibold">4</div>
                      <div className="font-display text-[16px] font-medium text-stone-900">Approval policy</div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { id: 'brand-auto', label: 'Brand auto-approve',        desc: 'All variants go live once rendered. Guardrails still apply.' },
                        { id: 'brand-review', label: 'Brand reviews before publish', desc: 'Rhea P. notified — can bulk-approve.' },
                        { id: 'budget-gate',  label: 'Budget-gated',             desc: 'Runs over ₹500 require sign-off from Marketing Ops.' },
                      ].map(o => (
                        <label key={o.id} className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer transition-colors ${approval === o.id ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}>
                          <input type="radio" checked={approval === o.id} onChange={() => setApproval(o.id)} className="mt-0.5 accent-stone-900" />
                          <div>
                            <div className="text-[12.5px] font-medium text-stone-900">{o.label}</div>
                            <div className="text-[11px] text-stone-500">{o.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {mode === 'scheduled' && (
                <div className="bg-white border border-stone-200 rounded-xl p-6 text-stone-600 text-[13px]">
                  Schedule configuration, cron rule, trigger segment — placeholder.
                </div>
              )}

              {mode === 'agent' && (
                <div className="bg-gradient-to-br from-violet-50/60 to-white border border-violet-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <L.Bot className="w-4 h-4 text-violet-700" />
                    <div className="font-display text-[16px] font-medium text-stone-900">Let Helix ideate</div>
                  </div>
                  <p className="text-[12.5px] text-stone-600 mb-3">Helix will produce 5 angle variants per SKU (benefit-led / ingredient-led / texture / routine / comparison) and self-score them against your top-performing siblings.</p>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">Brief</label>
                  <textarea rows={3} defaultValue="DERMDOC hydration range, 8 SKUs, Winter push. Clinical-confident but warm. Penalise anything that reads as generic 'skincare'." className="w-full text-[12.5px] bg-white border border-stone-200 rounded-md p-3 resize-none mb-3" />
                </div>
              )}
            </div>

            <div className="bg-white border-l border-stone-200 p-5 overflow-auto">
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-3">Run summary</div>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between items-baseline"><span className="text-[11.5px] text-stone-500">Template</span><span className="text-[11.5px] font-medium text-stone-900 text-right">{template.name}<br/><span className="text-[9.5px] font-mono text-stone-400">{template.code}</span></span></div>
                <div className="flex justify-between items-center"><span className="text-[11.5px] text-stone-500">Products</span><span className="text-[12px] font-medium text-stone-900 tabular-nums">{products}</span></div>
                <div className="flex justify-between items-center"><span className="text-[11.5px] text-stone-500">Vary factor</span><span className="text-[12px] font-medium text-violet-700 tabular-nums">× {multiplier}</span></div>
                <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline">
                  <span className="text-[11.5px] text-stone-500">Total variants</span>
                  <span className="font-display text-[28px] font-medium text-stone-900 tabular-nums leading-none">{totalVariants.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2.5 pb-5 border-b border-stone-100">
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500">Cost breakdown</div>
                <div className="flex justify-between text-[11.5px]"><span className="text-stone-500">Image Gen · {totalVariants}</span><span className="font-mono text-stone-900 tabular-nums">₹{(totalVariants * 2.2).toFixed(2)}</span></div>
                <div className="flex justify-between text-[11.5px]"><span className="text-stone-500">Text Gen · {totalVariants * 3}</span><span className="font-mono text-stone-900 tabular-nums">₹{(totalVariants * 0.15).toFixed(2)}</span></div>
                <div className="flex justify-between text-[11.5px]"><span className="text-stone-500">Compositing</span><span className="font-mono text-stone-900 tabular-nums">₹{(totalVariants * 0.05).toFixed(2)}</span></div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-[11.5px] text-stone-500">Est. total</span>
                  <span className="font-display text-[20px] font-medium text-stone-900 tabular-nums">₹{estCost}</span>
                </div>
                {Number(estCost) > 500 && (
                  <div className="text-[10.5px] text-amber-700 flex items-start gap-1 mt-1"><L.AlertCircle className="w-2.5 h-2.5 mt-0.5" /> Exceeds ₹500 — sign-off required.</div>
                )}
              </div>

              <div className="pt-5 space-y-1.5 text-[11.5px] text-stone-600">
                <div className="flex justify-between"><span>Est. render time</span><span className="font-mono tabular-nums">~{estTime}m</span></div>
                <div className="flex justify-between"><span>Template version</span><span className="font-mono tabular-nums">v3</span></div>
                <div className="flex justify-between"><span>Output formats</span><span className="font-mono">JPEG, WebP</span></div>
              </div>

              <button onClick={onComplete} className="mt-6 w-full h-10 bg-stone-900 text-white rounded-md text-[12.5px] font-medium hover:bg-stone-800 flex items-center justify-center gap-2">
                <L.Play className="w-3.5 h-3.5" /> Start run · {totalVariants} variants
              </button>
              <button className="mt-1.5 w-full h-8 text-[11.5px] text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1"><L.Eye className="w-3 h-3" /> Dry-run first 3 variants</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
