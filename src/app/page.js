"use client"

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getAreaCodes, getTouristSpots, searchTouristSpots, saveFavorite, getFavorites, deleteFavorite } from "@/api/api";
import { useFilterStore } from "@/store/filterStore";
import Link from "next/link";
import { translations } from "@/data/translations";

const TOUR_TYPES = [
  { id: "12", name: "관광지" },
  { id: "14", name: "문화시설" },
  { id: "15", name: "축제·공연·행사" },
  { id: "25", name: "여행코스" },
  { id: "28", name: "레포츠" },
  { id: "32", name: "숙박" },
  { id: "38", name: "쇼핑" },
  { id: "39", name: "음식점" },
];

const AREA_NAMES = {
  "1": "서울",
  "2": "인천",
  "3": "대전",
  "4": "대구",
  "5": "광주",
  "6": "부산",
  "7": "울산",
  "8": "세종",
  "31": "경기",
  "32": "강원",
  "33": "충북",
  "34": "충남",
  "35": "경북",
  "36": "경남",
  "37": "전북",
  "38": "전남",
  "39": "제주",
};

export default function Home() {

  const [touristSpots, setTouristSpots] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [keyword, setKeyword] = useState(""); //검색창에 현재 입력중인 값
  const [isSearch, setIsSearch] = useState(false);
  const [searchedKeyword, setSearchedKeyword] = useState(""); // 마지막으로 실제 검색한 값
  const [hasMore, setHasMore] = useState(true);
  const [areas, setAreas] = useState([]);
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const { selectedArea, setSelectedArea } = useFilterStore();
  const { selectedType, setSelectedType } = useFilterStore();
  const { language } = useFilterStore();
  const t = translations[language];

  useEffect(() => {
    const fetchTouristSpots = async () => {

      // 검색한 상태라면
      if (isSearch) {
        console.log("프론트 필터링 실행");

        const filtered = filterSearchResults(
          selectedArea,
          selectedType
        );

        console.log("원본 검색 결과:", searchResults);
        console.log("필터링 결과:", filtered);

        setTouristSpots(filtered.slice(0, 3));
        setPageNo(1);
        setHasMore(filtered.length > 3);

        return; // ⭐ 여기서 끝! API 요청하면 안 됨
      }

      // ⭐ 검색하지 않은 상태에서만 API 요청
      console.log("관광지 둘러보기 API 필터링 실행");
      const data = await getTouristSpots(
        1,
        3,
        selectedArea?.code,
        selectedType?.id
      );

      const { item } = data.response.body.items;

      setTouristSpots(item || []);
      setPageNo(1);
      setHasMore(true);
    };
    fetchTouristSpots();
  }, [selectedArea, selectedType]);

  useEffect(() => {
    const fetchAreaCodes = async () => {
      const data = await getAreaCodes();

      const { item } = data.response.body.items;

      setAreas(item);

    }
    fetchAreaCodes();
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavorites();
      setFavorites(data);
    };

    fetchFavorites();
  }, []);

  const handleLoadMore = async () => {
    if (isSearch) {

      // 현재 선택된 필터를 검색 원본에 다시 적용
      const filtered = filterSearchResults(
        selectedArea,
        selectedType
      );

      // 현재 화면에 보이는 개수 + 6개
      const nextCount = touristSpots.length + 6;

      // 필터링 결과에서 nextCount만큼 보여주기
      setTouristSpots(filtered.slice(0, nextCount));

      // 전부 보여줬으면 더보기 버튼 숨기기
      if (nextCount >= filtered.length) {
        setHasMore(false);
      }

      return;
    }

    // ↓↓↓ 검색하지 않았을 때는 기존 API 더보기 코드 그대로 ↓↓↓

    const data = await getTouristSpots(
      pageNo + 1,
      3,
      selectedArea?.code,
      selectedType?.id
    );

    const { item } = data.response.body.items;

    const data2 = await getTouristSpots(
      pageNo + 2,
      3,
      selectedArea?.code,
      selectedType?.id
    );

    const { item: item2 } = data2.response.body.items;

    const items1 = item || [];
    const items2 = item2 || [];

    if (items1.length + items2.length < 6) {
      setHasMore(false);
    }

    setTouristSpots([
      ...touristSpots,
      ...items1,
      ...items2
    ]);

    setPageNo(pageNo + 2);
  };

  const handleSearch = async () => {
    const data = await searchTouristSpots(keyword, 1, 100);

    const { item } = data.response.body.items;
    const results = item || [];

    // 새로운 검색이므로 기존 필터 초기화
    setSelectedArea(null);
    setSelectedType(null);

    // 검색 원본 저장
    setSearchResults(results);

    // 처음 3개만 화면에 표시
    setTouristSpots(results.slice(0, 3));

    setIsSearch(true);
    setSearchedKeyword(keyword);
    setPageNo(1);
    setHasMore(results.length > 3);
  };

  const handleSave = async (spot) => {
    try {
      const savedFavorite = favorites.find(
        (favorite) =>
          String(favorite.contentId) === String(spot.contentid)
      );

      // 이미 저장되어 있으면 → 삭제
      if (savedFavorite) {
        await deleteFavorite(savedFavorite.id);

        setFavorites((prev) =>
          prev.filter(
            (favorite) => favorite.id !== savedFavorite.id
          )
        );

        return;
      }

      // 저장되어 있지 않으면 → 저장
      const result = await saveFavorite(spot);

      setFavorites((prev) => [
        ...prev,
        result.data
      ]);

    } catch (error) {
      console.error("저장 처리 실패:", error);
      alert("저장 처리에 실패했습니다.");
    }
  };

  const filterSearchResults = (area, type) => {
    let filtered = searchResults;

    // 지역이 선택되어 있으면 지역 필터링
    if (area) {
      filtered = filtered.filter((spot) => {
        // areacode가 있는 데이터
        if (spot.areacode) {
          return String(spot.areacode) === String(area.code);
        }
        // areacode가 없는 데이터 → 주소로 확인
        const areaName = AREA_NAMES[String(area.code)];

        return spot.addr1?.startsWith(areaName);
      });
    }

    if (type) {
      filtered = filtered.filter((spot) => {
        return String(spot.contenttypeid) === String(type.id);
      })
    };

    return filtered;

  };

  const handleResetFilters = () => {
    setSelectedArea(null);
    setSelectedType(null);
    setIsAreaOpen(false);
    setIsTypeOpen(false);
  };


  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroDescription}</p>

        <form
          className={styles.searchBox}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <span className={styles.searchIcon}>🔎</span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button type="submit" className={styles.searchButton}>
            {t.search}
          </button>
        </form>
      </section>

      <section className={styles.destinationSection}>
        <div className={styles.sectionHeader}>
          <h2>
            {isSearch
              ? `"${searchedKeyword}" ${t.searchResult}`
              : t.exploreTitle}
          </h2>

          <p>
            {!isSearch && t.exploreDescription}
          </p>
        </div>

        <section className={styles.filters}>
          <div className={styles.filterWrapper}>
            <button onClick={() => setIsAreaOpen(!isAreaOpen)} className={styles.filterButton}>
              <span>📍</span>
              <span>
                {selectedArea ? selectedArea.name : t.allAreas}
              </span>
              <span>▾</span>
            </button>

            {isAreaOpen && (
              <div className={styles.filterDropdown}>
                <button onClick={() => {
                  setSelectedArea(null);
                  setIsAreaOpen(false);
                }}>
                  {t.allAreas}</button>
                {areas.map((area) => (
                  <button
                    key={area.code}
                    onClick={() => {
                      setSelectedArea(area);
                      setIsAreaOpen(false);
                    }}>
                    {area.name}
                  </button>
                ))}

              </div>
            )}
          </div>

          <div className={styles.filterWrapper}>
            <button onClick={() => setIsTypeOpen(!isTypeOpen)} className={styles.filterButton}>
              <span>🏛️</span>
              <span>
                {selectedType ? selectedType.name : t.allTypes}
              </span>
              <span>▾</span>
            </button>

            {isTypeOpen && (
              <div className={styles.filterDropdown}>
                <button onClick={() => {
                  setSelectedType(null);
                  setIsTypeOpen(false);
                }}>
                  {t.allTypes}
                </button>
                {TOUR_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type)
                      setIsTypeOpen(false)
                    }}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={styles.resetButton}
            onClick={handleResetFilters}
          >
            ↻ {t.reset}
          </button>
        </section>


        <div className={styles.destinationGrid}>
          {touristSpots.length === 0 ? (
            <p>{t.noResults}</p>
          ) : (
            touristSpots.map((spot) => {
              const isSaved = favorites.some(
                (favorite) =>
                  String(favorite.contentId) === String(spot.contentid)
              );

              return (
                <article key={spot.contentid} className={styles.card}>
                  <Link
                    href={`/tourist/${spot.contentid}`}
                    className={styles.cardLink}
                  >
                    <div className={styles.cardImage}>
                      <img
                        src={spot.firstimage ? spot.firstimage : "/no-image.png"}
                        alt={spot.title}
                      />
                    </div>

                    <div className={styles.cardContent}>
                      <h3>{spot.title}</h3>
                      <p>📍 {spot.addr1}</p>
                    </div>
                  </Link>

                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.saveButton} ${isSaved ? styles.savedButton : ""
                        }`}
                      onClick={() => handleSave(spot)}
                    >
                      {isSaved ? t.saved : t.save}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {hasMore && touristSpots.length > 0 && (
          <button onClick={handleLoadMore} className={styles.moreButton}>
            {t.loadMore}
          </button>
        )}
      </section>


    </main >
  );
}
