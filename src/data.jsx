// ============================================================
// DATA MODELS — shared via window globals
// ============================================================

const PERSONAS = [
  { id: 'brand',     label: 'Brand',     fullLabel: 'Brand Manager',  iconKey: 'Palette',      owner: 'Brand Teams' },
  { id: 'product',   label: 'Product',   fullLabel: 'Product Team',   iconKey: 'Package',      owner: 'Product & Personalisation' },
  { id: 'marketing', label: 'Marketing', fullLabel: 'Marketing Team', iconKey: 'Megaphone',    owner: 'Performance Marketing' },
  { id: 'merch',     label: 'Merch',     fullLabel: 'Merch Design',   iconKey: 'ShoppingCart', owner: 'Merchandising Ops' },
];

const TRACKS_BY_PERSONA = {
  brand: [
    { id: 'pdp_images',       label: 'PDP Images',        desc: 'Product page hero creatives',             templates: 12, runs: 4126,    iconKey: 'ImageIcon' },
    { id: 'pdp_aplus',        label: 'PDP A+ Content',    desc: 'Long-form product storytelling modules',  templates: 8,  runs: 612,     iconKey: 'FileText' },
    { id: 'product_artwork',  label: 'Product Artwork',   desc: 'Carton & pack artwork compositions',      templates: 6,  runs: 184,     iconKey: 'Palette' },
    { id: 'brand_marketing',  label: 'Brand Marketing',   desc: 'Launches, campaigns, brand statics',      templates: 15, runs: 2340,    iconKey: 'Megaphone' },
  ],
  product: [
    { id: 'personalised_collection', label: 'Personalised Collections', desc: '1:1 banners at serve time',           templates: 7, runs: 1820000, iconKey: 'Sparkles' },
    { id: 'category_entry',          label: 'Category Entry Banners',   desc: 'Category landing hero modules',       templates: 5, runs: 486,     iconKey: 'Layers' },
    { id: 'cross_sell',              label: 'Cross-sell Modules',       desc: 'PDP cross-sell + bundle banners',     templates: 4, runs: 240,     iconKey: 'Layers' },
    { id: 'segment_banners',         label: 'Segment Banners',          desc: 'Geo and cohort banners',              templates: 9, runs: 612,     iconKey: 'Layers' },
  ],
  marketing: [
    { id: 'meta_statics',   label: 'Meta Statics',   desc: '1:1 / 4:5 / 9:16 paid social',    templates: 18, runs: 8240, iconKey: 'ImageIcon' },
    { id: 'google_display', label: 'Google Display', desc: 'GDN responsive display',          templates: 11, runs: 3120, iconKey: 'ImageIcon' },
    { id: 'crm_hero',       label: 'CRM Hero',       desc: 'Email + push campaign statics',   templates: 9,  runs: 1460, iconKey: 'Megaphone' },
    { id: 'affiliate',      label: 'Affiliate Creatives', desc: 'Network-specific ad units',  templates: 6,  runs: 420,  iconKey: 'Layers' },
  ],
  merch: [
    { id: 'sale_calendar',  label: 'Sale Calendar Merch', desc: 'Weekly sale banners, homepage modules', templates: 14, runs: 12800, iconKey: 'ShoppingCart' },
    { id: 'offer_banners',  label: 'Offer Banners',       desc: 'Free gift, combo, flat-off banners',    templates: 11, runs: 6820,  iconKey: 'ShoppingCart' },
    { id: 'category_merch', label: 'Category Merch',      desc: 'Category page promotional banners',     templates: 8,  runs: 2460,  iconKey: 'ShoppingCart' },
    { id: 'flash_sale',     label: 'Flash Sale',          desc: 'Time-boxed flash creatives',            templates: 5,  runs: 840,   iconKey: 'Sparkles' },
  ],
};

const BRAND_PDP_TEMPLATES = [
  { id: 'benefits_hero',    name: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', aspect: '1:1', layers: 15, runs: 1204, ctr: '3.1%', updated: '6h ago',  owner: 'Rhea P.',  status: 'active',     layoutKey: 'benefits' },
  { id: 'rich_pack_shot',   name: 'Rich Pack Shot',   code: 'BRND-RPS-1x1-V2', aspect: '1:1', layers: 7,  runs: 842,  ctr: '2.4%', updated: '2d ago',  owner: 'Rhea P.',  status: 'active',     layoutKey: 'pack' },
  { id: 'hero_ingredients', name: 'Hero Ingredients', code: 'BRND-ING-1x1-V1', aspect: '1:1', layers: 11, runs: 486,  ctr: '2.8%', updated: '4d ago',  owner: 'Arjun M.', status: 'draft',      layoutKey: 'ingredients' },
  { id: 'before_after',     name: 'Before / After',   code: 'BRND-BAF-1x1-V2', aspect: '1:1', layers: 9,  runs: 312,  ctr: '3.6%', updated: '1w ago',  owner: 'Rhea P.',  status: 'active',     layoutKey: 'beforeafter' },
  { id: 'texture_closeup',  name: 'Texture Close-up', code: 'BRND-TXT-1x1-V1', aspect: '1:1', layers: 6,  runs: 128,  ctr: '2.1%', updated: '2w ago',  owner: 'Arjun M.', status: 'deprecated', layoutKey: 'texture' },
  { id: 'routine_regimen',  name: 'Routine / Regimen',code: 'BRND-RTN-1x1-V1', aspect: '1:1', layers: 13, runs: 86,   ctr: '2.9%', updated: '3w ago',  owner: 'Rhea P.',  status: 'draft',      layoutKey: 'routine' },
];

const DETECTED_LAYERS = [
  { id: 'bg_left',       name: 'bg_left',           type: 'shape',  strategy: 'rule',     suggestion: 'rule',     confidence: 0.94, zone: { x: 0,  y: 0,  w: 50, h: 100 } },
  { id: 'bg_right',      name: 'bg_right',          type: 'shape',  strategy: 'rule',     suggestion: 'rule',     confidence: 0.94, zone: { x: 50, y: 0,  w: 50, h: 100 } },
  { id: 'brand_logo',    name: 'brand_name_text',   type: 'text',   strategy: 'rule',     suggestion: 'rule',     confidence: 0.98, zone: { x: 5,  y: 10, w: 30, h: 7  } },
  { id: 'ing_pill_bg',   name: 'ingredient_pill',   type: 'shape',  strategy: 'rule',     suggestion: 'rule',     confidence: 0.88, zone: { x: 5,  y: 20, w: 28, h: 8  } },
  { id: 'ing_name',      name: 'ingredient_name',   type: 'text',   strategy: 'rule',     suggestion: 'rule',     confidence: 0.92, zone: { x: 7,  y: 21, w: 25, h: 6  } },
  { id: 'category',      name: 'category_display',  type: 'text',   strategy: 'rule',     suggestion: 'rule',     confidence: 0.91, zone: { x: 5,  y: 30, w: 35, h: 6  } },
  { id: 'benefit_1_icon',name: 'benefit_icon_1',    type: 'vector', strategy: 'rule',     suggestion: 'rule',     confidence: 0.82, zone: { x: 5,  y: 44, w: 4,  h: 4  } },
  { id: 'benefit_1_text',name: 'benefit_text_1',    type: 'textgen',suggestion: 'textgen',strategy: 'textgen',    confidence: 0.89, zone: { x: 11, y: 44, w: 30, h: 5  } },
  { id: 'benefit_2_icon',name: 'benefit_icon_2',    type: 'vector', strategy: 'rule',     suggestion: 'rule',     confidence: 0.82, zone: { x: 5,  y: 52, w: 4,  h: 4  } },
  { id: 'benefit_2_text',name: 'benefit_text_2',    type: 'textgen',suggestion: 'textgen',strategy: 'textgen',    confidence: 0.87, zone: { x: 11, y: 52, w: 30, h: 5  } },
  { id: 'hashtag',       name: 'hashtag',           type: 'textgen',suggestion: 'textgen',strategy: 'textgen',    confidence: 0.84, zone: { x: 5,  y: 68, w: 30, h: 5  } },
  { id: 'cta_bg',        name: 'cta_button_bg',     type: 'shape',  strategy: 'static',   suggestion: 'static',   confidence: 0.99, zone: { x: 5,  y: 80, w: 22, h: 8  } },
  { id: 'cta_text',      name: 'cta_text',          type: 'text',   strategy: 'static',   suggestion: 'static',   confidence: 0.99, zone: { x: 7,  y: 82, w: 18, h: 5  } },
  { id: 'hero_product',  name: 'hero_product_image',type: 'image',  strategy: 'imagegen', suggestion: 'imagegen', confidence: 0.96, zone: { x: 55, y: 15, w: 40, h: 70 } },
  { id: 'decor_1',       name: 'decor_particles',   type: 'vector', strategy: 'rule',     suggestion: 'rule',     confidence: 0.61, zone: { x: 58, y: 70, w: 35, h: 20 } },
];

const VARIABLES = [
  { token: '{brand_id}', source: 'run_context', example: 'dermdoc' },
  { token: '{brand_name}', source: 'catalog', example: 'DERMDOC' },
  { token: '{product_id}', source: 'run_context', example: 'BL_0241' },
  { token: '{product_name}', source: 'catalog', example: 'Squalane Body Lotion' },
  { token: '{hero_ingredient}', source: 'catalog', example: 'Squalane' },
  { token: '{benefit_1}', source: 'catalog', example: 'Skin Softening' },
  { token: '{benefit_2}', source: 'catalog', example: 'Softens Skin' },
  { token: '{category}', source: 'catalog', example: 'Body Lotion' },
  { token: '{brand_palette_primary}', source: 'brand_guidelines', example: '#B39DDB' },
  { token: '{campaign_context}', source: 'run_input', example: 'Hydration Week' },
  { token: '{season}', source: 'run_input', example: 'Winter' },
  { token: '{tone}', source: 'run_input', example: 'clinical-confident' },
];

const DATA_BLOCKS = [
  { id: 'catalog',          label: 'Product Catalog',    rows: '2.4M', owner: 'Data Platform' },
  { id: 'brand_guidelines', label: 'Brand Guidelines',   rows: '8',    owner: 'Brand' },
  { id: 'ingredient_lib',   label: 'Ingredient Library', rows: '340',  owner: 'Content Ops' },
  { id: 'benefit_icons',    label: 'Benefit Icon Map',   rows: '128',  owner: 'Design' },
  { id: 'offer_table',      label: 'Active Offers',      rows: '420',  owner: 'Merch' },
  { id: 'palette_library',  label: 'Palette Library',    rows: '64',   owner: 'Brand' },
];

const BRANDS = [
  { id: 'dermdoc',   name: 'DERMDOC',        palette: { left: '#E8DEF8', right: '#B39DDB', ink: '#1F1B2E', accent: '#6B4EAA' } },
  { id: 'goodvibes', name: 'GOOD VIBES',     palette: { left: '#FFE4E9', right: '#FFC9D4', ink: '#2A1628', accent: '#9B2D4F' } },
  { id: 'nybae',     name: 'NY BAE',         palette: { left: '#2A1B3D', right: '#1A0F28', ink: '#F5F1EA', accent: '#E8B4B8' } },
  { id: 'alps',      name: 'ALPS GOODNESS',  palette: { left: '#FFE8DE', right: '#FFD4C4', ink: '#3A1F1B', accent: '#B85450' } },
];

const RUNS = [
  { id: 'run_0428', code: 'RUN-0428', name: 'DERMDOC Hydration Week · W17',   template: 'Benefits Hero', templateCode: 'BRND-BHH-1x1-V3', templateVersion: 'v3', startedAt: '2d ago', startedBy: 'Simran K.', variants: 48, approved: 42, review: 4, flagged: 2, cost: 115.20, ctrMedian: '3.4%', ctrTop: '4.1%', status: 'live', campaign: 'Hydration Week', axes: ['season = Winter', 'campaign_context × 3', 'tone × 2'] },
  { id: 'run_0427', code: 'RUN-0427', name: 'GOOD VIBES Winter Glow drop',    template: 'Benefits Hero', templateCode: 'BRND-BHH-1x1-V3', templateVersion: 'v3', startedAt: '4d ago', startedBy: 'Arjun M.',  variants: 22, approved: 22, review: 0, flagged: 0, cost: 52.80,  ctrMedian: '3.8%', ctrTop: '4.6%', status: 'live', campaign: 'Winter Glow',    axes: ['season = Winter', 'tone = warm'] },
  { id: 'run_0425', code: 'RUN-0425', name: 'NY BAE matte lip launch',        template: 'Benefits Hero', templateCode: 'BRND-BHH-1x1-V3', templateVersion: 'v3', startedAt: '6d ago', startedBy: 'Rhea P.',   variants: 6,  approved: 4,  review: 1, flagged: 1, cost: 14.40,  ctrMedian: '2.1%', ctrTop: '3.2%', status: 'live', campaign: 'Matte Lip Launch', axes: ['angle × 5', 'tone = bold'], underperforming: true },
  { id: 'run_0422', code: 'RUN-0422', name: 'ALPS Hibiscus hair range',       template: 'Before / After',templateCode: 'BRND-BAF-1x1-V2', templateVersion: 'v2', startedAt: '1w ago', startedBy: 'Simran K.', variants: 12, approved: 10, review: 2, flagged: 0, cost: 28.80,  ctrMedian: '3.6%', ctrTop: '4.4%', status: 'live', campaign: 'Hibiscus Launch',  axes: ['angle × 3'] },
  { id: 'run_0419', code: 'RUN-0419', name: 'DERMDOC Vitamin C refresh',      template: 'Benefits Hero', templateCode: 'BRND-BHH-1x1-V3', templateVersion: 'v3', startedAt: '2w ago', startedBy: 'Arjun M.',  variants: 32, approved: 30, review: 0, flagged: 2, cost: 76.80,  ctrMedian: '3.2%', ctrTop: '3.9%', status: 'live', campaign: 'Vitamin Refresh',  axes: ['tone × 2', 'campaign_context × 2'] },
];

const SAMPLE_ASSETS = [
  { id: 'a1',  product: 'Squalane Body Lotion', sku: 'BL_0241', brand: 'DERMDOC',       brandId: 'dermdoc',   template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.4%', runId: 'run_0428', impressions: 42108 },
  { id: 'a2',  product: 'Niacinamide Serum',    sku: 'NS_0118', brand: 'DERMDOC',       brandId: 'dermdoc',   template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '2.9%', runId: 'run_0428', impressions: 38421 },
  { id: 'a3',  product: 'Retinol Night Cream',  sku: 'RN_0331', brand: 'DERMDOC',       brandId: 'dermdoc',   template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'review',   ctr: '—',    runId: 'run_0428', impressions: 0 },
  { id: 'a4',  product: 'Rose Glow Mist',       sku: 'GV_0812', brand: 'GOOD VIBES',    brandId: 'goodvibes', template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '4.1%', runId: 'run_0427', impressions: 51260 },
  { id: 'a5',  product: 'Matte Lipstick',       sku: 'NB_1104', brand: 'NY BAE',        brandId: 'nybae',     template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'flagged',  ctr: '1.2%', runId: 'run_0425', impressions: 18421 },
  { id: 'a6',  product: 'Vitamin C Serum',      sku: 'VC_0442', brand: 'DERMDOC',       brandId: 'dermdoc',   template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.2%', runId: 'run_0419', impressions: 29108 },
  { id: 'a7',  product: 'Cica Sunscreen',       sku: 'GV_0391', brand: 'GOOD VIBES',    brandId: 'goodvibes', template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.8%', runId: 'run_0427', impressions: 44219 },
  { id: 'a8',  product: 'Hibiscus Shampoo',     sku: 'AG_0722', brand: 'ALPS GOODNESS', brandId: 'alps',      template: 'Before / After',   code: 'BRND-BAF-1x1-V2', status: 'review',   ctr: '—',    runId: 'run_0422', impressions: 0 },
  { id: 'a9',  product: 'Squalane Face Oil',    sku: 'SF_0198', brand: 'DERMDOC',       brandId: 'dermdoc',   template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.6%', runId: 'run_0428', impressions: 35610 },
  { id: 'a10', product: 'Peptide Eye Cream',    sku: 'PE_0501', brand: 'DERMDOC',       brandId: 'dermdoc',   template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.1%', runId: 'run_0419', impressions: 27104 },
  { id: 'a11', product: 'Hydra Sunscreen',      sku: 'HS_0612', brand: 'DERMDOC',       brandId: 'dermdoc',   template: 'Benefits Hero',    code: 'BRND-BHH-1x1-V3', status: 'approved', ctr: '3.9%', runId: 'run_0428', impressions: 48210 },
  { id: 'a12', product: 'Aloe Hair Mask',       sku: 'AG_0894', brand: 'ALPS GOODNESS', brandId: 'alps',      template: 'Before / After',   code: 'BRND-BAF-1x1-V2', status: 'approved', ctr: '3.4%', runId: 'run_0422', impressions: 22108 },
];

Object.assign(window, {
  PERSONAS, TRACKS_BY_PERSONA, BRAND_PDP_TEMPLATES, DETECTED_LAYERS,
  VARIABLES, DATA_BLOCKS, BRANDS, RUNS, SAMPLE_ASSETS,
});
