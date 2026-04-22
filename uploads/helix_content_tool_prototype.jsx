import React, { useState, useMemo } from 'react';
import {
  ChevronDown, ChevronRight, Upload, Wand2, Layers, Sparkles, Database, Type,
  Image as ImageIcon, Lock, ArrowRight, ArrowLeft, Plus, Check, X, Settings,
  Eye, Download, Filter, Search, MoreHorizontal, Play, RefreshCw, Edit3,
  Grid3x3, List, FileText, Package, Palette, Megaphone, ShoppingCart,
  Target, Activity, ThumbsUp, ThumbsDown, MessageSquare, Info, AlertCircle,
  Zap, Bot, SlidersHorizontal, Tag, Clock, TrendingUp, Shuffle, Save,
  FolderOpen, Hash, Box, Cpu, Pencil, Circle
} from 'lucide-react';

// ============================================================
// DATA MODELS
// ============================================================

const PERSONAS = [
  { id: 'brand', label: 'Brand Manager', icon: Palette, owner: 'Brand Teams' },
  { id: 'product', label: 'Product Team', icon: Package, owner: 'Product & Personalisation' },
  { id: 'marketing', label: 'Marketing Team', icon: Megaphone, owner: 'Performance Marketing' },
  { id: 'merch', label: 'Merch Design', icon: ShoppingCart, owner: 'Merchandising Ops' },
];

const TRACKS_BY_PERSONA = {
  brand: [
    { id: 'pdp_images', label: 'PDP Images', desc: 'Product page hero creatives', templates: 12, runs: 4126, icon: ImageIcon },
    { id: 'pdp_aplus', label: 'PDP A+ Content', desc: 'Long-form product storytelling modules', templates: 8, runs: 612, icon: FileText },
    { id: 'product_artwork', label: 'Product Artwork', desc: 'Carton & pack artwork compositions', templates: 6, runs: 184, icon: Palette },
    { id: 'brand_marketing', label: 'Brand Marketing', desc: 'Launches, campaigns, brand statics', templates: 15, runs: 2340, icon: Megaphone },
  ],
  product: [
    { id: 'personalised_collection', label: 'Personalised Collections', desc: '1:1 personalised collection banners at serve time', templates: 7, runs: 1820000, icon: Sparkles },
    { id: 'category_entry', label: 'Category Entry Banners', desc: 'Category landing hero modules', templates: 5, runs: 486 },
    { id: 'cross_sell', label: 'Cross-sell Modules', desc: 'PDP cross-sell + bundle banners', templates: 4, runs: 240 },
    { id: 'segment_banners', label: 'Segment Banners', desc: 'Geo and cohort-specific banners', templates: 9, runs: 612 },
  ],
  marketing: [
    { id: 'meta_statics', label: 'Meta Statics', desc: '1:1 / 4:5 / 9:16 paid social', templates: 18, runs: 8240 },
    { id: 'google_display', label: 'Google Display', desc: 'GDN responsive display creatives', templates: 11, runs: 3120 },
    { id: 'crm_hero', label: 'CRM Hero', desc: 'Email + push campaign statics', templates: 9, runs: 1460 },
    { id: 'affiliate', label: 'Affiliate Creatives', desc: 'Network-specific ad units', templates: 6, runs: 420 },
  ],
  merch: [
    { id: 'sale_calendar', label: 'Sale Calendar Merch', desc: 'Weekly sale banners, homepage modules', templates: 14, runs: 12800 },
    { id: 'offer_banners', label: 'Offer Banners', desc: 'Free gift, combo, flat-off banners', templates: 11, runs: 6820 },
    { id: 'category_merch', label: 'Category Merch', desc: 'Category page promotional banners', templates: 8, runs: 2460 },
    { id: 'flash_sale', label: 'Flash Sale', desc: 'Time-boxed flash creatives', templates: 5, runs: 840 },
  ],
};

const BRAND_PDP_TEMPLATES = [
  { id: 'rich_pack_shot', name: 'Rich Pack Shot', code: 'BRND-RPS-1x1-V2', aspect: '1:1', layers: 7, runs: 842, ctr: '2.4%', updated: '2d ago', owner: 'Rhea P.' },
  { id: 'benefits_hero', name: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', aspect: '1:1', layers: 15, runs: 1204, ctr: '3.1%', updated: '6h ago', owner: 'Rhea P.', active: true },
  { id: 'hero_ingredients', name: 'Hero Ingredients', code: 'BRND-ING-1x1-V1', aspect: '1:1', layers: 11, runs: 486, ctr: '2.8%', updated: '4d ago', owner: 'Arjun M.' },
  { id: 'before_after', name: 'Before / After', code: 'BRND-BAF-1x1-V2', aspect: '1:1', layers: 9, runs: 312, ctr: '3.6%', updated: '1w ago', owner: 'Rhea P.' },
  { id: 'texture_closeup', name: 'Texture Close-up', code: 'BRND-TXT-1x1-V1', aspect: '1:1', layers: 6, runs: 128, ctr: '2.1%', updated: '2w ago', owner: 'Arjun M.' },
  { id: 'routine_regimen', name: 'Routine / Regimen', code: 'BRND-RTN-1x1-V1', aspect: '1:1', layers: 13, runs: 86, ctr: '2.9%', updated: '3w ago', owner: 'Rhea P.' },
];

const DETECTED_LAYERS = [
  { id: 'bg_left',       name: 'bg_left',           type: 'shape',  strategy: 'rule',  suggestion: 'rule',  zone: { x: 0,    y: 0,   w: 50,  h: 100 } },
  { id: 'bg_right',      name: 'bg_right',          type: 'shape',  strategy: 'rule',  suggestion: 'rule',  zone: { x: 50,   y: 0,   w: 50,  h: 100 } },
  { id: 'brand_logo',    name: 'brand_name_text',   type: 'text',   strategy: 'rule',  suggestion: 'rule',  zone: { x: 5,    y: 10,  w: 30,  h: 7  } },
  { id: 'ing_pill_bg',   name: 'ingredient_pill',   type: 'shape',  strategy: 'rule',  suggestion: 'rule',  zone: { x: 5,    y: 20,  w: 28,  h: 8  } },
  { id: 'ing_name',      name: 'ingredient_name',   type: 'text',   strategy: 'rule',  suggestion: 'rule',  zone: { x: 7,    y: 21,  w: 25,  h: 6  } },
  { id: 'category',      name: 'category_display',  type: 'text',   strategy: 'rule',  suggestion: 'rule',  zone: { x: 5,    y: 30,  w: 35,  h: 6  } },
  { id: 'benefit_1_icon',name: 'benefit_icon_1',    type: 'vector', strategy: 'rule',  suggestion: 'rule',  zone: { x: 5,    y: 44,  w: 4,   h: 4  } },
  { id: 'benefit_1_text',name: 'benefit_text_1',    type: 'text',   strategy: 'textgen', suggestion: 'textgen', zone: { x: 11, y: 44, w: 30, h: 5  } },
  { id: 'benefit_2_icon',name: 'benefit_icon_2',    type: 'vector', strategy: 'rule',  suggestion: 'rule',  zone: { x: 5,    y: 52,  w: 4,   h: 4  } },
  { id: 'benefit_2_text',name: 'benefit_text_2',    type: 'text',   strategy: 'textgen', suggestion: 'textgen', zone: { x: 11, y: 52, w: 30, h: 5  } },
  { id: 'hashtag',       name: 'hashtag',           type: 'text',   strategy: 'textgen', suggestion: 'textgen', zone: { x: 5, y: 68, w: 30, h: 5  } },
  { id: 'cta_bg',        name: 'cta_button_bg',     type: 'shape',  strategy: 'static',suggestion: 'static',zone: { x: 5,    y: 80,  w: 22,  h: 8  } },
  { id: 'cta_text',      name: 'cta_text',          type: 'text',   strategy: 'static',suggestion: 'static',zone: { x: 7,    y: 82,  w: 18,  h: 5  } },
  { id: 'hero_product',  name: 'hero_product_image',type: 'image',  strategy: 'imagegen', suggestion: 'imagegen', zone: { x: 55, y: 15, w: 40, h: 70 } },
  { id: 'decor_1',       name: 'decor_particles',   type: 'vector', strategy: 'rule',  suggestion: 'rule',  zone: { x: 58,   y: 70,  w: 35,  h: 20 } },
];

const VARIABLES = [
  { token: '{brand_id}',              source: 'run_context',       example: 'dermdoc' },
  { token: '{brand_name}',            source: 'catalog',           example: 'DERMDOC' },
  { token: '{product_id}',            source: 'run_context',       example: 'BL_0241' },
  { token: '{product_name}',          source: 'catalog',           example: 'Squalane Body Lotion' },
  { token: '{hero_ingredient}',       source: 'catalog',           example: 'Squalane' },
  { token: '{benefit_1}',             source: 'catalog',           example: 'Skin Softening' },
  { token: '{benefit_2}',             source: 'catalog',           example: 'Softens Skin' },
  { token: '{benefit_3}',             source: 'catalog',           example: 'Non-greasy' },
  { token: '{category}',              source: 'catalog',           example: 'Body Lotion' },
  { token: '{brand_palette_primary}', source: 'brand_guidelines',  example: '#B39DDB' },
  { token: '{brand_palette_accent}',  source: 'brand_guidelines',  example: '#1A1A2E' },
  { token: '{campaign_context}',      source: 'run_input',         example: 'Hydration Week' },
  { token: '{season}',                source: 'run_input',         example: 'Winter' },
  { token: '{tone}',                  source: 'run_input',         example: 'clinical-confident' },
];

const SAMPLE_ASSETS = [
  { id: 'a1', product: 'Squalane Body Lotion', brand: 'DERMDOC', template: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.4%', bg: '#E8DEF8', accent: '#6B4EAA' },
  { id: 'a2', product: 'Niacinamide Serum',    brand: 'DERMDOC', template: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '2.9%', bg: '#FFE4E1', accent: '#B5485C' },
  { id: 'a3', product: 'Retinol Night Cream',  brand: 'DERMDOC', template: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', status: 'review',   ctr: '—',     bg: '#1F2235', accent: '#F5E6A8' },
  { id: 'a4', product: 'Rose Glow Mist',       brand: 'GOOD VIBES', template: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '4.1%', bg: '#FFC9D4', accent: '#9B2D4F' },
  { id: 'a5', product: 'Matte Lipstick',       brand: 'NY BAE',    template: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', status: 'flagged',  ctr: '1.2%', bg: '#2A1B3D', accent: '#E8B4B8' },
  { id: 'a6', product: 'Vitamin C Serum',      brand: 'DERMDOC', template: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.2%', bg: '#FFF4D6', accent: '#C8860D' },
  { id: 'a7', product: 'Cica Sunscreen',       brand: 'GOOD VIBES', template: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.8%', bg: '#D9EAD3', accent: '#4A7042' },
  { id: 'a8', product: 'Hibiscus Shampoo',     brand: 'ALPS GOODNESS', template: 'Benefits Hero', code: 'BRND-BHH-1x1-V3', status: 'review', ctr: '—', bg: '#FFE8DE', accent: '#B85450' },
];

const DATA_BLOCKS = [
  { id: 'catalog',          label: 'Product Catalog',          rows: '2.4M',  owner: 'Data Platform' },
  { id: 'brand_guidelines', label: 'Brand Guidelines',         rows: '8',     owner: 'Brand' },
  { id: 'ingredient_lib',   label: 'Ingredient Library',       rows: '340',   owner: 'Content Ops' },
  { id: 'benefit_icons',    label: 'Benefit Icon Map',         rows: '128',   owner: 'Design' },
  { id: 'offer_table',      label: 'Active Offers',            rows: '420',   owner: 'Merch' },
  { id: 'palette_library',  label: 'Palette Library',          rows: '64',    owner: 'Brand' },
];

// ============================================================
// PRIMITIVE UI
// ============================================================

const Pill = ({ children, tone = 'neutral', className = '' }) => {
  const tones = {
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    purple:  'bg-violet-50 text-violet-700 border-violet-200',
    green:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    rose:    'bg-rose-50 text-rose-700 border-rose-200',
    ink:     'bg-stone-900 text-white border-stone-900',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
};

const STRATEGY_META = {
  static:   { label: 'Static',      icon: Lock,       tone: 'neutral', desc: 'Fixed, non-varying content' },
  rule:     { label: 'Rule-based',  icon: Database,   tone: 'purple',  desc: 'Data block binding with transforms' },
  textgen:  { label: 'Text Gen',    icon: Type,       tone: 'amber',   desc: 'LLM-generated copy with constraints' },
  imagegen: { label: 'Image Gen',   icon: Sparkles,   tone: 'rose',    desc: 'Model-generated imagery' },
};

const LayerTypeIcon = ({ type, className = 'w-3.5 h-3.5' }) => {
  if (type === 'text')   return <Type       className={className} />;
  if (type === 'image')  return <ImageIcon  className={className} />;
  if (type === 'vector') return <Box        className={className} />;
  return <Circle className={className} />;
};

// ============================================================
// TEMPLATE PREVIEW SVG (Benefits Hero / Dermdoc mock)
// ============================================================

const TemplatePreview = ({ layers, selectedId, onSelect, product = 'dermdoc', scale = 1 }) => {
  const palettes = {
    dermdoc:   { left: '#E8DEF8', right: '#B39DDB', ink: '#1F1B2E', pill: '#1F1B2E', pillText: '#FFFFFF', accent: '#6B4EAA' },
    goodvibes: { left: '#FFE4E9', right: '#FFC9D4', ink: '#2A1628', pill: '#9B2D4F', pillText: '#FFFFFF', accent: '#9B2D4F' },
    nybae:     { left: '#2A1B3D', right: '#1A0F28', ink: '#F5F1EA', pill: '#E8B4B8', pillText: '#2A1B3D', accent: '#E8B4B8' },
  };
  const p = palettes[product] || palettes.dermdoc;

  const W = 500, H = 500;
  const isSelected = (id) => selectedId === id;
  const dimOthers = !!selectedId;
  const opacityFor = (id) => dimOthers ? (isSelected(id) ? 1 : 0.35) : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" style={{ maxWidth: '100%' }}>
      <defs>
        <linearGradient id="bgL" x1="0" x2="1">
          <stop offset="0%" stopColor={p.left} />
          <stop offset="100%" stopColor={p.left} />
        </linearGradient>
      </defs>

      {/* bg_left */}
      <g onClick={() => onSelect && onSelect('bg_left')} style={{ cursor: 'pointer', opacity: opacityFor('bg_left') }}>
        <rect x="0" y="0" width={W/2} height={H} fill={p.left} />
        {isSelected('bg_left') && <rect x="2" y="2" width={W/2-4} height={H-4} fill="none" stroke="#5B4FE9" strokeWidth="3" strokeDasharray="6 4" />}
      </g>

      {/* bg_right */}
      <g onClick={() => onSelect && onSelect('bg_right')} style={{ cursor: 'pointer', opacity: opacityFor('bg_right') }}>
        <rect x={W/2} y="0" width={W/2} height={H} fill={p.right} />
        {isSelected('bg_right') && <rect x={W/2+2} y="2" width={W/2-4} height={H-4} fill="none" stroke="#5B4FE9" strokeWidth="3" strokeDasharray="6 4" />}
      </g>

      {/* brand_logo text */}
      <g onClick={() => onSelect && onSelect('brand_logo')} style={{ cursor: 'pointer', opacity: opacityFor('brand_logo') }}>
        <text x="28" y="65" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="22" letterSpacing="1">
          {product === 'dermdoc' ? 'DERMDOC' : product === 'goodvibes' ? 'GOOD VIBES' : 'NY BAE'}
        </text>
        {isSelected('brand_logo') && <rect x="24" y="43" width="140" height="30" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>

      {/* ingredient pill */}
      <g onClick={() => onSelect && onSelect('ing_pill_bg')} style={{ cursor: 'pointer', opacity: opacityFor('ing_pill_bg') }}>
        <rect x="28" y="85" width="120" height="32" fill={p.pill} rx="2" />
        {isSelected('ing_pill_bg') && <rect x="26" y="83" width="124" height="36" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>
      <g onClick={() => onSelect && onSelect('ing_name')} style={{ cursor: 'pointer', opacity: opacityFor('ing_name') }}>
        <text x="36" y="108" fill={p.pillText} fontFamily="Geist" fontWeight="700" fontSize="18" letterSpacing="1">SQUALANE</text>
        {isSelected('ing_name') && <rect x="34" y="93" width="108" height="22" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>

      {/* category */}
      <g onClick={() => onSelect && onSelect('category')} style={{ cursor: 'pointer', opacity: opacityFor('category') }}>
        <text x="28" y="148" fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="22">body lotion</text>
        {isSelected('category') && <rect x="24" y="128" width="150" height="28" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>

      {/* benefit 1 icon */}
      <g onClick={() => onSelect && onSelect('benefit_1_icon')} style={{ cursor: 'pointer', opacity: opacityFor('benefit_1_icon') }}>
        <circle cx="40" cy="218" r="8" fill="none" stroke={p.ink} strokeWidth="1.5" />
        <path d="M 38 216 Q 40 212 42 216 Q 44 220 40 224 Q 36 220 38 216" fill="none" stroke={p.ink} strokeWidth="1.5" />
        {isSelected('benefit_1_icon') && <rect x="28" y="206" width="24" height="24" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>
      <g onClick={() => onSelect && onSelect('benefit_1_text')} style={{ cursor: 'pointer', opacity: opacityFor('benefit_1_text') }}>
        <text x="58" y="224" fill={p.ink} fontFamily="Geist" fontWeight="500" fontSize="17">Skin Softening</text>
        {isSelected('benefit_1_text') && <rect x="54" y="206" width="160" height="22" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>

      {/* benefit 2 */}
      <g onClick={() => onSelect && onSelect('benefit_2_icon')} style={{ cursor: 'pointer', opacity: opacityFor('benefit_2_icon') }}>
        <circle cx="40" cy="258" r="8" fill="none" stroke={p.ink} strokeWidth="1.5" />
        <path d="M 38 256 Q 40 252 42 256 Q 44 260 40 264 Q 36 260 38 256" fill="none" stroke={p.ink} strokeWidth="1.5" />
        {isSelected('benefit_2_icon') && <rect x="28" y="246" width="24" height="24" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>
      <g onClick={() => onSelect && onSelect('benefit_2_text')} style={{ cursor: 'pointer', opacity: opacityFor('benefit_2_text') }}>
        <text x="58" y="264" fill={p.ink} fontFamily="Geist" fontWeight="500" fontSize="17">Softens Skin</text>
        {isSelected('benefit_2_text') && <rect x="54" y="246" width="160" height="22" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>

      {/* hashtag */}
      <g onClick={() => onSelect && onSelect('hashtag')} style={{ cursor: 'pointer', opacity: opacityFor('hashtag') }}>
        <text x="28" y="348" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="16">#HydratedSkin</text>
        {isSelected('hashtag') && <rect x="24" y="330" width="150" height="24" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>

      {/* cta */}
      <g onClick={() => onSelect && onSelect('cta_bg')} style={{ cursor: 'pointer', opacity: opacityFor('cta_bg') }}>
        <rect x="28" y="400" width="100" height="36" fill="#FFFFFF" rx="4" />
        {isSelected('cta_bg') && <rect x="26" y="398" width="104" height="40" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>
      <g onClick={() => onSelect && onSelect('cta_text')} style={{ cursor: 'pointer', opacity: opacityFor('cta_text') }}>
        <text x="48" y="424" fill={p.ink} fontFamily="Geist" fontWeight="600" fontSize="13" letterSpacing="1">BUY NOW</text>
        {isSelected('cta_text') && <rect x="44" y="408" width="72" height="22" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>

      {/* hero_product image (mock bottle) */}
      <g onClick={() => onSelect && onSelect('hero_product')} style={{ cursor: 'pointer', opacity: opacityFor('hero_product') }}>
        {/* bottle shape */}
        <rect x="320" y="160" width="100" height="180" fill="#FFFFFF" rx="8" />
        <rect x="340" y="140" width="60" height="30" fill="#FFFFFF" rx="2" />
        <rect x="330" y="205" width="80" height="40" fill={p.accent} opacity="0.15" />
        <text x="360" y="230" fill={p.ink} fontFamily="Geist" fontWeight="700" fontSize="10" textAnchor="middle">{product === 'dermdoc' ? 'DERMDOC' : product === 'goodvibes' ? 'GOOD VIBES' : 'NY BAE'}</text>
        <text x="360" y="258" fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="8" textAnchor="middle">SQUALANE</text>
        <text x="360" y="272" fill={p.ink} fontFamily="Geist" fontWeight="400" fontSize="8" textAnchor="middle">BODY LOTION</text>
        {isSelected('hero_product') && <rect x="316" y="136" width="108" height="208" fill="none" stroke="#5B4FE9" strokeWidth="3" strokeDasharray="6 4" />}
      </g>

      {/* decorative particles */}
      <g onClick={() => onSelect && onSelect('decor_1')} style={{ cursor: 'pointer', opacity: opacityFor('decor_1') }}>
        <circle cx="300" cy="400" r="14" fill="#FFFFFF" opacity="0.7" />
        <circle cx="455" cy="380" r="9" fill="#FFFFFF" opacity="0.5" />
        <circle cx="410" cy="430" r="18" fill="#FFFFFF" opacity="0.6" />
        {isSelected('decor_1') && <rect x="282" y="360" width="190" height="95" fill="none" stroke="#5B4FE9" strokeWidth="2" />}
      </g>
    </svg>
  );
};

// ============================================================
// TOP NAV
// ============================================================

const TopNav = ({ persona, setPersona, panel, setPanel, breadcrumb, onHome }) => {
  const [open, setOpen] = useState(false);
  const activePersona = PERSONAS.find(p => p.id === persona);
  const ActiveIcon = activePersona.icon;

  return (
    <div className="sticky top-0 z-40 bg-[#FAF9F7]/90 backdrop-blur-sm border-b border-stone-200">
      <div className="flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-6">
          <button onClick={onHome} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[17px] font-semibold text-stone-900 tracking-tight">Helix</span>
            <span className="text-[10px] font-mono text-stone-400 mt-1 ml-0.5">v0.4 · sandbox</span>
          </button>

          <div className="h-5 w-px bg-stone-200" />

          {/* Persona dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-stone-200 bg-white hover:border-stone-300 transition-colors"
            >
              <ActiveIcon className="w-4 h-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-800">{activePersona.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-white border border-stone-200 rounded-lg shadow-xl py-1">
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-stone-400">Switch persona</div>
                  {PERSONAS.map(p => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => { setPersona(p.id); setOpen(false); onHome && onHome(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-stone-50 transition-colors ${p.id === persona ? 'bg-violet-50/40' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${p.id === persona ? 'bg-violet-100 text-violet-700' : 'bg-stone-100 text-stone-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium text-stone-900">{p.label}</div>
                          <div className="text-[11px] text-stone-500">{p.owner}</div>
                        </div>
                        {p.id === persona && <Check className="w-4 h-4 text-violet-600" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {breadcrumb && (
            <div className="flex items-center gap-1.5 text-[13px] text-stone-500">
              {breadcrumb.map((b, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="w-3 h-3 text-stone-300" />}
                  <button onClick={b.onClick} className={`hover:text-stone-800 ${i === breadcrumb.length - 1 ? 'text-stone-900 font-medium' : ''}`}>
                    {b.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Panel toggle */}
          <div className="flex items-center bg-stone-100 rounded-md p-0.5">
            <button
              onClick={() => setPanel('studio')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-[12px] font-medium transition-all ${panel === 'studio' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              Template Studio
            </button>
            <button
              onClick={() => setPanel('library')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-[12px] font-medium transition-all ${panel === 'library' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Asset Library
            </button>
          </div>

          <div className="h-5 w-px bg-stone-200 mx-1" />

          <button className="p-1.5 hover:bg-stone-100 rounded-md text-stone-500">
            <Search className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-200 to-rose-300 flex items-center justify-center text-[11px] font-semibold text-stone-800">
            SK
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TRACKS VIEW (landing per persona)
// ============================================================

const TracksView = ({ persona, onSelectTrack }) => {
  const tracks = TRACKS_BY_PERSONA[persona] || [];
  const personaMeta = PERSONAS.find(p => p.id === persona);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-14 pb-20">
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-stone-400 mb-3">
          {personaMeta.owner} · Workspace
        </div>
        <h1 className="font-display text-5xl font-semibold text-stone-900 tracking-tight leading-none mb-3">
          Choose a track.
        </h1>
        <p className="text-[15px] text-stone-600 max-w-xl">
          Every track has its own templates, fill logic conventions, and downstream consumers. Pick the one you're working in.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tracks.map(t => {
          const Icon = t.icon || Layers;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTrack(t)}
              className="group relative text-left bg-white border border-stone-200 rounded-xl p-6 hover:border-stone-900 hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-lg bg-stone-50 border border-stone-200 group-hover:bg-violet-50 group-hover:border-violet-200 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-stone-700 group-hover:text-violet-700 transition-colors" />
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
              </div>

              <div className="font-display text-2xl font-semibold text-stone-900 tracking-tight mb-1">
                {t.label}
              </div>
              <div className="text-[13px] text-stone-500 mb-5 leading-snug">
                {t.desc}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Templates</div>
                  <div className="text-[15px] font-semibold text-stone-800 mt-0.5">{t.templates}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Runs (30d)</div>
                  <div className="text-[15px] font-semibold text-stone-800 mt-0.5">{typeof t.runs === 'number' ? t.runs.toLocaleString() : t.runs}</div>
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
// TEMPLATES LIST (within a track)
// ============================================================

const TemplatesView = ({ track, persona, onAddTemplate, onSelectTemplate }) => {
  const templates = (persona === 'brand' && track.id === 'pdp_images') ? BRAND_PDP_TEMPLATES : BRAND_PDP_TEMPLATES.slice(0, 3);
  const [view, setView] = useState('grid');

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-stone-400 mb-2">
            Track
          </div>
          <h1 className="font-display text-3xl font-semibold text-stone-900 tracking-tight mb-1">
            {track.label}
          </h1>
          <p className="text-[13px] text-stone-500">{track.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 rounded-md p-0.5">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}>
              <Grid3x3 className="w-3.5 h-3.5 text-stone-600" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm' : ''}`}>
              <List className="w-3.5 h-3.5 text-stone-600" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-200 bg-white text-[12px] text-stone-700 hover:border-stone-300">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button
            onClick={onAddTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 text-white text-[12px] font-medium hover:bg-stone-800"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Template
          </button>
        </div>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-3 gap-4' : 'flex flex-col gap-2'}>
        {templates.map(t => (
          view === 'grid' ? (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t)}
              className="group text-left bg-white border border-stone-200 rounded-lg overflow-hidden hover:border-stone-900 hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-stone-50 border-b border-stone-200 relative overflow-hidden">
                <div className="absolute inset-0 scale-90 group-hover:scale-[0.95] transition-transform">
                  <TemplatePreview layers={DETECTED_LAYERS} selectedId={null} />
                </div>
                <div className="absolute top-2 right-2 flex gap-1.5">
                  {t.active && <Pill tone="green"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active</Pill>}
                  <Pill tone="neutral">{t.aspect}</Pill>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-display text-[16px] font-semibold text-stone-900 leading-tight">{t.name}</div>
                </div>
                <div className="text-[10px] font-mono text-stone-400 mb-3">{t.code}</div>
                <div className="flex items-center gap-4 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{t.layers} slots</span>
                  <span className="flex items-center gap-1"><Play className="w-3 h-3" />{t.runs} runs</span>
                  <span className="flex items-center gap-1 ml-auto"><TrendingUp className="w-3 h-3" />{t.ctr}</span>
                </div>
              </div>
            </button>
          ) : (
            <button key={t.id} onClick={() => onSelectTemplate(t)} className="flex items-center gap-4 bg-white border border-stone-200 rounded-lg p-3 hover:border-stone-400">
              <div className="w-14 h-14 bg-stone-100 rounded" />
              <div className="flex-1 text-left">
                <div className="text-[14px] font-semibold text-stone-900">{t.name}</div>
                <div className="text-[10px] font-mono text-stone-400">{t.code}</div>
              </div>
              <div className="text-[11px] text-stone-500">{t.layers} slots · {t.runs} runs</div>
            </button>
          )
        ))}

        {view === 'grid' && (
          <button
            onClick={onAddTemplate}
            className="aspect-auto bg-white/40 border border-dashed border-stone-300 rounded-lg p-10 flex flex-col items-center justify-center gap-3 text-stone-500 hover:border-stone-900 hover:text-stone-900 hover:bg-white transition-all min-h-[380px]"
          >
            <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div className="font-display text-[18px] font-semibold">Add Template</div>
            <div className="text-[11px] text-center max-w-[180px]">Upload a PSD or generate a base template with Helix</div>
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// ADD TEMPLATE WIZARD
// ============================================================

const WizardStepper = ({ current, steps }) => (
  <div className="flex items-center gap-2">
    {steps.map((s, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center gap-2 ${i === current ? 'text-stone-900' : i < current ? 'text-stone-600' : 'text-stone-400'}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold ${i < current ? 'bg-stone-900 text-white' : i === current ? 'border-2 border-stone-900' : 'border border-stone-300'}`}>
            {i < current ? <Check className="w-3 h-3" /> : i + 1}
          </div>
          <span className="text-[12px] font-medium">{s}</span>
        </div>
        {i < steps.length - 1 && <div className={`h-px w-8 ${i < current ? 'bg-stone-900' : 'bg-stone-300'}`} />}
      </React.Fragment>
    ))}
  </div>
);

const AddTemplateWizard = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [source, setSource] = useState(null); // 'upload' | 'helix'
  const [uploaded, setUploaded] = useState(false);
  const [meta, setMeta] = useState({
    name: '',
    aspect: '1:1',
    surface: ['pdp'],
    brandScope: 'universal',
    tags: 'benefits, hero, ingredient-led',
  });
  const steps = ['Source', 'Upload', 'Metadata', 'Configure Layers', 'Review'];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-[#FAF9F7] w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-400 mb-1">New Template</div>
            <WizardStepper current={step} steps={steps} />
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-md text-stone-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          {step === 0 && (
            <div className="max-w-3xl mx-auto px-8 py-12">
              <h2 className="font-display text-3xl font-semibold text-stone-900 tracking-tight mb-2">Where is this template coming from?</h2>
              <p className="text-stone-500 text-[14px] mb-10">Either route ends up in the same place — you just choose how much creative direction you're handing over.</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSource('upload')}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${source === 'upload' ? 'border-stone-900 bg-white' : 'border-stone-200 bg-white/60 hover:border-stone-400'}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-4">
                    <Upload className="w-5 h-5 text-stone-700" />
                  </div>
                  <div className="font-display text-xl font-semibold text-stone-900 mb-1">Upload PSD</div>
                  <div className="text-[13px] text-stone-500 mb-4">Designer-authored artwork. Layer structure and geometry come from you; we detect slots and propose fill logic.</div>
                  <div className="flex flex-wrap gap-1.5">
                    <Pill tone="neutral">High layer count</Pill>
                    <Pill tone="neutral">Tight creative control</Pill>
                  </div>
                </button>

                <button
                  onClick={() => setSource('helix')}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${source === 'helix' ? 'border-stone-900 bg-white' : 'border-stone-200 bg-white/60 hover:border-stone-400'}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-4">
                    <Wand2 className="w-5 h-5 text-violet-700" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-display text-xl font-semibold text-stone-900">Generate with Helix</div>
                    <Pill tone="purple">Beta</Pill>
                  </div>
                  <div className="text-[13px] text-stone-500 mb-4">Describe the intent — Helix produces a light PSD skeleton optimised for generative fill. Best for high-variance creative.</div>
                  <div className="flex flex-wrap gap-1.5">
                    <Pill tone="purple">Light layer count</Pill>
                    <Pill tone="purple">Heavy on GenAI</Pill>
                  </div>
                </button>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  disabled={!source}
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-md bg-stone-900 text-white text-[13px] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-3xl mx-auto px-8 py-12">
              <h2 className="font-display text-3xl font-semibold text-stone-900 tracking-tight mb-2">
                {source === 'upload' ? 'Upload your PSD' : 'Describe the template'}
              </h2>
              <p className="text-stone-500 text-[14px] mb-10">
                {source === 'upload' ? 'PSD / PSB up to 500 MB. We\'ll parse layers, extract geometry, and propose slot strategies.' : 'Helix will generate a base template optimised for this brief.'}
              </p>

              {source === 'upload' && (
                <button
                  onClick={() => setUploaded(true)}
                  className={`w-full rounded-xl border-2 border-dashed p-14 text-center transition-all ${uploaded ? 'border-emerald-500 bg-emerald-50/40' : 'border-stone-300 bg-white/50 hover:border-stone-500 hover:bg-white'}`}
                >
                  {uploaded ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-7 h-7 text-emerald-700" />
                      </div>
                      <div className="font-display text-xl font-semibold text-stone-900 mb-1">benefits_hero_v3.psd</div>
                      <div className="text-[12px] font-mono text-stone-500 mb-4">18.4 MB · 1080 × 1080 · 15 layers detected</div>
                      <div className="text-[12px] text-emerald-700">Parsed successfully · C++ ingest took 2.1s</div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-stone-400 mx-auto mb-4" />
                      <div className="font-display text-xl font-semibold text-stone-900 mb-1">Drop PSD here</div>
                      <div className="text-[13px] text-stone-500">or click to browse · max 500 MB</div>
                    </>
                  )}
                </button>
              )}

              {source === 'helix' && (
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-2">Creative brief</label>
                  <textarea
                    rows={6}
                    className="w-full text-[14px] text-stone-800 bg-stone-50 border border-stone-200 rounded-lg p-3 font-geist resize-none focus:outline-none focus:border-stone-500"
                    defaultValue={`Benefits-led PDP hero for skincare. Square 1:1. Brand lockup top-left, hero ingredient as pill treatment, 2 benefit lines with icons, subtle brand hashtag, clear BUY NOW CTA. Right half reserved for product pack shot with soft ambient decor. Tone: clinical-confident but warm. Light on layers — let generative fill do the context work.`}
                  />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-1">Aspect ratio</label>
                      <select className="w-full text-[12px] bg-white border border-stone-200 rounded-md px-2 py-1.5">
                        <option>1:1 (1080×1080)</option>
                        <option>4:5 (1080×1350)</option>
                        <option>9:16 (1080×1920)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-1">Layer density</label>
                      <select className="w-full text-[12px] bg-white border border-stone-200 rounded-md px-2 py-1.5" defaultValue="light">
                        <option value="light">Light · GenAI-heavy</option>
                        <option value="medium">Medium</option>
                        <option value="dense">Dense · designer-like</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-1">Reference</label>
                      <button className="w-full text-[12px] bg-white border border-stone-200 rounded-md px-2 py-1.5 text-stone-500 hover:text-stone-800">+ Add reference</button>
                    </div>
                  </div>
                  <button onClick={() => setUploaded(true)} className="mt-5 w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md text-[13px] font-medium flex items-center justify-center gap-2">
                    <Wand2 className="w-4 h-4" /> Generate template with Helix
                  </button>
                  {uploaded && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-[12px] text-emerald-800 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" /> Helix generated 9-layer base template · <span className="font-mono">took 14.2s</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => setStep(0)} className="text-[13px] text-stone-500 hover:text-stone-900 flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  disabled={!uploaded}
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-md bg-stone-900 text-white text-[13px] font-medium disabled:opacity-30 hover:bg-stone-800"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl mx-auto px-8 py-12">
              <h2 className="font-display text-3xl font-semibold text-stone-900 tracking-tight mb-2">Template metadata</h2>
              <p className="text-stone-500 text-[14px] mb-10">This is what makes the template discoverable, governable, and addressable downstream.</p>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Template name</label>
                    <input
                      value={meta.name || 'Benefits Hero'}
                      onChange={e => setMeta({ ...meta, name: e.target.value })}
                      className="w-full text-[14px] bg-white border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:border-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Auto-generated code</label>
                    <input readOnly value="BRND-BHH-1x1-V1" className="w-full text-[14px] font-mono bg-stone-100 border border-stone-200 rounded-md px-3 py-2 text-stone-600" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Aspect ratio</label>
                    <select className="w-full text-[14px] bg-white border border-stone-200 rounded-md px-3 py-2">
                      <option>1:1 (1080×1080)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Brand scope</label>
                    <select className="w-full text-[14px] bg-white border border-stone-200 rounded-md px-3 py-2">
                      <option>Universal · all brands</option>
                      <option>Brand-specific</option>
                      <option>Brand-agnostic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Arc Librarian</label>
                    <select className="w-full text-[14px] bg-white border border-stone-200 rounded-md px-3 py-2">
                      <option>Rhea P. (Brand Design)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Intended surfaces</label>
                  <div className="flex flex-wrap gap-2">
                    {['PDP main', 'PDP gallery', 'App home', 'Meta feed', 'Meta story', 'Email hero', 'Push notification'].map((s, i) => (
                      <button key={s} className={`px-3 py-1.5 rounded-md border text-[12px] ${i < 2 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Tags</label>
                  <input
                    value={meta.tags}
                    onChange={e => setMeta({ ...meta, tags: e.target.value })}
                    className="w-full text-[14px] bg-white border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:border-stone-500"
                  />
                  <div className="mt-1.5 text-[11px] text-stone-400">Comma-separated · used for discovery in the Template Library</div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-[13px] text-stone-500 hover:text-stone-900 flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button onClick={() => setStep(3)} className="px-4 py-2 rounded-md bg-stone-900 text-white text-[13px] font-medium hover:bg-stone-800">
                  Configure layers <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && <LayerConfigurator onNext={() => setStep(4)} onBack={() => setStep(2)} />}

          {step === 4 && (
            <div className="max-w-3xl mx-auto px-8 py-12">
              <h2 className="font-display text-3xl font-semibold text-stone-900 tracking-tight mb-2">Review & publish</h2>
              <p className="text-stone-500 text-[14px] mb-8">Final check before the template is addressable system-wide.</p>

              <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
                <div className="flex gap-6">
                  <div className="w-48 h-48 bg-stone-50 rounded-lg border border-stone-200 overflow-hidden flex-shrink-0">
                    <TemplatePreview layers={DETECTED_LAYERS} />
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-2xl font-semibold text-stone-900 tracking-tight">Benefits Hero</div>
                    <div className="text-[11px] font-mono text-stone-500 mb-4">BRND-BHH-1x1-V1 · Brand Manager · PDP Images</div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
                      <div className="flex justify-between"><span className="text-stone-500">Aspect</span><span className="font-medium text-stone-900">1:1 · 1080×1080</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Slots</span><span className="font-medium text-stone-900">15</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Static</span><span className="font-medium text-stone-900">2</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Rule-based</span><span className="font-medium text-stone-900">9</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Text Gen</span><span className="font-medium text-stone-900">3</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Image Gen</span><span className="font-medium text-stone-900">1</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Est. cost/variant</span><span className="font-medium text-stone-900">₹2.40</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Est. render time</span><span className="font-medium text-stone-900">~6s</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-[12px] text-amber-900">
                  <div className="font-semibold mb-0.5">Needs approval from Brand</div>
                  Template will enter <span className="font-mono">draft</span> status. Rhea P. will be notified. Once approved, it becomes available across all configured surfaces.
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => setStep(3)} className="text-[13px] text-stone-500 hover:text-stone-900 flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-md border border-stone-200 bg-white text-stone-700 text-[13px] font-medium hover:border-stone-400">Save as draft</button>
                  <button onClick={onComplete} className="px-4 py-2 rounded-md bg-stone-900 text-white text-[13px] font-medium hover:bg-stone-800">
                    Submit for approval
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LAYER CONFIGURATOR (the core surface)
// ============================================================

const LayerConfigurator = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState('hero_product');
  const [layers, setLayers] = useState(DETECTED_LAYERS);
  const [showVariables, setShowVariables] = useState(true);

  const updateLayer = (id, patch) => {
    setLayers(layers.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  const current = layers.find(l => l.id === selected);

  // Count strategies
  const counts = useMemo(() => layers.reduce((acc, l) => {
    acc[l.strategy] = (acc[l.strategy] || 0) + 1; return acc;
  }, {}), [layers]);

  return (
    <div className="flex h-full">
      {/* Left rail: layer tree */}
      <div className="w-72 border-r border-stone-200 bg-stone-50/50 flex flex-col">
        <div className="p-4 border-b border-stone-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1">Detected Layers</div>
          <div className="flex items-center justify-between">
            <div className="font-display text-xl font-semibold text-stone-900">{layers.length} slots</div>
            <button className="text-[11px] text-violet-700 hover:text-violet-900 font-medium flex items-center gap-1">
              <Bot className="w-3 h-3" /> Auto-fill
            </button>
          </div>
          <div className="mt-3 flex items-center gap-1 flex-wrap">
            <Pill tone="neutral"><Lock className="w-2.5 h-2.5" /> {counts.static || 0}</Pill>
            <Pill tone="purple"><Database className="w-2.5 h-2.5" /> {counts.rule || 0}</Pill>
            <Pill tone="amber"><Type className="w-2.5 h-2.5" /> {counts.textgen || 0}</Pill>
            <Pill tone="rose"><Sparkles className="w-2.5 h-2.5" /> {counts.imagegen || 0}</Pill>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-2">
          {layers.map(l => {
            const meta = STRATEGY_META[l.strategy];
            const Icon = meta.icon;
            const isSel = l.id === selected;
            return (
              <button
                key={l.id}
                onClick={() => setSelected(l.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left group ${isSel ? 'bg-white border-l-2 border-stone-900' : 'hover:bg-white/60 border-l-2 border-transparent'}`}
              >
                <LayerTypeIcon type={l.type} className="w-3 h-3 text-stone-400 flex-shrink-0" />
                <span className={`flex-1 text-[12px] font-mono truncate ${isSel ? 'text-stone-900' : 'text-stone-600'}`}>{l.name}</span>
                <Icon className={`w-3 h-3 ${l.strategy === 'static' ? 'text-stone-500' : l.strategy === 'rule' ? 'text-violet-600' : l.strategy === 'textgen' ? 'text-amber-600' : 'text-rose-600'}`} />
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-stone-200 flex items-center justify-between">
          <button onClick={onBack} className="text-[12px] text-stone-500 hover:text-stone-900 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back
          </button>
          <button onClick={onNext} className="px-3 py-1.5 rounded-md bg-stone-900 text-white text-[12px] font-medium hover:bg-stone-800">
            Review <ArrowRight className="w-3 h-3 inline ml-0.5" />
          </button>
        </div>
      </div>

      {/* Center: preview */}
      <div className="flex-1 bg-stone-100 flex flex-col">
        <div className="px-6 py-3 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[11px] font-mono text-stone-500">benefits_hero_v3.psd · 1080×1080</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700">DERMDOC</button>
            <button className="px-2.5 py-1 rounded text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700">GOOD VIBES</button>
            <button className="px-2.5 py-1 rounded text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700">NY BAE</button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="bg-white shadow-2xl" style={{ width: 440, height: 440 }}>
            <TemplatePreview layers={layers} selectedId={selected} onSelect={setSelected} />
          </div>
        </div>
        <div className="px-6 py-3 bg-white border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
          <div>Click any region to configure its fill logic</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-violet-500" /> selected</span>
            <span>Est. render ~6s · ~₹2.40/variant</span>
          </div>
        </div>
      </div>

      {/* Right: config panel */}
      <div className="w-[420px] border-l border-stone-200 bg-white flex flex-col">
        {current && (
          <>
            <div className="p-5 border-b border-stone-200">
              <div className="flex items-center gap-2 mb-2">
                <LayerTypeIcon type={current.type} className="w-3 h-3 text-stone-500" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">{current.type} layer</span>
              </div>
              <div className="font-display text-xl font-semibold text-stone-900 mb-1">{current.name}</div>
              <div className="text-[11px] font-mono text-stone-400">
                zone: x{current.zone.x}% y{current.zone.y}% · {current.zone.w}×{current.zone.h}
              </div>
            </div>

            <div className="p-5 border-b border-stone-200">
              <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-2.5">Fill strategy</div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(STRATEGY_META).map(([key, m]) => {
                  const Icon = m.icon;
                  const active = current.strategy === key;
                  const suggested = current.suggestion === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateLayer(current.id, { strategy: key })}
                      className={`flex flex-col items-start gap-1 p-2.5 rounded-md border transition-all text-left ${active ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
                    >
                      <div className="flex items-center gap-1.5 w-full">
                        <Icon className={`w-3.5 h-3.5 ${key === 'static' ? 'text-stone-600' : key === 'rule' ? 'text-violet-600' : key === 'textgen' ? 'text-amber-600' : 'text-rose-600'}`} />
                        <span className="text-[12px] font-semibold text-stone-900">{m.label}</span>
                        {suggested && !active && <span className="ml-auto text-[9px] font-mono text-violet-600">suggested</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-[11px] text-stone-500">{STRATEGY_META[current.strategy].desc}</div>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {current.strategy === 'static' && (
                <StaticConfig layer={current} />
              )}
              {current.strategy === 'rule' && (
                <RuleConfig layer={current} />
              )}
              {current.strategy === 'textgen' && (
                <TextGenConfig layer={current} />
              )}
              {current.strategy === 'imagegen' && (
                <ImageGenConfig layer={current} />
              )}
            </div>

            <div className="border-t border-stone-200 p-4 flex items-center justify-between">
              <button className="text-[11px] text-stone-500 flex items-center gap-1 hover:text-stone-900">
                <Play className="w-3 h-3" /> Dry-run preview
              </button>
              <button className="text-[11px] bg-stone-900 text-white px-3 py-1.5 rounded-md hover:bg-stone-800 flex items-center gap-1">
                <Save className="w-3 h-3" /> Save slot
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ---- Strategy-specific config panes ----

const StaticConfig = ({ layer }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Literal value</label>
      <input defaultValue={layer.id === 'cta_text' ? 'BUY NOW' : layer.id === 'cta_bg' ? '#FFFFFF' : ''} className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 font-mono" />
      <div className="mt-1.5 text-[11px] text-stone-400">This value will never vary across runs.</div>
    </div>
  </div>
);

const RuleConfig = ({ layer }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Data block</label>
      <select className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2">
        {DATA_BLOCKS.map(d => <option key={d.id} value={d.id}>{d.label} ({d.rows})</option>)}
      </select>
    </div>
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Field mapping</label>
      <input defaultValue={
        layer.id === 'bg_left' ? 'palette_library.primary_light[{brand_id}]' :
        layer.id === 'bg_right' ? 'palette_library.primary_deep[{brand_id}]' :
        layer.id === 'brand_logo' ? 'catalog.brand_name[{brand_id}]' :
        layer.id === 'ing_name' ? 'catalog.hero_ingredient[{product_id}]' :
        layer.id === 'category' ? 'catalog.category_display[{product_id}]' :
        layer.id === 'benefit_1_icon' ? 'benefit_icons.lookup[{benefit_1}]' :
        'catalog.field'
      } className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 font-mono" />
    </div>
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Transform (optional)</label>
      <select className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2">
        <option>none</option>
        <option>uppercase</option>
        <option>lowercase</option>
        <option>truncate(25)</option>
        <option>format_currency</option>
      </select>
    </div>
    <div className="p-3 bg-stone-50 rounded-md">
      <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-1">Preview with DERMDOC / BL_0241</div>
      <div className="text-[13px] font-mono text-stone-800">
        {layer.id === 'brand_logo' ? 'DERMDOC' :
         layer.id === 'ing_name' ? 'SQUALANE' :
         layer.id === 'category' ? 'body lotion' :
         layer.id === 'bg_left' ? '#E8DEF8' :
         layer.id === 'bg_right' ? '#B39DDB' :
         '—'}
      </div>
    </div>
  </div>
);

const TextGenConfig = ({ layer }) => {
  const defaults = {
    benefit_1_text: { prompt: 'Rephrase the benefit {benefit_1} as a 2–3 word front-of-pack claim. Keep clinical confidence. No adjectives like "amazing".', max: 24, tone: 'clinical-confident' },
    benefit_2_text: { prompt: 'Rephrase {benefit_2} as a complementary 2–3 word claim, not repeating words from the first benefit.', max: 24, tone: 'clinical-confident' },
    hashtag: { prompt: 'Branded hashtag for {brand_name} highlighting {hero_ingredient} and its core {benefit_1}. PascalCase. Max 18 chars.', max: 18, tone: 'branded' },
  };
  const d = defaults[layer.id] || { prompt: '', max: 40, tone: 'neutral' };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500">Prompt template</label>
          <button className="text-[10px] font-mono text-violet-700 hover:text-violet-900">insert variable</button>
        </div>
        <textarea rows={4} defaultValue={d.prompt} className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 font-mono resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Model</label>
          <select className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2">
            <option>gemini-2.5-flash</option>
            <option>gemini-2.5-pro</option>
            <option>claude-haiku-4.5</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Max chars</label>
          <input type="number" defaultValue={d.max} className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Tone</label>
        <div className="flex gap-1.5 flex-wrap">
          {['clinical-confident', 'warm', 'playful', 'minimal', 'bold'].map((t, i) => (
            <button key={t} className={`px-2.5 py-1 rounded text-[11px] border ${t === d.tone ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 mb-1">Dry-run preview · DERMDOC</div>
        <div className="text-[13px] text-stone-800 font-medium">
          {layer.id === 'benefit_1_text' ? '"Softens Skin"' :
           layer.id === 'benefit_2_text' ? '"Locks Hydration"' :
           layer.id === 'hashtag' ? '#HydratedSkin' :
           '—'}
        </div>
        <div className="text-[10px] text-amber-700 mt-1">~180 tokens · ₹0.04</div>
      </div>
    </div>
  );
};

const ImageGenConfig = ({ layer }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Prompt template</label>
      <textarea
        rows={5}
        defaultValue={`Studio product photograph of {product_name}. Set against {brand_palette_primary} seamless backdrop. Soft key light 45° left, gentle fill right, subtle shadow below. Hero product centred, bottle label fully legible, {brand_name} lockup visible. Include soft ambient motifs from {category} category. Photoreal, commercial e-commerce quality.`}
        className="w-full text-[12px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 font-mono resize-none"
      />
    </div>

    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Reference image</label>
      <div className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-md">
        <div className="w-10 h-10 bg-stone-200 rounded flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-stone-800 truncate">catalog.product_image[{'{product_id}'}]</div>
          <div className="text-[10px] text-stone-500">Rule-bound · multimodal conditioning</div>
        </div>
        <button className="text-[11px] text-stone-500 hover:text-stone-900">Change</button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Model</label>
        <select className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2">
          <option>imagen-3.0-fast</option>
          <option>imagen-3.0-quality</option>
          <option>nano-banana</option>
          <option>gemini-2.5-image</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Aspect</label>
        <input readOnly defaultValue="auto (from zone)" className="w-full text-[13px] bg-stone-100 border border-stone-200 rounded-md px-3 py-2 text-stone-500" />
      </div>
    </div>

    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Negative prompt</label>
      <input defaultValue="text, watermark, logo, distorted packaging, multiple bottles, human hands" className="w-full text-[12px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 font-mono" />
    </div>

    <div className="p-3 bg-rose-50 border border-rose-200 rounded-md">
      <div className="text-[10px] font-mono uppercase tracking-wider text-rose-700 mb-1">Est. cost per render</div>
      <div className="text-[13px] text-stone-800 font-medium">₹2.20 · ~4.1s</div>
    </div>
  </div>
);

// ============================================================
// TEMPLATE DETAIL + CREATE RUN
// ============================================================

const TemplateDetail = ({ template, onBack, onCreateRun }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 pb-20">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="aspect-square bg-white border border-stone-200 rounded-xl overflow-hidden">
            <TemplatePreview layers={DETECTED_LAYERS} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Pill tone="green"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active</Pill>
            <Pill tone="neutral">{template.aspect}</Pill>
          </div>
          <h1 className="font-display text-3xl font-semibold text-stone-900 tracking-tight mt-2 mb-1">{template.name}</h1>
          <div className="text-[11px] font-mono text-stone-500 mb-6">{template.code}</div>

          <div className="space-y-4 pb-6 border-b border-stone-200">
            <div className="grid grid-cols-2 gap-y-3 text-[12px]">
              <div><div className="text-stone-500">Owner</div><div className="text-stone-900 font-medium mt-0.5">{template.owner}</div></div>
              <div><div className="text-stone-500">Last modified</div><div className="text-stone-900 font-medium mt-0.5">{template.updated}</div></div>
              <div><div className="text-stone-500">Slot count</div><div className="text-stone-900 font-medium mt-0.5">{template.layers}</div></div>
              <div><div className="text-stone-500">Total runs</div><div className="text-stone-900 font-medium mt-0.5">{template.runs}</div></div>
              <div><div className="text-stone-500">Avg CTR</div><div className="text-stone-900 font-medium mt-0.5">{template.ctr}</div></div>
              <div><div className="text-stone-500">Avg cost/variant</div><div className="text-stone-900 font-medium mt-0.5">₹2.40</div></div>
            </div>
          </div>

          <div className="py-6 border-b border-stone-200">
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-2">Slot breakdown</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-stone-100 flex">
                <div className="bg-stone-400" style={{ width: '13%' }} />
                <div className="bg-violet-500" style={{ width: '60%' }} />
                <div className="bg-amber-500" style={{ width: '20%' }} />
                <div className="bg-rose-500" style={{ width: '7%' }} />
              </div>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-stone-400" /><span className="text-stone-600 flex-1">Static</span><span className="font-mono text-stone-900">2</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-violet-500" /><span className="text-stone-600 flex-1">Rule-based</span><span className="font-mono text-stone-900">9</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500" /><span className="text-stone-600 flex-1">Text Gen</span><span className="font-mono text-stone-900">3</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-rose-500" /><span className="text-stone-600 flex-1">Image Gen</span><span className="font-mono text-stone-900">1</span></div>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <button onClick={onCreateRun} className="w-full py-2.5 bg-stone-900 text-white rounded-md text-[13px] font-medium hover:bg-stone-800 flex items-center justify-center gap-2">
              <Play className="w-3.5 h-3.5" /> Create a run
            </button>
            <button className="w-full py-2.5 border border-stone-200 bg-white text-stone-700 rounded-md text-[13px] font-medium hover:border-stone-400 flex items-center justify-center gap-2">
              <Edit3 className="w-3.5 h-3.5" /> Edit configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CREATE RUN MODAL
// ============================================================

const CreateRunModal = ({ template, onClose, onComplete }) => {
  const [mode, setMode] = useState('manual'); // 'manual' | 'agent'
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-0.5">New Run · {template.code}</div>
            <div className="font-display text-xl font-semibold text-stone-900">Create variants with {template.name}</div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-md text-stone-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-2">How are variations decided?</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('manual')}
                className={`text-left p-4 rounded-lg border-2 transition-all ${mode === 'manual' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Pencil className="w-4 h-4 text-stone-700" />
                  <div className="font-semibold text-stone-900 text-[14px]">Manual setup</div>
                </div>
                <div className="text-[12px] text-stone-500">Pick products, set context, run</div>
              </button>
              <button
                onClick={() => setMode('agent')}
                className={`text-left p-4 rounded-lg border-2 transition-all ${mode === 'agent' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-violet-700" />
                  <div className="font-semibold text-stone-900 text-[14px]">Agent ideation</div>
                  <Pill tone="purple">Helix</Pill>
                </div>
                <div className="text-[12px] text-stone-500">Agent picks combinations based on campaign goal</div>
              </button>
            </div>
          </div>

          {mode === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Product selection</label>
                <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <button className="px-2.5 py-1 rounded text-[11px] bg-stone-900 text-white">By brand</button>
                    <button className="px-2.5 py-1 rounded text-[11px] bg-white border border-stone-200 text-stone-600">By category</button>
                    <button className="px-2.5 py-1 rounded text-[11px] bg-white border border-stone-200 text-stone-600">SKU list (CSV)</button>
                    <button className="px-2.5 py-1 rounded text-[11px] bg-white border border-stone-200 text-stone-600">Collection</button>
                  </div>
                  <select className="w-full text-[13px] bg-white border border-stone-200 rounded-md px-3 py-2 mb-2">
                    <option>DERMDOC · all active SKUs (48)</option>
                    <option>GOOD VIBES · skincare only (22)</option>
                    <option>NY BAE · new launches (6)</option>
                  </select>
                  <div className="text-[11px] text-stone-500">48 products selected · will produce 48 variants</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Campaign context</label>
                  <input defaultValue="Hydration Week" className="w-full text-[13px] bg-white border border-stone-200 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Season</label>
                  <select className="w-full text-[13px] bg-white border border-stone-200 rounded-md px-3 py-2">
                    <option>Winter</option>
                    <option>Monsoon</option>
                    <option>Summer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Approval policy</label>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded text-[12px] bg-stone-900 text-white">Auto-publish approved</button>
                  <button className="px-3 py-1.5 rounded text-[12px] bg-white border border-stone-200 text-stone-600">Queue for Brand review</button>
                </div>
              </div>
            </div>
          )}

          {mode === 'agent' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-violet-700" />
                  <span className="text-[12px] font-semibold text-violet-900">Helix will pick the variation combinations</span>
                </div>
                <div className="text-[12px] text-violet-800 leading-relaxed">Describe the campaign objective. Helix combines winning historical creatives + performance data + brand constraints to propose a variant set.</div>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Campaign objective</label>
                <textarea rows={3} defaultValue="Drive PDP engagement for DERMDOC winter skincare range. Lean into clinical-confident tone. Prioritise SKUs with high stock + low current traffic. Generate 5 variant angles per SKU to A/B test at PDP hero slot."
                  className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 resize-none" />
              </div>
              <div className="p-3 bg-stone-50 rounded-md">
                <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-2">Helix proposal</div>
                <div className="text-[12px] text-stone-700 space-y-1">
                  <div>• 12 DERMDOC SKUs selected (filter: stock &gt; 500, PDP_CTR &lt; median)</div>
                  <div>• 5 angle variants per SKU (benefit-led / ingredient-led / texture / routine / comparison)</div>
                  <div>• Total: 60 variants · est. ₹144 · ~6 min</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="text-[12px] text-stone-500">
            {mode === 'manual' ? '48 variants · est. ₹115' : '60 variants · est. ₹144'} · routed to Asset Library on completion
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-md border border-stone-200 bg-white text-stone-700 text-[13px] font-medium">Cancel</button>
            <button onClick={onComplete} className="px-4 py-2 rounded-md bg-stone-900 text-white text-[13px] font-medium hover:bg-stone-800 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" /> Start run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ASSET LIBRARY
// ============================================================

const AssetCard = ({ asset, onClick }) => {
  const palettes = {
    dermdoc: 'dermdoc', goodvibes: 'goodvibes', nybae: 'nybae',
  };
  const product = asset.brand === 'DERMDOC' ? 'dermdoc' : asset.brand === 'GOOD VIBES' ? 'goodvibes' : 'nybae';
  return (
    <button onClick={onClick} className="group text-left bg-white border border-stone-200 rounded-lg overflow-hidden hover:border-stone-900 hover:shadow-md transition-all">
      <div className="aspect-square bg-stone-50 relative overflow-hidden">
        <TemplatePreview layers={DETECTED_LAYERS} selectedId={null} product={product} />
        <div className="absolute top-2 left-2">
          {asset.status === 'approved' && <Pill tone="green"><Check className="w-2.5 h-2.5" /> Approved</Pill>}
          {asset.status === 'review'   && <Pill tone="amber"><Clock className="w-2.5 h-2.5" /> Review</Pill>}
          {asset.status === 'flagged'  && <Pill tone="rose"><AlertCircle className="w-2.5 h-2.5" /> Flagged</Pill>}
        </div>
      </div>
      <div className="p-3">
        <div className="text-[13px] font-semibold text-stone-900 truncate">{asset.product}</div>
        <div className="text-[11px] text-stone-500">{asset.brand}</div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-stone-500">
          <span className="truncate">{asset.code}</span>
          {asset.ctr !== '—' && <span className="text-emerald-700">CTR {asset.ctr}</span>}
        </div>
      </div>
    </button>
  );
};

const AssetLibrary = ({ onOpenDetail }) => {
  const [filter, setFilter] = useState('all');
  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-stone-400 mb-2">Brand Manager</div>
          <h1 className="font-display text-3xl font-semibold text-stone-900 tracking-tight">Asset Library</h1>
          <p className="text-[13px] text-stone-500">Generated creatives across all tracks. Tagged, versioned, performance-linked.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-200 bg-white text-[12px] text-stone-700 hover:border-stone-400">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 text-white text-[12px] font-medium hover:bg-stone-800">
            <Zap className="w-3.5 h-3.5" />
            Push to Marketing Agent
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5">
        {['all', 'approved', 'review', 'flagged'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium capitalize ${filter === f ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'}`}
          >
            {f} {f !== 'all' && <span className="ml-1 text-[10px] opacity-70">({f === 'approved' ? 5 : f === 'review' ? 2 : 1})</span>}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <select className="text-[12px] bg-white border border-stone-200 rounded-md px-2 py-1.5">
            <option>All templates</option>
            <option>Benefits Hero</option>
          </select>
          <select className="text-[12px] bg-white border border-stone-200 rounded-md px-2 py-1.5">
            <option>All brands</option>
          </select>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-stone-200 bg-white text-[12px] text-stone-600">
            <SlidersHorizontal className="w-3.5 h-3.5" /> More
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {SAMPLE_ASSETS.filter(a => filter === 'all' || a.status === filter).map(a => (
          <AssetCard key={a.id} asset={a} onClick={() => onOpenDetail(a)} />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// ASSET DETAIL DRAWER + REFINE FLOW
// ============================================================

const AssetDetailDrawer = ({ asset, onClose }) => {
  const [refineMode, setRefineMode] = useState(null); // null | 'template' | 'slot' | 'prompt' | 'ideation'
  const product = asset.brand === 'DERMDOC' ? 'dermdoc' : asset.brand === 'GOOD VIBES' ? 'goodvibes' : 'nybae';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-end">
      <div className="bg-[#FAF9F7] w-full max-w-3xl h-full overflow-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-md">
              <X className="w-4 h-4 text-stone-600" />
            </button>
            <div>
              <div className="text-[11px] font-mono text-stone-500">Asset · {asset.code}</div>
              <div className="font-display text-xl font-semibold text-stone-900">{asset.product}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-stone-100 rounded-md text-stone-600"><ThumbsUp className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-stone-100 rounded-md text-stone-600"><ThumbsDown className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-stone-100 rounded-md text-stone-600"><Download className="w-4 h-4" /></button>
          </div>
        </div>

        {!refineMode && (
          <div className="p-6 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="aspect-square">
                <TemplatePreview layers={DETECTED_LAYERS} product={product} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-[12px]">
              <div className="bg-white border border-stone-200 rounded-lg p-3"><div className="text-stone-500 text-[10px] uppercase font-mono tracking-wider">Status</div><div className="font-semibold text-stone-900 mt-1 capitalize">{asset.status}</div></div>
              <div className="bg-white border border-stone-200 rounded-lg p-3"><div className="text-stone-500 text-[10px] uppercase font-mono tracking-wider">CTR</div><div className="font-semibold text-stone-900 mt-1">{asset.ctr}</div></div>
              <div className="bg-white border border-stone-200 rounded-lg p-3"><div className="text-stone-500 text-[10px] uppercase font-mono tracking-wider">Impressions</div><div className="font-semibold text-stone-900 mt-1">42,108</div></div>
              <div className="bg-white border border-stone-200 rounded-lg p-3"><div className="text-stone-500 text-[10px] uppercase font-mono tracking-wider">Generated</div><div className="font-semibold text-stone-900 mt-1">2d ago</div></div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-3">Slot provenance</div>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-violet-600" /><span className="text-stone-600 flex-1 font-mono">brand_name_text</span><span className="text-stone-900 font-mono">"DERMDOC"</span><span className="text-stone-400 text-[10px]">rule</span></div>
                <div className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-violet-600" /><span className="text-stone-600 flex-1 font-mono">ingredient_name</span><span className="text-stone-900 font-mono">"SQUALANE"</span><span className="text-stone-400 text-[10px]">rule</span></div>
                <div className="flex items-center gap-2"><Type className="w-3.5 h-3.5 text-amber-600" /><span className="text-stone-600 flex-1 font-mono">benefit_text_1</span><span className="text-stone-900 font-mono">"Skin Softening"</span><span className="text-stone-400 text-[10px]">gemini-flash</span></div>
                <div className="flex items-center gap-2"><Type className="w-3.5 h-3.5 text-amber-600" /><span className="text-stone-600 flex-1 font-mono">hashtag</span><span className="text-stone-900 font-mono">"#HydratedSkin"</span><span className="text-stone-400 text-[10px]">gemini-flash</span></div>
                <div className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-rose-600" /><span className="text-stone-600 flex-1 font-mono">hero_product_image</span><span className="text-stone-900 font-mono">img_4aef21.png</span><span className="text-stone-400 text-[10px]">imagen-3</span></div>
              </div>
            </div>

            {/* REFINE PANEL */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 text-white">
              <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-2">Not happy with this output?</div>
              <div className="font-display text-xl font-semibold mb-4">Refinement options</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setRefineMode('template')} className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-colors">
                  <div className="flex items-center gap-2 mb-1"><Layers className="w-3.5 h-3.5 text-stone-300" /><span className="text-[12px] font-semibold">Tweak template</span></div>
                  <div className="text-[11px] text-stone-400">Edit layer geometry, positions, layout</div>
                </button>
                <button onClick={() => setRefineMode('slot')} className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-colors">
                  <div className="flex items-center gap-2 mb-1"><SlidersHorizontal className="w-3.5 h-3.5 text-stone-300" /><span className="text-[12px] font-semibold">Adjust fill logic</span></div>
                  <div className="text-[11px] text-stone-400">Change strategy or rule for specific slots</div>
                </button>
                <button onClick={() => setRefineMode('prompt')} className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-colors">
                  <div className="flex items-center gap-2 mb-1"><RefreshCw className="w-3.5 h-3.5 text-stone-300" /><span className="text-[12px] font-semibold">Regenerate prompt</span></div>
                  <div className="text-[11px] text-stone-400">Rewrite prompt for this variant only</div>
                </button>
                <button onClick={() => setRefineMode('ideation')} className="text-left bg-gradient-to-br from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-violet-400/30 rounded-lg p-3 transition-colors">
                  <div className="flex items-center gap-2 mb-1"><Bot className="w-3.5 h-3.5 text-violet-300" /><span className="text-[12px] font-semibold">Send to Helix</span></div>
                  <div className="text-[11px] text-stone-400">Re-ideate angle via agent</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {refineMode && (
          <div className="p-6">
            <button onClick={() => setRefineMode(null)} className="text-[13px] text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to asset
            </button>

            {refineMode === 'prompt' && (
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h3 className="font-display text-2xl font-semibold text-stone-900 mb-1">Regenerate with new prompt</h3>
                <p className="text-[13px] text-stone-500 mb-5">This applies only to <span className="font-mono text-stone-800">{asset.product}</span> — other variants from this run are untouched.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Slot to regenerate</label>
                    <select className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 font-mono">
                      <option>hero_product_image (Image Gen)</option>
                      <option>benefit_text_1 (Text Gen)</option>
                      <option>hashtag (Text Gen)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">Revised prompt</label>
                    <textarea rows={5} defaultValue="Studio product photograph of Squalane Body Lotion. Softer backdrop with warmer undertone than default. Add subtle water droplet motif near the pack. Hero centre-frame, 45° light." className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 resize-none" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setRefineMode(null)} className="px-4 py-2 rounded-md border border-stone-200 text-[13px] text-stone-700">Cancel</button>
                    <button className="px-4 py-2 rounded-md bg-stone-900 text-white text-[13px] font-medium flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Regenerate</button>
                  </div>
                </div>
              </div>
            )}

            {refineMode === 'slot' && (
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h3 className="font-display text-2xl font-semibold text-stone-900 mb-1">Adjust fill logic</h3>
                <p className="text-[13px] text-stone-500 mb-5">Changes propagate — applies to <span className="font-semibold text-stone-800">all future runs</span> of this template. Existing assets unchanged.</p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-5 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="text-[12px] text-amber-900">Editing the template config requires re-approval from Brand if template is published.</div>
                </div>
                <button className="w-full py-2.5 bg-stone-900 text-white rounded-md text-[13px] font-medium flex items-center justify-center gap-2">
                  <Edit3 className="w-3.5 h-3.5" /> Open Layer Configurator
                </button>
              </div>
            )}

            {refineMode === 'template' && (
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h3 className="font-display text-2xl font-semibold text-stone-900 mb-1">Tweak template geometry</h3>
                <p className="text-[13px] text-stone-500 mb-5">Creates a new minor version (v3 → v3.1). Running campaigns on v3 are unaffected.</p>
                <button className="w-full py-2.5 bg-stone-900 text-white rounded-md text-[13px] font-medium">Fork template & edit</button>
              </div>
            )}

            {refineMode === 'ideation' && (
              <div className="bg-white rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/50 to-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-violet-700" />
                  <h3 className="font-display text-2xl font-semibold text-stone-900">Send to Helix for re-ideation</h3>
                </div>
                <p className="text-[13px] text-stone-500 mb-5">Helix will inspect this asset's performance, compare to top-performing siblings, and propose alternate angles.</p>
                <div className="p-4 bg-white border border-stone-200 rounded-md mb-5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-2">What's not working</div>
                  <textarea rows={3} defaultValue="CTR sitting at 1.2% vs template median 3.4%. Hero product feels dim. Benefit copy overlaps with another DERMDOC variant." className="w-full text-[13px] bg-stone-50 border border-stone-200 rounded-md px-3 py-2 resize-none" />
                </div>
                <button className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md text-[13px] font-medium flex items-center justify-center gap-2">
                  <Wand2 className="w-3.5 h-3.5" /> Ideate 3 alternatives
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// ROOT APP
// ============================================================

export default function App() {
  const [persona, setPersona] = useState('brand');
  const [panel, setPanel] = useState('studio');
  const [view, setView] = useState('tracks'); // tracks | templates | detail
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [addTemplateOpen, setAddTemplateOpen] = useState(false);
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [assetDetail, setAssetDetail] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const goHome = () => { setView('tracks'); setSelectedTrack(null); setSelectedTemplate(null); setPanel('studio'); };

  const breadcrumb = useMemo(() => {
    const crumbs = [];
    const p = PERSONAS.find(pp => pp.id === persona);
    crumbs.push({ label: p.label, onClick: goHome });
    if (panel === 'library') {
      crumbs.push({ label: 'Asset Library', onClick: () => {} });
    } else {
      if (selectedTrack) crumbs.push({ label: selectedTrack.label, onClick: () => { setView('templates'); setSelectedTemplate(null); } });
      if (selectedTemplate) crumbs.push({ label: selectedTemplate.name, onClick: () => {} });
    }
    return crumbs;
  }, [persona, panel, selectedTrack, selectedTemplate]);

  return (
    <div className="min-h-screen bg-[#FAF9F7]" style={{ fontFamily: "'Geist', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; font-variation-settings: "opsz" 144, "SOFT" 30; }
        .font-mono    { font-family: 'Geist Mono', 'JetBrains Mono', monospace; }
        body          { font-family: 'Geist', sans-serif; -webkit-font-smoothing: antialiased; }
        * { font-feature-settings: "ss01" on, "cv11" on; }
      `}</style>

      <TopNav
        persona={persona}
        setPersona={setPersona}
        panel={panel}
        setPanel={(p) => { setPanel(p); if (p === 'library') setView('tracks'); }}
        breadcrumb={breadcrumb}
        onHome={goHome}
      />

      {panel === 'studio' && view === 'tracks' && (
        <TracksView persona={persona} onSelectTrack={(t) => { setSelectedTrack(t); setView('templates'); }} />
      )}

      {panel === 'studio' && view === 'templates' && selectedTrack && (
        <TemplatesView
          track={selectedTrack}
          persona={persona}
          onAddTemplate={() => setAddTemplateOpen(true)}
          onSelectTemplate={(t) => { setSelectedTemplate(t); setView('detail'); }}
        />
      )}

      {panel === 'studio' && view === 'detail' && selectedTemplate && (
        <TemplateDetail
          template={selectedTemplate}
          onBack={() => { setView('templates'); setSelectedTemplate(null); }}
          onCreateRun={() => setRunModalOpen(true)}
        />
      )}

      {panel === 'library' && (
        <AssetLibrary onOpenDetail={setAssetDetail} />
      )}

      {addTemplateOpen && (
        <AddTemplateWizard
          onClose={() => setAddTemplateOpen(false)}
          onComplete={() => { setAddTemplateOpen(false); showToast('Template submitted for approval — Rhea P. notified'); }}
        />
      )}

      {runModalOpen && selectedTemplate && (
        <CreateRunModal
          template={selectedTemplate}
          onClose={() => setRunModalOpen(false)}
          onComplete={() => {
            setRunModalOpen(false);
            showToast('Run started — 48 variants queued · ~5 min');
            setTimeout(() => { setPanel('library'); }, 1500);
          }}
        />
      )}

      {assetDetail && (
        <AssetDetailDrawer asset={assetDetail} onClose={() => setAssetDetail(null)} />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-right">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-[13px]">{toast}</span>
        </div>
      )}
    </div>
  );
}
