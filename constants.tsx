
import { LabStep, StyleOption, AccessoryCategory, LookbookItem } from './types';

export const STEPS = [LabStep.HAIRSTYLE, LabStep.MAKEUP, LabStep.WARDROBE, LabStep.ACCESSORIES, LabStep.SCENE];

export const HAIRSTYLES: StyleOption[] = [
  { id: 'h1', name: '法式复古卷', description: '慵懒与优雅的极致碰撞', image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80', tag: '热选', subCategory: '卷发', borderColor: 'border-accent-cyan' },
  { id: 'h2', name: '摩登齐耳短发', description: '利落线条勾勒前卫态度', image: 'https://images.unsplash.com/photo-1522337660859-02fbefda4502?auto=format&fit=crop&w=600&q=80', subCategory: '短发', borderColor: 'border-accent-pink' },
  { id: 'h8', name: '极简黑长直', description: '垂坠质感展现东方神韵', image: 'https://images.unsplash.com/photo-1592188657297-c6473609e988?auto=format&fit=crop&w=600&q=80', tag: '经典', subCategory: '长发', borderColor: 'border-slate-800' },
  { id: 'h12', name: '灵动蝴蝶剪', description: '轻盈外翻的层次感', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80', tag: '潮流', subCategory: '长发', borderColor: 'border-accent-cyan' },
  { id: 'h13', name: '日系波比头', description: '减龄神器的内扣弧度', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80', subCategory: '短发', borderColor: 'border-accent-pink' },
  { id: 'h14', name: '慵懒羊毛卷', description: '蓬松质感打造精致小脸', image: 'https://images.unsplash.com/photo-1492158244976-29b84ba93025?auto=format&fit=crop&w=600&q=80', subCategory: '卷发', borderColor: 'border-accent-orange' },
  { id: 'h15', name: '狼尾碎发', description: '叛逆张扬的视觉焦点', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=600&q=80', subCategory: '短发', borderColor: 'border-accent-lime' },
  { id: 'h16', name: '森系双马尾', description: '自然清新的灵动少女感', image: 'https://images.unsplash.com/photo-1610438183186-041793740f90?auto=format&fit=crop&w=600&q=80', subCategory: '扎发', borderColor: 'border-accent-cyan' },
  { id: 'h5', name: '极简寸头', description: '硬朗轮廓展现纯粹力量', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80', subCategory: '男士', borderColor: 'border-slate-800' },
  { id: 'h6', name: '复古油头', description: '绅士格调的经典回归', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80', tag: '绅士', subCategory: '男士', borderColor: 'border-primary' },
  { id: 'h17', name: '雅痞长发', description: '深邃内敛的艺术气息', image: 'https://images.unsplash.com/photo-1520338661084-680395cb57c9?auto=format&fit=crop&w=600&q=80', subCategory: '男士', borderColor: 'border-accent-pink' },
];

export const MAKEUPS: StyleOption[] = [
  { id: 'm0', name: '无妆容', description: '回归最纯粹的自然本色', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80', tag: '原生', subCategory: '基础', borderColor: 'border-gray-200' },
  { id: 'm1', name: '清透水光妆', description: '呼吸感的伪素颜美学', image: 'https://images.unsplash.com/photo-1522337300243-26325568374d?auto=format&fit=crop&w=600&q=80', tag: '自然', subCategory: '日常', borderColor: 'border-accent-cyan' },
  { id: 'm2', name: '经典复古红', description: '红唇与远山黛的跨时空对话', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80', subCategory: '派对', borderColor: 'border-accent-pink' },
  { id: 'm4', name: '微醺甜桃妆', description: '元气温柔的少女柔焦感', image: 'https://images.unsplash.com/photo-1512496011212-721d80bc6461?auto=format&fit=crop&w=600&q=80', tag: '元气', subCategory: '日常', borderColor: 'border-accent-orange' },
  { id: 'm5', name: '高级裸感妆', description: '低饱和度的职场精英质感', image: 'https://images.unsplash.com/photo-1503910397258-41d3e896af21?auto=format&fit=crop&w=600&q=80', subCategory: '职场', borderColor: 'border-primary' },
  { id: 'm6', name: '中式烟雨妆', description: '东方韵味的墨色晕染', image: 'https://images.unsplash.com/photo-1512496011212-721d80bc6461?auto=format&fit=crop&w=600&q=80', tag: '国风', subCategory: '国潮', borderColor: 'border-slate-800' },
  { id: 'm7', name: '泰式落日妆', description: '浓郁色彩碰撞出的野性美', image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80', subCategory: '度假', borderColor: 'border-accent-orange' },
  { id: 'm8', name: '哥特暗黑系', description: '深邃眼神与冷淡风格的交织', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80', subCategory: '艺术', borderColor: 'border-slate-900' },
  { id: 'm3', name: '赛博闪烁', description: '数字时代的流光溢彩', image: 'https://images.unsplash.com/photo-1512496011212-721d80bc6461?auto=format&fit=crop&w=600&q=80', subCategory: '艺术', borderColor: 'border-accent-cyan' },
];

export const ACCESSORY_CATEGORIES: AccessoryCategory[] = [
  { id: 'ac1', name: '包', type: 'bag', description: '手拎包、单肩包或质感挎包', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' },
  { id: 'ac2', name: '球拍', type: 'racket', description: '网球拍或羽毛球拍专业装备', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?auto=format&fit=crop&w=600&q=80' },
  { id: 'ac3', name: '手链', type: 'bracelet', description: '金属、编织或极简手腕饰品', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80' },
  { id: 'ac4', name: '手表', type: 'watch', description: '商务、运动或休闲风格腕表', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { id: 'ac5', name: '运动挎包', type: 'sports_bag', description: '大容量帆布或功能性运动包', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
  { id: 'ac6', name: '项链', type: 'necklace', description: '锁骨链、长链或装饰挂坠', image: 'https://images.unsplash.com/photo-1599643478123-53d040789260?auto=format&fit=crop&w=600&q=80' },
  { id: 'ac7', name: '耳环', type: 'earring', description: '耳钉、耳坠或流苏耳饰', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
];

export const SCENES: StyleOption[] = [
  { id: 's1', name: '都市极简', description: '混凝土森林中的宁静瞬间', image: 'https://images.unsplash.com/photo-1449156059431-787c5b7adc7e?auto=format&fit=crop&w=800&q=80', tag: '城市', subCategory: '户外', borderColor: 'border-accent-cyan' },
  { id: 's2', name: '艺术画廊', description: '置身于光影交织的展厅', image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=800&q=80', tag: '艺术', subCategory: '室内', borderColor: 'border-accent-pink' },
  { id: 's3', name: '巴黎街头', description: '浪漫与时尚的交织点', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', tag: '旅行', subCategory: '户外', borderColor: 'border-accent-orange' },
  { id: 's4', name: '未来实验室', description: '赛博世界的冰冷美学', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80', tag: '赛博', subCategory: '室内', borderColor: 'border-accent-pink' },
  { id: 's5', name: '豪华晚宴', description: '流光溢彩的社交巅峰', image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80', tag: '正式', subCategory: '室内', borderColor: 'border-primary' },
];

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  { id: 'l1', title: '春季莫兰迪色系通勤方案', type: 'merchant', author: 'UNIQLO 官方', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', tags: ['简约', '职场', '莫兰迪'] },
  { id: 'l2', title: '高街黑白对比造型', type: 'blogger', author: '@FashionHunter', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', tags: ['极简', '潮流', '黑白'] },
  { id: 'l3', title: '轻量化户外徒步穿搭', type: 'merchant', author: '始祖鸟 Arc\'teryx', image: 'https://images.unsplash.com/photo-1523381235312-8388ec71426f?auto=format&fit=crop&w=800&q=80', tags: ['山系', '机能', '专业'] },
  { id: 'l4', title: '法式慵懒周末随性风', type: 'blogger', author: '@ParisVibe', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', tags: ['法式', '慵懒', '生活'] },
  { id: 'l5', title: '新中式茶系少年', type: 'merchant', author: '意树 官方', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=800&q=80', tags: ['国潮', '禅意', '男士'] },
  { id: 'l6', title: '美式复古校园橄榄球夹克', type: 'blogger', author: '@Vintager', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80', tags: ['Vibe', '校园', '复古'] },
];
