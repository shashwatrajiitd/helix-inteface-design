// ============================================================
// ASSET LIBRARY — with Runs tab, lineage, multi-select
// ============================================================
const L = window.LucideIcons;

window.AssetCard = ({ asset, onOpen, selected, onSelect }) => {
  const brand = window.BRANDS.find(b => b.id === asset.brandId) || window.BRANDS[0];
  const run = window.RUNS.find(r => r.id === asset.runId);
  const runCtr = run?.ctrMedian || '—';
  const underperforms = asset.ctr !== '—' && run && parseFloat(asset.ctr) < parseFloat(run.ctrMedian) - 0.8;

  return (
    <div className={`group relative bg-white border rounded-xl overflow-hidden hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-all ${selected ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'}`}>
      <button onClick={(e) => { e.stopPropagation(); onSelect(); }} className={`absolute top-2.5 left-2.5 z-10 w-5 h-5 rounded border flex items-center justify-center transition-all ${selected ? 'bg-stone-900 border-stone-900 opacity-100' : 'bg-white/90 border-stone-300 opacity-0 group-hover:opacity-100'}`}>
        {selected && <L.Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>
      <button onClick={onOpen} className="w-full text-left">
        <div className="aspect-square bg-stone-50 border-b border-stone-200 relative">
          <window.TemplatePreview brandId={asset.brandId} />
          <div className="absolute top-2.5 right-2.5">
            {asset.status === 'approved' && <window.Pill tone="green"><L.Check className="w-2.5 h-2.5" />Approved</window.Pill>}
            {asset.status === 'review'   && <window.Pill tone="amber"><L.Clock className="w-2.5 h-2.5" />Review</window.Pill>}
            {asset.status === 'flagged'  && <window.Pill tone="rose"><L.Flag className="w-2.5 h-2.5" />Flagged</window.Pill>}
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-[12.5px] font-medium text-stone-900 truncate pr-2">{asset.product}</div>
            <div className="text-[10px] font-mono text-stone-400">{asset.sku}</div>
          </div>
          <div className="text-[10.5px] font-mono text-stone-500 mb-2.5">{asset.brand} · {asset.code}</div>
          <div className="flex items-center gap-2.5 text-[10.5px] tabular-nums">
            <span className={`flex items-center gap-1 ${underperforms ? 'text-rose-700' : 'text-emerald-700'}`}>
              <L.TrendingUp className="w-2.5 h-2.5" />{asset.ctr}
            </span>
            <span className="text-stone-400">vs run {runCtr}</span>
            <span className="text-stone-500 ml-auto">{asset.impressions > 0 ? (asset.impressions / 1000).toFixed(0) + 'k imp' : ''}</span>
          </div>
        </div>
      </button>
    </div>
  );
};

window.AssetLibrary = ({ onOpenDetail }) => {
  const [tab, setTab] = React.useState('assets');
  const [search, setSearch] = React.useState('');
  const [filterBrand, setFilterBrand] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [selected, setSelected] = React.useState([]);
  const [openRun, setOpenRun] = React.useState(null);

  const assets = window.SAMPLE_ASSETS.filter(a => {
    if (filterBrand !== 'all' && a.brandId !== filterBrand) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (search && !`${a.product} ${a.sku} ${a.template}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggle = (id) => setSelected(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);

  return (
    <div className="max-w-[1360px] mx-auto px-6 pt-6 pb-24">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-400 mb-1.5">Output</div>
          <h1 className="font-display text-[34px] font-medium text-stone-900 tracking-[-0.02em] mb-1">Asset Library</h1>
          <p className="text-[13px] text-stone-500">Every variant has a lineage: <span className="font-mono text-stone-700">asset</span> ← <span className="font-mono text-stone-700">run</span> ← <span className="font-mono text-stone-700">template</span>.</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-stone-200 mb-5">
        <div className="flex">
          {[
            { id: 'assets', label: 'Assets', count: window.SAMPLE_ASSETS.length, icon: 'ImageIcon' },
            { id: 'runs',   label: 'Runs',   count: window.RUNS.length,          icon: 'Play' },
          ].map(t => {
            const Icon = L[t.icon];
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3 h-10 border-b-2 text-[12.5px] font-medium transition-colors ${tab === t.id ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                <span className={`text-[10px] font-mono px-1.5 h-4 rounded flex items-center ${tab === t.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}>{t.count}</span>
              </button>
            );
          })}
        </div>
        <div className="text-[10.5px] text-stone-500 pb-2">Monthly spend · <span className="font-mono text-stone-900">₹{(window.RUNS.reduce((a, r) => a + r.cost, 0) / 100).toFixed(2)}k</span> of <span className="font-mono">₹5k</span> budget</div>
      </div>

      {tab === 'assets' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <L.Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by product, SKU, template…" className="w-full h-9 pl-9 pr-3 text-[12.5px] bg-white border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
            </div>
            <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="h-9 px-3 text-[12px] bg-white border border-stone-200 rounded-md">
              <option value="all">All brands</option>
              {window.BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <div className="flex items-center bg-white border border-stone-200 rounded-md p-0.5">
              {['all', 'approved', 'review', 'flagged'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`px-2.5 h-7 rounded text-[11px] font-medium capitalize ${filterStatus === s ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}>{s}</button>
              ))}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="mb-4 bg-stone-900 text-white rounded-lg px-4 py-2.5 flex items-center justify-between">
              <div className="text-[12.5px]"><span className="font-semibold tabular-nums">{selected.length}</span> selected</div>
              <div className="flex items-center gap-1">
                <button className="h-7 px-2.5 rounded text-[11.5px] font-medium bg-white/10 hover:bg-white/20 flex items-center gap-1"><L.Download className="w-3 h-3" /> Export</button>
                <button className="h-7 px-2.5 rounded text-[11.5px] font-medium bg-white/10 hover:bg-white/20 flex items-center gap-1"><L.Wand2 className="w-3 h-3" /> Bulk regenerate</button>
                <button className="h-7 px-2.5 rounded text-[11.5px] font-medium bg-white/10 hover:bg-white/20 flex items-center gap-1"><L.Check className="w-3 h-3" /> Bulk approve</button>
                <button onClick={() => setSelected([])} className="h-7 px-2 rounded text-[11.5px] text-white/60 hover:text-white">Clear</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3">
            {assets.map(a => (
              <window.AssetCard key={a.id} asset={a} onOpen={() => onOpenDetail(a)} selected={selected.includes(a.id)} onSelect={() => toggle(a.id)} />
            ))}
          </div>
        </>
      )}

      {tab === 'runs' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr] px-4 py-2.5 border-b border-stone-200 bg-stone-50/50 text-[9.5px] font-mono uppercase tracking-wider text-stone-500">
            <div>Run</div><div>Template · Version</div><div>Axes</div><div className="text-right">Variants</div><div className="text-right">CTR · median</div><div className="text-right">Cost</div><div className="text-right">Started</div>
          </div>
          {window.RUNS.map(r => (
            <div key={r.id}>
              <button onClick={() => setOpenRun(openRun === r.id ? null : r.id)} className="w-full grid grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr] items-center px-4 py-3 border-b border-stone-100 hover:bg-stone-50/60 text-left transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <L.ChevronRight className={`w-3 h-3 text-stone-400 transition-transform flex-shrink-0 ${openRun === r.id ? 'rotate-90' : ''}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-medium text-stone-900 truncate">{r.name}</span>
                      {r.underperforming && <window.Pill tone="rose">Underperforming</window.Pill>}
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 mt-0.5 truncate">{r.code} · by {r.startedBy}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[11.5px] text-stone-800">{r.template}</div>
                  <div className="text-[10px] font-mono text-stone-500">{r.templateCode} · {r.templateVersion}</div>
                </div>
                <div className="flex flex-wrap gap-1">{r.axes.slice(0, 2).map(a => <span key={a} className="text-[9.5px] font-mono text-[#9B1FA8] bg-[#FAF0FC] px-1.5 h-4 rounded flex items-center">{a}</span>)}{r.axes.length > 2 && <span className="text-[9.5px] font-mono text-stone-500">+{r.axes.length - 2}</span>}</div>
                <div className="text-right text-[12px] font-mono text-stone-900 tabular-nums">{r.variants}</div>
                <div className="text-right">
                  <div className={`text-[12px] font-mono tabular-nums ${parseFloat(r.ctrMedian) < 2.5 ? 'text-rose-700' : 'text-emerald-700'}`}>{r.ctrMedian}</div>
                  <div className="text-[9.5px] font-mono text-stone-400">top {r.ctrTop}</div>
                </div>
                <div className="text-right text-[12px] font-mono text-stone-900 tabular-nums">₹{r.cost.toFixed(2)}</div>
                <div className="text-right text-[11px] text-stone-500">{r.startedAt}</div>
              </button>
              {openRun === r.id && (
                <div className="bg-stone-50/60 border-b border-stone-100 px-8 py-4">
                  <div className="grid grid-cols-[1fr_auto] gap-6">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-2">Variants in this run</div>
                      <div className="grid grid-cols-8 gap-1.5">
                        {window.SAMPLE_ASSETS.filter(a => a.runId === r.id).map(a => (
                          <button key={a.id} onClick={() => onOpenDetail(a)} className="aspect-square bg-white rounded border border-stone-200 hover:border-stone-900 overflow-hidden relative">
                            <window.TemplatePreview brandId={a.brandId} />
                            {a.status === 'flagged' && <div className="absolute inset-0 bg-rose-500/10 border border-rose-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-[11px] text-stone-600 space-y-1 min-w-[180px]">
                      <div className="flex justify-between"><span>Campaign</span><span className="font-medium text-stone-900">{r.campaign}</span></div>
                      <div className="flex justify-between"><span>Approved</span><span className="font-mono tabular-nums">{r.approved}/{r.variants}</span></div>
                      <div className="flex justify-between"><span>In review</span><span className="font-mono tabular-nums">{r.review}</span></div>
                      <div className="flex justify-between"><span>Flagged</span><span className="font-mono tabular-nums">{r.flagged}</span></div>
                      <div className="pt-2 flex gap-1.5">
                        <button className="flex-1 h-7 bg-white border border-stone-200 rounded text-[10.5px] font-medium hover:border-stone-400">Open run</button>
                        <button className="h-7 px-2 bg-white border border-stone-200 rounded text-[10.5px] font-medium hover:border-stone-400"><L.MoreHorizontal className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// ASSET DETAIL DRAWER — with lineage
// ============================================================
window.AssetDetailDrawer = ({ asset, onClose }) => {
  const [refineMode, setRefineMode] = React.useState(null);
  const run = window.RUNS.find(r => r.id === asset.runId);
  const siblingsRun = window.SAMPLE_ASSETS.filter(a => a.runId === asset.runId && a.id !== asset.id);
  const siblingsTemplate = window.SAMPLE_ASSETS.filter(a => a.code === asset.code && a.runId !== asset.runId);

  const underperforms = parseFloat(asset.ctr) < parseFloat(run?.ctrMedian || '3');

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm flex justify-end">
      <div className="bg-[#FAFAF8] w-full max-w-[1180px] h-full shadow-2xl border-l border-stone-200 flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="min-w-0">
              <div className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-stone-400 mb-0.5">Asset · {asset.sku}</div>
              <div className="font-display text-[18px] font-medium text-stone-900 tracking-[-0.01em] truncate">{asset.product}</div>
            </div>
            <div className="h-7 w-px bg-stone-200" />
            <div className="flex items-center gap-1.5">
              {asset.status === 'approved' && <window.Pill tone="green"><L.Check className="w-2.5 h-2.5" />Approved</window.Pill>}
              {asset.status === 'review'   && <window.Pill tone="amber"><L.Clock className="w-2.5 h-2.5" />In review</window.Pill>}
              {asset.status === 'flagged'  && <window.Pill tone="rose"><L.Flag className="w-2.5 h-2.5" />Flagged</window.Pill>}
              <window.Pill tone="subtle">{asset.brand}</window.Pill>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-stone-200 bg-white text-[11.5px] font-medium text-stone-700 hover:border-stone-400"><L.Download className="w-3 h-3" /> Download</button>
            <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-stone-200 bg-white text-[11.5px] font-medium text-stone-700 hover:border-stone-400"><L.Flag className="w-3 h-3" /> Flag</button>
            {asset.status !== 'approved' && <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-stone-900 text-white text-[11.5px] font-medium hover:bg-stone-800"><L.Check className="w-3 h-3" /> Approve</button>}
            <div className="w-px h-4 bg-stone-200 mx-1" />
            <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-md text-stone-500"><L.X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Split body: asset LEFT (sticky) · data RIGHT (scroll) */}
        <div className="flex-1 grid grid-cols-[minmax(0,1fr)_460px] min-h-0">
          {/* LEFT — asset canvas */}
          <div className="bg-stone-100/50 border-r border-stone-200 overflow-auto">
            <div className="min-h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center p-10">
                <div className="w-full max-w-[620px] aspect-square bg-white rounded-xl border border-stone-200 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.2)] overflow-hidden">
                  <window.TemplatePreview brandId={asset.brandId} />
                </div>
              </div>

              {/* Canvas chrome — zoom + asset meta */}
              <div className="px-6 pb-5 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-md p-0.5">
                  <button className="w-7 h-7 rounded hover:bg-stone-100 flex items-center justify-center text-stone-500"><L.ChevronLeft className="w-3.5 h-3.5" /></button>
                  <span className="px-2 text-[11px] font-mono text-stone-600 tabular-nums">variant 3 / {run?.variants || '—'}</span>
                  <button className="w-7 h-7 rounded hover:bg-stone-100 flex items-center justify-center text-stone-500"><L.ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-center gap-3 text-[10.5px] font-mono text-stone-500 tabular-nums">
                  <span>1080 × 1080</span>
                  <span>·</span>
                  <span>JPEG · 184 KB</span>
                  <span>·</span>
                  <span>rendered 2d ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — data panel */}
          <div className="bg-white overflow-auto">
            <div className="p-5 space-y-5">

              {/* Performance */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-2.5">Performance</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                    <div className="text-[9.5px] font-mono uppercase tracking-wider text-stone-400">Variant CTR</div>
                    <div className={`font-display text-[22px] font-medium tabular-nums mt-0.5 leading-none ${underperforms ? 'text-rose-700' : 'text-emerald-700'}`}>{asset.ctr}</div>
                    <div className="text-[10px] text-stone-500 mt-1">{asset.impressions > 0 ? `${asset.impressions.toLocaleString()} imp` : 'no data'}</div>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                    <div className="text-[9.5px] font-mono uppercase tracking-wider text-stone-400">Run median</div>
                    <div className="font-display text-[22px] font-medium text-stone-900 tabular-nums mt-0.5 leading-none">{run?.ctrMedian || '—'}</div>
                    <div className="text-[10px] text-stone-500 mt-1">{run?.variants || 0} siblings</div>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                    <div className="text-[9.5px] font-mono uppercase tracking-wider text-stone-400">Template</div>
                    <div className="font-display text-[22px] font-medium text-stone-900 tabular-nums mt-0.5 leading-none">3.4%</div>
                    <div className="text-[10px] text-stone-500 mt-1">all runs</div>
                  </div>
                </div>
                {underperforms && asset.ctr !== '—' && (
                  <div className="mt-2 flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-md">
                    <L.AlertCircle className="w-3.5 h-3.5 text-rose-700 flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] text-rose-900 leading-relaxed">This variant trails the run median by <span className="font-mono font-semibold tabular-nums">{(parseFloat(run?.ctrMedian || '0') - parseFloat(asset.ctr)).toFixed(1)} pp</span>. Consider regenerating or sending to Helix to re-ideate.</div>
                  </div>
                )}
              </div>

              {/* Lineage */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500">Lineage</div>
                  <div className="text-[10px] font-mono text-stone-400">asset ← run ← template</div>
                </div>
                <div className="bg-stone-50/60 border border-stone-200 rounded-lg p-3.5 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-stone-900 text-white flex items-center justify-center flex-shrink-0"><L.ImageIcon className="w-3.5 h-3.5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-stone-900 font-medium truncate">{asset.product}</div>
                      <div className="text-[10px] font-mono text-stone-500">{asset.id} · this asset</div>
                    </div>
                  </div>
                  <div className="pl-3.5 border-l border-dashed border-stone-300 ml-3.5 space-y-2.5">
                    <div className="flex items-center gap-3 pl-3">
                      <div className="w-7 h-7 rounded bg-white border border-stone-200 flex items-center justify-center flex-shrink-0"><L.Play className="w-3.5 h-3.5 text-stone-700" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-stone-900 font-medium truncate">{run?.name}</div>
                        <div className="text-[10px] font-mono text-stone-500 truncate">{run?.code} · {run?.variants} variants · median {run?.ctrMedian}</div>
                      </div>
                      <button className="text-[10.5px] text-[#9B1FA8] hover:underline flex items-center gap-0.5 flex-shrink-0">Open <L.ArrowUpRight className="w-2.5 h-2.5" /></button>
                    </div>
                    <div className="flex items-center gap-3 pl-3">
                      <div className="w-7 h-7 rounded bg-white border border-stone-200 flex items-center justify-center flex-shrink-0"><L.Layers className="w-3.5 h-3.5 text-stone-700" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-stone-900 font-medium truncate">{asset.template}</div>
                        <div className="text-[10px] font-mono text-stone-500 truncate">{asset.code} · template median 3.4%</div>
                      </div>
                      <button className="text-[10.5px] text-[#9B1FA8] hover:underline flex items-center gap-0.5 flex-shrink-0">Open <L.ArrowUpRight className="w-2.5 h-2.5" /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Context used */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-2.5">Run context applied</div>
                <div className="bg-stone-50/60 border border-stone-200 rounded-lg divide-y divide-stone-200">
                  {[
                    { k: '{brand_id}',          v: asset.brandId,        src: 'run' },
                    { k: '{product_id}',        v: asset.sku,            src: 'run' },
                    { k: '{hero_ingredient}',   v: 'Squalane',           src: 'catalog' },
                    { k: '{season}',            v: 'Winter',             src: 'axis · fix' },
                    { k: '{campaign_context}',  v: run?.campaign || '—', src: 'axis · vary' },
                    { k: '{tone}',              v: 'clinical-confident', src: 'axis · vary' },
                  ].map(r => (
                    <div key={r.k} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2 text-[11px]">
                      <span className="font-mono text-[#9B1FA8]">{r.k}</span>
                      <span className="text-stone-900 font-medium truncate">{r.v}</span>
                      <span className="text-[9.5px] font-mono text-stone-400 uppercase tracking-wider">{r.src}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Siblings */}
              {siblingsRun.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500">Siblings in this run</div>
                    <button className="text-[10.5px] text-[#9B1FA8] hover:underline">View all {siblingsRun.length}</button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {siblingsRun.slice(0, 10).map(s => (
                      <div key={s.id} className="aspect-square bg-stone-50 rounded border border-stone-200 overflow-hidden hover:border-stone-900 cursor-pointer"><window.TemplatePreview brandId={s.brandId} /></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refine */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-2.5">Refine</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'geometry', label: 'Tweak geometry',            desc: 'Nudge size / position',            icon: 'Move' },
                    { id: 'fill',     label: 'Adjust fill',               desc: 'Swap palette or data binding',     icon: 'Paintbrush' },
                    { id: 'regen',    label: 'Regenerate',                desc: 'Re-run gen · new seed',            icon: 'Wand2' },
                    { id: 'ideation', label: 'Re-ideate with Helix',      desc: 'Propose 3 alt angles',             icon: 'Bot' },
                  ].map(m => {
                    const Icon = L[m.icon];
                    const active = refineMode === m.id;
                    return (
                      <button key={m.id} onClick={() => setRefineMode(active ? null : m.id)} className={`text-left p-2.5 rounded-lg border transition-colors ${active ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white hover:border-stone-400'}`}>
                        <Icon className="w-3.5 h-3.5 text-stone-700 mb-1.5" />
                        <div className="text-[12px] font-medium text-stone-900 leading-tight">{m.label}</div>
                        <div className="text-[10.5px] text-stone-500 leading-snug mt-0.5">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
