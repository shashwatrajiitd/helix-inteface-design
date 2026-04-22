// ============================================================
// ADD TEMPLATE WIZARD (with auto-fill-first flow)
// ============================================================
const L = window.LucideIcons;

const WizardStepper = ({ current, steps, onJump }) => (
  <div className="flex items-center gap-1.5">
    {steps.map((s, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <button
            onClick={() => onJump && onJump(i)}
            disabled={!done && !active}
            className={`flex items-center gap-2 group ${done || active ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-semibold transition-all ${done ? 'bg-stone-900 text-white' : active ? 'bg-white border-[1.5px] border-stone-900 text-stone-900' : 'border border-stone-300 text-stone-400'}`}>
              {done ? <L.Check className="w-2.5 h-2.5" strokeWidth={3} /> : i + 1}
            </div>
            <span className={`text-[11.5px] font-medium ${active ? 'text-stone-900' : done ? 'text-stone-600' : 'text-stone-400'}`}>{s}</span>
          </button>
          {i < steps.length - 1 && <div className={`h-px w-6 ${done ? 'bg-stone-900' : 'bg-stone-200'}`} />}
        </React.Fragment>
      );
    })}
  </div>
);

window.AddTemplateWizard = ({ onClose, onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [source, setSource] = React.useState(null);
  const [uploaded, setUploaded] = React.useState(false);
  const [parsing, setParsing] = React.useState(false);
  const steps = ['Source', 'Upload', 'Auto-fill', 'Metadata', 'Configure', 'Review'];

  const startUpload = () => {
    setParsing(true);
    setTimeout(() => { setUploaded(true); setParsing(false); }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAFAF8] w-full max-w-[1100px] h-[90vh] rounded-xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden border border-stone-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-5">
            <div>
              <div className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-stone-400 mb-1">New Template · untitled</div>
              <WizardStepper current={step} steps={steps} onJump={setStep} />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="h-7 px-2.5 rounded-md text-[11.5px] text-stone-600 hover:bg-stone-100">Save draft</button>
            <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-md text-stone-500">
              <L.X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {step === 0 && (
            <div className="max-w-3xl mx-auto px-8 py-12">
              <h2 className="font-display text-[32px] font-medium text-stone-900 tracking-[-0.02em] mb-2">Where is this template coming from?</h2>
              <p className="text-stone-500 text-[14px] mb-9 leading-relaxed">Either route ends up in the same place — you just choose how much creative direction you're handing over.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setSource('upload')} className={`text-left p-6 rounded-xl border transition-all ${source === 'upload' ? 'border-stone-900 bg-white shadow-sm ring-1 ring-stone-900' : 'border-stone-200 bg-white hover:border-stone-400'}`}>
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-4"><L.Upload className="w-4.5 h-4.5 text-stone-700" /></div>
                  <div className="font-display text-[20px] font-medium text-stone-900 tracking-[-0.01em] mb-1">Upload PSD</div>
                  <div className="text-[12.5px] text-stone-500 mb-4 leading-relaxed">Designer-authored artwork. Layer structure and geometry come from you; we detect slots and propose fill logic.</div>
                  <div className="flex flex-wrap gap-1.5"><window.Pill tone="neutral">High layer count</window.Pill><window.Pill tone="neutral">Tight creative control</window.Pill></div>
                </button>
                <button onClick={() => setSource('helix')} className={`text-left p-6 rounded-xl border transition-all ${source === 'helix' ? 'border-stone-900 bg-white shadow-sm ring-1 ring-stone-900' : 'border-stone-200 bg-white hover:border-stone-400'}`}>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-4"><L.Wand2 className="w-4.5 h-4.5 text-violet-700" /></div>
                  <div className="flex items-center gap-2 mb-1"><div className="font-display text-[20px] font-medium text-stone-900 tracking-[-0.01em]">Generate with Helix</div><window.Pill tone="purple">Beta</window.Pill></div>
                  <div className="text-[12.5px] text-stone-500 mb-4 leading-relaxed">Describe the intent — Helix produces a light PSD skeleton optimised for generative fill. Best for high-variance creative.</div>
                  <div className="flex flex-wrap gap-1.5"><window.Pill tone="purple">Light layers</window.Pill><window.Pill tone="purple">GenAI-heavy</window.Pill></div>
                </button>
              </div>
              <div className="mt-8 flex justify-end">
                <button disabled={!source} onClick={() => setStep(1)} className="px-4 h-9 rounded-md bg-stone-900 text-white text-[12.5px] font-medium disabled:opacity-30 hover:bg-stone-800">Continue <L.ArrowRight className="w-3 h-3 inline ml-1" /></button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-3xl mx-auto px-8 py-12">
              <h2 className="font-display text-[32px] font-medium text-stone-900 tracking-[-0.02em] mb-2">{source === 'upload' ? 'Upload your PSD' : 'Describe the template'}</h2>
              <p className="text-stone-500 text-[14px] mb-9">{source === 'upload' ? 'PSD / PSB up to 500 MB. We\'ll parse layers, extract geometry, and propose slot strategies.' : 'Helix will generate a base template optimised for this brief.'}</p>

              {source === 'upload' && (
                <button onClick={startUpload} disabled={parsing || uploaded} className={`w-full rounded-xl border-2 border-dashed p-14 text-center transition-all ${uploaded ? 'border-emerald-400 bg-emerald-50/40' : parsing ? 'border-violet-400 bg-violet-50/30' : 'border-stone-300 bg-white hover:border-stone-500 hover:bg-stone-50/50'}`}>
                  {uploaded ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3"><L.Check className="w-6 h-6 text-emerald-700" /></div>
                      <div className="font-display text-[18px] font-medium text-stone-900 mb-1">benefits_hero_v3.psd</div>
                      <div className="text-[11.5px] font-mono text-stone-500 mb-3">18.4 MB · 1080 × 1080 · 15 layers detected</div>
                      <div className="text-[11.5px] text-emerald-700">Parsed successfully · ingest took 2.1s</div>
                    </>
                  ) : parsing ? (
                    <>
                      <div className="w-12 h-12 rounded-full border-2 border-violet-300 border-t-violet-700 animate-spin mx-auto mb-3" />
                      <div className="font-display text-[18px] font-medium text-stone-900 mb-1">Parsing PSD…</div>
                      <div className="text-[11.5px] font-mono text-stone-500">Extracting layer geometry · running slot inference</div>
                    </>
                  ) : (
                    <>
                      <L.Upload className="w-9 h-9 text-stone-400 mx-auto mb-3" />
                      <div className="font-display text-[18px] font-medium text-stone-900 mb-1">Drop PSD here</div>
                      <div className="text-[12.5px] text-stone-500">or click to browse · max 500 MB</div>
                    </>
                  )}
                </button>
              )}

              {source === 'helix' && (
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                  <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-2">Creative brief</label>
                  <textarea rows={5} className="w-full text-[13px] text-stone-800 bg-stone-50 border border-stone-200 rounded-md p-3 resize-none focus:outline-none focus:border-stone-500" defaultValue={`Benefits-led PDP hero for skincare. Square 1:1. Brand lockup top-left, hero ingredient as pill treatment, 2 benefit lines with icons, subtle brand hashtag, clear BUY NOW CTA. Right half reserved for product pack shot. Tone: clinical-confident.`} />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div><label className="block text-[9.5px] font-mono uppercase tracking-wider text-stone-400 mb-1">Aspect</label><select className="w-full text-[12px] bg-white border border-stone-200 rounded-md px-2 h-8"><option>1:1 (1080×1080)</option><option>4:5 (1080×1350)</option></select></div>
                    <div><label className="block text-[9.5px] font-mono uppercase tracking-wider text-stone-400 mb-1">Layer density</label><select className="w-full text-[12px] bg-white border border-stone-200 rounded-md px-2 h-8" defaultValue="light"><option value="light">Light · GenAI-heavy</option><option>Medium</option><option>Dense · designer-like</option></select></div>
                    <div><label className="block text-[9.5px] font-mono uppercase tracking-wider text-stone-400 mb-1">Reference</label><button className="w-full text-[12px] bg-white border border-stone-200 rounded-md px-2 h-8 text-stone-500">+ Add reference</button></div>
                  </div>
                  <button onClick={startUpload} className="mt-5 w-full h-10 bg-stone-900 text-white rounded-md text-[12.5px] font-medium flex items-center justify-center gap-2 hover:bg-stone-800"><L.Wand2 className="w-3.5 h-3.5" /> Generate template</button>
                  {uploaded && <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-[11.5px] text-emerald-800 flex items-center gap-2"><L.Check className="w-3.5 h-3.5" /> Helix generated 9-layer base template · <span className="font-mono">14.2s</span></div>}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => setStep(0)} className="text-[12.5px] text-stone-500 hover:text-stone-900 flex items-center gap-1"><L.ArrowLeft className="w-3 h-3" /> Back</button>
                <button disabled={!uploaded} onClick={() => setStep(2)} className="px-4 h-9 rounded-md bg-stone-900 text-white text-[12.5px] font-medium disabled:opacity-30 hover:bg-stone-800">Continue <L.ArrowRight className="w-3 h-3 inline ml-1" /></button>
              </div>
            </div>
          )}

          {step === 2 && <window.AutoFillReview onBack={() => setStep(1)} onNext={() => setStep(3)} />}

          {step === 3 && <window.MetadataStep onBack={() => setStep(2)} onNext={() => setStep(4)} />}

          {step === 4 && <window.LayerConfigurator onBack={() => setStep(3)} onNext={() => setStep(5)} stepper={<WizardStepper current={step} steps={steps} onJump={setStep} />} />}

          {step === 5 && <window.ReviewStep onBack={() => setStep(4)} onComplete={onComplete} />}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// AUTO-FILL-FIRST (new headline step)
// ============================================================
window.AutoFillReview = ({ onBack, onNext }) => {
  const [layers, setLayers] = React.useState(() => window.DETECTED_LAYERS.map(l => ({ ...l, accepted: l.confidence >= 0.85 })));
  const accepted = layers.filter(l => l.accepted).length;
  const needsReview = layers.filter(l => !l.accepted).length;
  const lowConfidence = layers.filter(l => l.confidence < 0.85);
  const [selected, setSelected] = React.useState(lowConfidence[0]?.id);

  const toggle = (id) => setLayers(layers.map(l => l.id === id ? { ...l, accepted: !l.accepted } : l));
  const acceptAll = () => setLayers(layers.map(l => ({ ...l, accepted: true })));

  const current = layers.find(l => l.id === selected);

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center"><L.Bot className="w-3.5 h-3.5 text-violet-700" /></div>
            <span className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-violet-700 font-semibold">Helix auto-fill · proposal</span>
          </div>
          <h2 className="font-display text-[30px] font-medium text-stone-900 tracking-[-0.02em] mb-1">We've proposed fill logic for {accepted}/{layers.length} slots.</h2>
          <p className="text-stone-500 text-[13.5px] leading-relaxed max-w-[60ch]">
            {needsReview > 0 ? <>{needsReview} slots need your review — they're below the 85% confidence threshold.</> : <>All slots are high-confidence. You can accept everything and move on.</>}
          </p>
        </div>
        <button onClick={acceptAll} className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-stone-300 bg-white text-[12px] font-medium text-stone-800 hover:border-stone-900">
          <L.CheckCheck className="w-3.5 h-3.5" /> Accept all
        </button>
      </div>

      <div className="mt-6 grid grid-cols-[1.3fr_1fr] gap-6">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500">Detected slots · {layers.length}</div>
            <div className="flex items-center gap-2.5 text-[10.5px] tabular-nums">
              <span className="flex items-center gap-1 text-emerald-700"><L.Check className="w-2.5 h-2.5" />{accepted}</span>
              <span className="flex items-center gap-1 text-amber-700"><L.AlertCircle className="w-2.5 h-2.5" />{needsReview}</span>
            </div>
          </div>
          <div className="max-h-[440px] overflow-auto">
            {layers.map(l => {
              const meta = window.STRATEGY_META[l.strategy];
              const Icon = L[meta.iconKey];
              const isSel = l.id === selected;
              const lowConf = l.confidence < 0.85;
              return (
                <div key={l.id} onClick={() => setSelected(l.id)} className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-2.5 px-3.5 py-2 cursor-pointer border-l-2 ${isSel ? 'bg-stone-50 border-stone-900' : 'border-transparent hover:bg-stone-50/60'}`}>
                  <button onClick={(e) => { e.stopPropagation(); toggle(l.id); }} className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${l.accepted ? 'bg-stone-900 border-stone-900' : 'bg-white border-stone-300'}`}>
                    {l.accepted && <L.Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </button>
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-mono text-stone-800 truncate">{l.name}</div>
                    <div className="text-[9.5px] text-stone-500 capitalize">{l.type} · {meta.label.toLowerCase()}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="w-3 h-3" style={{ color: meta.swatch }} />
                  </div>
                  <div className={`text-[10px] font-mono tabular-nums ${lowConf ? 'text-amber-700' : 'text-stone-400'}`}>
                    {Math.round(l.confidence * 100)}%
                  </div>
                  <div className="w-10 h-1 rounded-full bg-stone-100 overflow-hidden">
                    <div className={`h-full ${lowConf ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${l.confidence * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-3">Preview · DERMDOC</div>
            <div className="aspect-square bg-stone-50 rounded-lg overflow-hidden"><window.TemplatePreview selectedId={selected} onSelect={setSelected} brandId="dermdoc" /></div>
          </div>
          {current && (
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <window.StrategyDot strategy={current.strategy} />
                  <span className="text-[11px] font-mono text-stone-800">{current.name}</span>
                </div>
                <window.Pill tone={current.confidence >= 0.85 ? 'green' : 'amber'}>{Math.round(current.confidence * 100)}%</window.Pill>
              </div>
              <div className="text-[11.5px] text-stone-600 mb-3 leading-relaxed">
                Helix proposes <span className="font-semibold text-stone-900">{window.STRATEGY_META[current.strategy].label}</span>.{' '}
                {current.strategy === 'rule' && <>Bound to <span className="font-mono text-violet-700">catalog.{current.name.replace('_text', '').replace('_display', '')}</span>.</>}
                {current.strategy === 'textgen' && <>2–3 word LLM claim, tone-constrained.</>}
                {current.strategy === 'imagegen' && <>Imagen-3 product photograph with multimodal reference.</>}
                {current.strategy === 'static' && <>Literal value — will not vary across runs.</>}
              </div>
              <div className="flex items-center gap-1.5">
                <button className="flex-1 h-7 rounded-md border border-stone-200 text-[11px] text-stone-700 hover:border-stone-400">Override strategy</button>
                <button className="flex-1 h-7 rounded-md bg-stone-900 text-white text-[11px] font-medium">Accept</button>
              </div>
            </div>
          )}
          <div className="bg-violet-50/60 border border-violet-200 rounded-xl p-4">
            <div className="flex gap-2.5">
              <L.Info className="w-3.5 h-3.5 text-violet-700 flex-shrink-0 mt-0.5" />
              <div className="text-[11.5px] text-violet-900 leading-relaxed">
                You can always refine slot-by-slot in the full <span className="font-semibold">Layer Configurator</span> (next step). Auto-fill is just a starting point.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="text-[12.5px] text-stone-500 hover:text-stone-900 flex items-center gap-1"><L.ArrowLeft className="w-3 h-3" /> Back</button>
        <div className="flex items-center gap-2">
          <div className="text-[11.5px] text-stone-500">{accepted}/{layers.length} accepted</div>
          <button onClick={onNext} className="px-4 h-9 rounded-md bg-stone-900 text-white text-[12.5px] font-medium hover:bg-stone-800">Continue <L.ArrowRight className="w-3 h-3 inline ml-1" /></button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// METADATA STEP
// ============================================================
window.MetadataStep = ({ onBack, onNext }) => (
  <div className="max-w-3xl mx-auto px-8 py-12">
    <h2 className="font-display text-[30px] font-medium text-stone-900 tracking-[-0.02em] mb-2">Template metadata</h2>
    <p className="text-stone-500 text-[14px] mb-9">This is what makes the template discoverable, governable, and addressable downstream.</p>

    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">Template name</label>
          <input defaultValue="Benefits Hero" className="w-full text-[13px] bg-white border border-stone-200 rounded-md px-3 h-9 focus:outline-none focus:border-stone-900" />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">Auto-generated code <span className="text-stone-400 normal-case tracking-normal">· track-type-aspect-version</span></label>
          <input readOnly value="BRND-BHH-1x1-V1" className="w-full text-[13px] font-mono bg-stone-100 border border-stone-200 rounded-md px-3 h-9 text-stone-600" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">Aspect ratio</label><select className="w-full text-[13px] bg-white border border-stone-200 rounded-md px-3 h-9"><option>1:1 (1080×1080)</option></select></div>
        <div><label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">Brand scope</label><select className="w-full text-[13px] bg-white border border-stone-200 rounded-md px-3 h-9"><option>Universal · all brands</option><option>Brand-specific</option></select></div>
        <div><label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">Owner · Librarian</label><select className="w-full text-[13px] bg-white border border-stone-200 rounded-md px-3 h-9"><option>Rhea P. (Brand Design)</option></select></div>
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">Intended surfaces</label>
        <div className="flex flex-wrap gap-2">
          {['PDP main', 'PDP gallery', 'App home', 'Meta feed', 'Meta story', 'Email hero', 'Push notification'].map((s, i) => (
            <button key={s} className={`px-3 h-7 rounded-md border text-[11.5px] ${i < 2 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-stone-500 mb-1.5">Tags</label>
        <input defaultValue="benefits, hero, ingredient-led" className="w-full text-[13px] bg-white border border-stone-200 rounded-md px-3 h-9" />
        <div className="mt-1.5 text-[10.5px] text-stone-400">Comma-separated · used for discovery</div>
      </div>
    </div>

    <div className="mt-8 flex items-center justify-between">
      <button onClick={onBack} className="text-[12.5px] text-stone-500 hover:text-stone-900 flex items-center gap-1"><L.ArrowLeft className="w-3 h-3" /> Back</button>
      <button onClick={onNext} className="px-4 h-9 rounded-md bg-stone-900 text-white text-[12.5px] font-medium hover:bg-stone-800">Configure layers <L.ArrowRight className="w-3 h-3 inline ml-1" /></button>
    </div>
  </div>
);

// ============================================================
// REVIEW STEP
// ============================================================
window.ReviewStep = ({ onBack, onComplete }) => (
  <div className="max-w-3xl mx-auto px-8 py-12">
    <h2 className="font-display text-[30px] font-medium text-stone-900 tracking-[-0.02em] mb-2">Review & publish</h2>
    <p className="text-stone-500 text-[14px] mb-8">Final check before the template is addressable system-wide.</p>

    <div className="bg-white border border-stone-200 rounded-xl p-6 mb-5">
      <div className="flex gap-6">
        <div className="w-44 h-44 bg-stone-50 rounded-lg border border-stone-200 overflow-hidden flex-shrink-0"><window.TemplatePreview layoutKey="benefits" /></div>
        <div className="flex-1">
          <div className="font-display text-[22px] font-medium text-stone-900 tracking-[-0.01em]">Benefits Hero</div>
          <div className="text-[10.5px] font-mono text-stone-500 mb-4">BRND-BHH-1x1-V1 · Brand Manager · PDP Images</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
            <div className="flex justify-between"><span className="text-stone-500">Aspect</span><span className="font-medium text-stone-900 tabular-nums">1:1 · 1080²</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Slots</span><span className="font-medium text-stone-900 tabular-nums">15</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Static</span><span className="font-medium text-stone-900 tabular-nums">2</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Rule-based</span><span className="font-medium text-stone-900 tabular-nums">9</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Text Gen</span><span className="font-medium text-stone-900 tabular-nums">3</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Image Gen</span><span className="font-medium text-stone-900 tabular-nums">1</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Est. cost/variant</span><span className="font-medium text-stone-900 tabular-nums">₹2.40</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Est. render time</span><span className="font-medium text-stone-900 tabular-nums">~6s</span></div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 mb-5 flex gap-2.5">
      <L.AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
      <div className="text-[12px] text-amber-900"><div className="font-semibold mb-0.5">Needs approval from Brand</div>Template will enter <span className="font-mono">draft</span> status. Rhea P. will be notified. Once approved, it becomes available across all configured surfaces.</div>
    </div>

    <div className="flex items-center justify-between">
      <button onClick={onBack} className="text-[12.5px] text-stone-500 hover:text-stone-900 flex items-center gap-1"><L.ArrowLeft className="w-3 h-3" /> Back</button>
      <div className="flex items-center gap-2">
        <button className="px-4 h-9 rounded-md border border-stone-200 bg-white text-stone-700 text-[12.5px] font-medium hover:border-stone-400">Save as draft</button>
        <button onClick={onComplete} className="px-4 h-9 rounded-md bg-stone-900 text-white text-[12.5px] font-medium hover:bg-stone-800">Submit for approval</button>
      </div>
    </div>
  </div>
);
