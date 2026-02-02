export const TOUR_TABS = {
  TOUR: "tour",
  FOOD: "food",
  ACCOMMODATION: "accommodation",
  CULTURE: "culture",
  SHOPPING: "shopping",
  PET: "pet",
} as const;

export type TourTab = typeof TOUR_TABS[keyof typeof TOUR_TABS];

// Tab 메타데이터
export const TOUR_TAB_CONFIG: Record<TourTab, {
  label: string;
  contentTypeId?: number;
  emoji?: string;
}> = {
  [TOUR_TABS.TOUR]: {
    label: "관광",
    contentTypeId: 12,
    emoji: "🏛️",
  },
  [TOUR_TABS.FOOD]: {
    label: "맛집",
    contentTypeId: 39,
    emoji: "🍽️",
  },
  [TOUR_TABS.ACCOMMODATION]: {
    label: "숙소",
    contentTypeId: 32,
    emoji: "🏨",
  },
  [TOUR_TABS.CULTURE]: {
    label: "문화생활",
    contentTypeId: 14,
    emoji: "🎭",
  },
  [TOUR_TABS.SHOPPING]: {
    label: "쇼핑",
    contentTypeId: 38,
    emoji: "🛍️",
  },
  [TOUR_TABS.PET]: {
    label: "반려견",
    contentTypeId: undefined,  // Pet API는 contentTypeId 없음
    emoji: "🐕",
  },
};

// 유효성 검증 헬퍼
export const isValidTourTab = (tab: string): tab is TourTab => {
  return Object.values(TOUR_TABS).includes(tab as TourTab);
};

export const getTourTabConfig = (tab: TourTab) => {
  return TOUR_TAB_CONFIG[tab];
};

// 모든 탭 목록 반환
export const ALL_TOUR_TABS = Object.values(TOUR_TABS);
