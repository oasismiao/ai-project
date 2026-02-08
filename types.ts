
export enum LabStep {
  HAIRSTYLE = '发型',
  MAKEUP = '妆容',
  WARDROBE = '衣橱混搭',
  ACCESSORIES = '配饰方案',
  SCENE = '场景'
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  image: string;
  tag?: string;
  subCategory?: string;
  borderColor: string;
}

export interface AccessoryCategory {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
}

export interface ExistingItem {
  id: string;
  name: string;
  image: string;
  category: '上衣' | '下装' | '鞋子' | '配饰';
  description: string;
}

export interface BodyData {
  height: string;
  weight: string;
  chest?: string;
  waist?: string;
  hip?: string;
  shoulder?: string;
}

export interface UserPreferences {
  style: string;
  palette: string;
  budget: string;
  stores?: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  faceImage: string | null;
  bodyData: BodyData;
  preferences: UserPreferences;
  timestamp: string;
}

export interface UserSelections {
  gender?: 'male' | 'female';
  hairstyle?: string;
  makeup?: string;
  accessoryCategories?: string[]; 
  scene?: string;
  faceImage?: string;
  oldClothes?: string[]; // IDs of selected existing items from wardrobe
  bodyData?: BodyData;
  preferences?: UserPreferences;
  profileId?: string;
  savedResultImage?: string; // Cache for archived view
}

export type Page = 'profile' | 'lab' | 'archive' | 'result' | 'inspiration' | 'wardrobe';

export interface PriceComparison {
  platform: '淘宝' | '京东' | '天猫';
  price: string;
  url: string;
  isAvailable: boolean;
}

export interface Recommendation {
  id: string;
  name: string;
  category: '上衣' | '下装' | '鞋子' | '配饰' | '化妆品' | '包袋' | '运动装备';
  meta: string;
  price: string;
  priceValue: number;
  image: string;
  source: 'AI-NEW' | 'USER-OWNED';
  comparison: PriceComparison[];
}

export interface SavedOutfit {
  id: string;
  title: string;
  category: string;
  image: string;
  timestamp: string;
  selections: UserSelections;
}

export interface LookbookItem {
  id: string;
  title: string;
  type: 'merchant' | 'blogger';
  image: string;
  author: string;
  tags: string[];
}
