"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TopTagList from "@/app/components/TopTagList";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useCityStore } from "@/app/stores/useCityStore";
import TourCard from "@/app/(anon)/cities/[id]/components/TourCard";
import ChatButton from "@/app/(anon)/cities/[id]/components/ChatButton";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useGetCurrentCityTours } from "@/app/hooks/useGetCurrentCityTours";
import { SigunguDropdown } from "./components/SigunguDropdown";
import { TourListItem } from "@/backend/domain/entities/TourListItem";
import { 
  TOUR_TABS, 
  TourTab, 
  TOUR_TAB_CONFIG, 
  ALL_TOUR_TABS 
} from "@/app/constants/tourTabs";
import styles from "./page.module.css";

export default function DetailPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const params = useParams();
  const cityId = Number(params.id);

  const getCityById = useCityStore((state) => state.getCityById);
  const currentCity = getCityById(cityId);

  const [activeTab, setActiveTab] = useState<TourTab>(TOUR_TABS.TOUR);
  const [sigunguCode, setSigunguCode] = useState<string>();

  const {
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useGetCurrentCityTours(String(cityId), activeTab, sigunguCode);

  const tourList: TourListItem[] = data?.items ?? [];
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <SharedPageLayout title="로딩 중..." imgUrl="">
        <div className={styles.loadingContainer}>
          <LoadingSpinner size={10} />
        </div>
      </SharedPageLayout>
    );
  }

  return (
    <SharedPageLayout title={currentCity?.name || ""} imgUrl={currentCity?.image}>
      {currentCity ? (
        <div className={styles.container}>
          <section className={styles.section}>
            <header className={styles.header}>
              <div className={styles.chatButton}>
                <ChatButton cityId={cityId} />
              </div>
              <div className={styles.description}>
                {currentCity.description}
              </div>
            </header>
            <div className={styles.mainContainer}>
              {/* 인기 태그 목록 */}
              <div className={styles.tagsWrapper}>
                <TopTagList roomId={cityId} />
              </div>

              {/* 메인 콘텐츠: 투어 리스트 */}
              <div className={styles.mainContent}>
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
            </div>
          </section>
        </div>
      ) : (
        <LoadingSpinner size={15} />
      )}
    </SharedPageLayout>
  );
}
