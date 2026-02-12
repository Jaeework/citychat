import React, { useState } from "react";
import styles from "./CityTourList.module.css";
import { SigunguDropdown } from "./SigunguDropdown";

import { 
  TOUR_TABS, 
  TourTab, 
  TOUR_TAB_CONFIG, 
  ALL_TOUR_TABS 
} from "@/app/constants/tourTabs";
import { useGetCurrentCityTours } from "@/app/hooks/useGetCurrentCityTours";
import { TourListItem } from "@/backend/domain/entities/TourListItem";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TourCard from "./TourCard";

interface CityTourListProps {
  cityId: number;
}

export default function CityTourList ({ cityId }: CityTourListProps) {
  
  const [activeTab, setActiveTab] = useState<TourTab>(TOUR_TABS.TOUR);
  const [sigunguCode, setSigunguCode] = useState<string>();

  const {
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useGetCurrentCityTours(String(cityId), activeTab, sigunguCode, 4);
  
  const tourList: TourListItem[] = data?.items ?? [];
    
  return (
    <div className={styles.tourListContainer}>
      {/* 탭 + 시군구 필터 */}
      <div className={styles.filterContainer}>
        <div className={styles.tabsWrapper}>
          {ALL_TOUR_TABS.map((tab) => {
            const config = TOUR_TAB_CONFIG[tab];
            return (
              <button
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab} ? ${styles.active} : ""}`}
                onClick={() => setActiveTab(tab)}
                disabled={isFetching}
              >
                <div className={styles.tabText}>
                  {config.label}
                </div>
              </button>
            );
          })}
        </div>
        <div className={styles.dropdownWrapper}>
          <SigunguDropdown
            cityId={String(cityId)}
            value={sigunguCode}
            onChange={setSigunguCode}
            disabled={isFetching}
          />
        </div>
      </div>

      {/* 투어 리스트 */}
      <div className={styles.toursWrapper}>
        <div className={styles.toursGrid}>
          {isFetching && tourList.length === 0 ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner size={15} />
            </div>
          ) : tourList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>해당 카테고리에 데이터가 없습니다.</p>
            </div>
          ) : (
            <>
              {tourList.map((item) => (
                <TourCard key={item.contentid} item={item} />
              ))}
              {hasNextPage && (
                <div className={styles.loadMoreContainer}>
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "로딩 중..." : "더 보기"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
