// ============================================================
// TOP NAV + TRACKS + TEMPLATES LIST
// ============================================================
const L = window.LucideIcons;

window.TopNav = ({ persona, setPersona, panel, setPanel, breadcrumb, onHome }) => {
  const [open, setOpen] = React.useState(false);
  const activePersona = window.PERSONAS.find(p => p.id === persona);
  const ActiveIcon = L[activePersona.iconKey];

  return (
    <div className="sticky top-0 z-40 bg-[#FAFAF8]/92 backdrop-blur-md border-b border-stone-200/80">
      <div className="flex items-center justify-between h-[52px] px-5">
        <div className="flex items-center gap-4">
          <button onClick={onHome} className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-[5px] bg-stone-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 via-transparent to-indigo-600/40" />
              <div className="w-2.5 h-2.5 border border-white rounded-full relative" style={{ transform: 'rotate(45deg)' }}>
                <div className="absolute inset-[2px] border-l border-white rounded-full" />
              </div>
            </div>
            <span className="text-[15px] font-semibold text-stone-900 tracking-[-0.01em]">Helix</span>
            <span className="text-[9.5px] font-mono text-stone-400 mt-0.5 ml-0.5 tracking-wider">0.4 · SANDBOX</span>
          </button>

          <div className="h-4 w-px bg-stone-200" />

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 pl-2 pr-2.5 h-7 rounded-md border border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 transition-colors"
            >
              <div className="w-4 h-4 rounded-sm bg-stone-100 flex items-center justify-center">
                <ActiveIcon className="w-2.5 h-2.5 text-stone-700" strokeWidth={2.2} />
              </div>
              <span className="text-[12.5px] font-medium text-stone-900">{activePersona.fullLabel}</span>
              <L.ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 z-50 w-72 bg-white border border-stone-200 rounded-lg shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] py-1 overflow-hidden">
                  <div className="px-3 pt-2.5 pb-1.5 text-[9.5px] font-mono uppercase tracking-[0.16em] text-stone-400">Switch workspace</div>
                  {window.PERSONAS.map(p => {
                    const Icon = L[p.iconKey];
                    return (
                      <button
                        key={p.id}
                        onClick={() => { setPersona(p.id); setOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-stone-50 transition-colors ${p.id === persona ? 'bg-violet-50/40' : ''}`}
                      >
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${p.id === persona ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-[13px] font-medium text-stone-900">{p.fullLabel}</div>
                          <div className="text-[11px] text-stone-500">{p.owner}</div>
                        </div>
                        {p.id === persona && <L.Check className="w-3.5 h-3.5 text-stone-900" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {breadcrumb && breadcrumb.length > 1 && (
            <div className="flex items-center gap-1.5 text-[12px] text-stone-500 pl-1">
              {breadcrumb.slice(1).map((b, i) => (
                <React.Fragment key={i}>
                  <L.ChevronRight className="w-3 h-3 text-stone-300" />
                  <button onClick={b.onClick} className={`hover:text-stone-800 transition-colors ${i === breadcrumb.length - 2 ? 'text-stone-900 font-medium' : ''}`}>
                    {b.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-stone-100 rounded-md p-0.5 mr-1">
            <button
              onClick={() => setPanel('studio')}
              className={`flex items-center gap-1.5 px-2.5 h-6 rounded text-[11.5px] font-medium transition-all ${panel === 'studio' ? 'bg-white text-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)]' : 'text-stone-500 hover:text-stone-800'}`}
            >
              <L.Layers className="w-3 h-3" />
              Template Studio
            </button>
            <button
              onClick={() => setPanel('library')}
              className={`flex items-center gap-1.5 px-2.5 h-6 rounded text-[11.5px] font-medium transition-all ${panel === 'library' ? 'bg-white text-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)]' : 'text-stone-500 hover:text-stone-800'}`}
            >
              <L.FolderOpen className="w-3 h-3" />
              Asset Library
            </button>
          </div>

          <button className="flex items-center gap-1.5 h-7 px-2 rounded-md border border-stone-200 bg-white hover:border-stone-300 text-stone-500 hover:text-stone-800">
            <L.Search className="w-3 h-3" />
            <span className="text-[11px]">Search</span>
            <window.KeyCap>⌘K</window.KeyCap>
          </button>
          <button className="h-7 w-7 rounded-md hover:bg-stone-100 flex items-center justify-center text-stone-500">
            <L.Bell className="w-3.5 h-3.5" />
          </button>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-200 to-rose-300 flex items-center justify-center text-[10.5px] font-semibold text-stone-900 ml-0.5 ring-2 ring-white">
            SK
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TRACKS VIEW
// ============================================================
window.TracksView = ({ persona, onSelectTrack }) => {
  const tracks = window.TRACKS_BY_PERSONA[persona] || [];
  const personaMeta = window.PERSONAS.find(p => p.id === persona);

  return (
    <div className="max-w-[1180px] mx-auto px-6 pt-12 pb-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-stone-400 mb-2.5">
            {personaMeta.owner} · Workspace
          </div>
          <h1 className="font-display text-[46px] font-medium text-stone-900 tracking-[-0.025em] leading-[1.02] mb-2">
            Choose a track.
          </h1>
          <p className="text-[14px] text-stone-600 max-w-xl leading-relaxed">
            Every track has its own templates, fill logic conventions, and downstream consumers.
          </p>
        </div>
        <div className="flex items-center gap-2 pb-2">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">This month</div>
            <div className="text-[15px] font-semibold text-stone-900 mt-0.5">
              {tracks.reduce((acc, t) => acc + (typeof t.runs === 'number' ? t.runs : 0), 0).toLocaleString()} runs
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tracks.map(t => {
          const Icon = L[t.iconKey] || L.Layers;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTrack(t)}
              className="group relative text-left bg-white border border-stone-200 rounded-xl p-6 hover:border-stone-900 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-all duration-150"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-9 h-9 rounded-lg bg-stone-50 border border-stone-200 group-hover:bg-stone-900 group-hover:border-stone-900 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-stone-700 group-hover:text-white transition-colors" strokeWidth={1.8} />
                </div>
                <L.ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="font-display text-[22px] font-medium text-stone-900 tracking-[-0.015em] leading-tight mb-1">
                {t.label}
              </div>
              <div className="text-[13px] text-stone-500 mb-6 leading-snug max-w-[34ch]">
                {t.desc}
              </div>

              <div className="flex items-center gap-5 pt-4 border-t border-stone-100">
                <div>
                  <div className="text-[9.5px] font-mono uppercase tracking-[0.12em] text-stone-400">Templates</div>
                  <div className="text-[14px] font-semibold text-stone-800 mt-0.5 tabular-nums">{t.templates}</div>
                </div>
                <div>
                  <div className="text-[9.5px] font-mono uppercase tracking-[0.12em] text-stone-400">Runs · 30d</div>
                  <div className="text-[14px] font-semibold text-stone-800 mt-0.5 tabular-nums">{typeof t.runs === 'number' ? t.runs.toLocaleString() : t.runs}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// TEMPLATES VIEW
// ============================================================
window.TemplatesView = ({ track, persona, onAddTemplate, onSelectTemplate }) => {
  const templates = (persona === 'brand' && track.id === 'pdp_images') ? window.BRAND_PDP_TEMPLATES : window.BRAND_PDP_TEMPLATES.slice(0, 3);
  const [view, setView] = React.useState('grid');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const shown = templates.filter(t => statusFilter === 'all' || t.status === statusFilter);

  return (
    <div className="max-w-[1280px] mx-auto px-6 pt-7 pb-24">
      <div className="flex items-end justify-between mb-7">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-400 mb-1.5">Track</div>
          <h1 className="font-display text-[30px] font-medium text-stone-900 tracking-[-0.02em] mb-1">{track.label}</h1>
          <p className="text-[13px] text-stone-500">{track.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-stone-200 rounded-md p-0.5">
            {['all', 'active', 'draft', 'deprecated'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 h-6 rounded text-[11px] font-medium capitalize transition-colors ${statusFilter === f ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-white border border-stone-200 rounded-md p-0.5">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-stone-100' : ''}`}>
              <L.Grid3x3 className="w-3 h-3 text-stone-700" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-stone-100' : ''}`}>
              <L.List className="w-3 h-3 text-stone-700" />
            </button>
          </div>
          <button onClick={onAddTemplate} className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-stone-900 text-white text-[11.5px] font-medium hover:bg-stone-800 transition-colors">
            <L.Plus className="w-3 h-3" />
            New Template
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-3 gap-3">
          {shown.map(t => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t)}
              className="group text-left bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-900 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-all duration-150"
            >
              <div className="aspect-square bg-stone-50 border-b border-stone-200 relative overflow-hidden">
                <div className="absolute inset-3">
                  <window.TemplatePreview layoutKey={t.layoutKey} brandId="dermdoc" />
                </div>
                <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                  {t.status === 'active'     && <window.Pill tone="green"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active</window.Pill>}
                  {t.status === 'draft'      && <window.Pill tone="amber">Draft</window.Pill>}
                  {t.status === 'deprecated' && <window.Pill tone="neutral">Deprecated</window.Pill>}
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <window.Pill tone="subtle">{t.aspect}</window.Pill>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="font-display text-[16px] font-medium text-stone-900 tracking-[-0.01em] leading-tight truncate">{t.name}</div>
                </div>
                <div className="text-[9.5px] font-mono text-stone-400 mb-3 tracking-wide truncate">{t.code}</div>
                <div className="flex items-center gap-3 text-[10.5px] text-stone-500 tabular-nums">
                  <span className="flex items-center gap-1"><L.Layers className="w-2.5 h-2.5" />{t.layers}</span>
                  <span className="flex items-center gap-1"><L.Play className="w-2.5 h-2.5" />{t.runs.toLocaleString()}</span>
                  <span className="flex items-center gap-1 ml-auto text-emerald-700"><L.TrendingUp className="w-2.5 h-2.5" />{t.ctr}</span>
                </div>
              </div>
            </button>
          ))}
          <button
            onClick={onAddTemplate}
            className="bg-white/40 border border-dashed border-stone-300 rounded-xl p-10 flex flex-col items-center justify-center gap-2.5 text-stone-500 hover:border-stone-900 hover:text-stone-900 hover:bg-white transition-all min-h-[360px]"
          >
            <div className="w-9 h-9 rounded-full border border-current flex items-center justify-center">
              <L.Plus className="w-4 h-4" />
            </div>
            <div className="font-display text-[16px] font-medium">New Template</div>
            <div className="text-[11px] text-center max-w-[180px] text-stone-400">Upload a PSD or generate with Helix</div>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_0.7fr_0.7fr_0.7fr_0.7fr_0.5fr] px-4 py-2.5 border-b border-stone-200 bg-stone-50/50 text-[9.5px] font-mono uppercase tracking-wider text-stone-500">
            <div>Template</div><div>Code</div><div className="text-right">Slots</div><div className="text-right">Runs</div><div className="text-right">CTR</div><div className="text-right">Updated</div><div></div>
          </div>
          {shown.map(t => (
            <button key={t.id} onClick={() => onSelectTemplate(t)} className="grid grid-cols-[2fr_1fr_0.7fr_0.7fr_0.7fr_0.7fr_0.5fr] items-center px-4 py-2.5 border-b border-stone-100 last:border-b-0 hover:bg-stone-50/60 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-stone-100 overflow-hidden flex-shrink-0"><window.TemplatePreview layoutKey={t.layoutKey} /></div>
                <div>
                  <div className="text-[13px] font-medium text-stone-900">{t.name}</div>
                  <div className="text-[10.5px] text-stone-500 capitalize">{t.status} · {t.owner}</div>
                </div>
              </div>
              <div className="text-[10.5px] font-mono text-stone-500">{t.code}</div>
              <div className="text-[12px] text-stone-900 tabular-nums text-right">{t.layers}</div>
              <div className="text-[12px] text-stone-900 tabular-nums text-right">{t.runs.toLocaleString()}</div>
              <div className="text-[12px] text-emerald-700 tabular-nums text-right">{t.ctr}</div>
              <div className="text-[11px] text-stone-500 text-right">{t.updated}</div>
              <div className="text-right"><L.ChevronRight className="w-3.5 h-3.5 text-stone-300 inline" /></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
