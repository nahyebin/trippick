"use client"

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getTouristSpots, searchTouristSpots } from "@/api/api";

export default function Home() {

  const [touristSpots, setTouristSpots] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [keyword, setKeyword] = useState(""); //검색창에 현재 입력중인 값
  const [isSearch, setIsSearch] = useState(false);
  const [searchedKeyword, setSearchedKeyword] = useState(""); // 마지막으로 실제 검색한 값
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchTouristSpots = async () => {
      const data = await getTouristSpots(1, 3);

      const { item } = data.response.body.items;

      setTouristSpots(item);
    };
    fetchTouristSpots();
  }, []);

  const handleLoadMore = async () => {

    if (isSearch) {
      const data = await searchTouristSpots(searchedKeyword, pageNo + 1, 3);
      const { item } = data.response.body.items;

      const data2 = await searchTouristSpots(searchedKeyword, pageNo + 2, 3);
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

    } else {
      const data = await getTouristSpots(pageNo + 1, 3);
      const { item } = data.response.body.items;

      const data2 = await getTouristSpots(pageNo + 2, 3);
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
    }
  };

  const handleSearch = async () => {
    const data = await searchTouristSpots(keyword, 1, 3);
    console.log(data);
    const { item } = data.response.body.items;

    setTouristSpots(item || []);
    setIsSearch(true);
    setSearchedKeyword(keyword);
    setPageNo(1);
    setHasMore(true);
  };


  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>지금, 한국을 여행해보세요</h1>
        <p>가고 싶은 여행지를 찾아 나만의 여행 리스트를 만들어보세요.</p>

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
            placeholder="관광지역을 검색해보세요."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>검색</button>
        </form>
      </section>

      <section className={styles.destinationSection}>
        <div className={styles.sectionHeader}>
          <h2>
            {isSearch ? `"${searchedKeyword}" 검색 결과` : "추천 관광지"}
          </h2>
          <p>
            {!isSearch && "한국의 다양한 관광지를 만나보세요."}
          </p>
        </div>

        <section className={styles.filters}>
          <button className={styles.filterButton}>
            <span>📍</span>
            <span>전체 지역</span>
            <span>▾</span>
          </button>

          <button className={styles.filterButton}>
            <span>🏛️</span>
            <span>전체 관광 유형</span>
            <span>▾</span>
          </button>

          <button className={styles.resetButton}>
            ↻ 필터 초기화
          </button>
        </section>

        <div className={styles.destinationGrid}>
          {touristSpots.length === 0 ? (
            <p>검색 결과가 없습니다.</p>

          ) : (

            touristSpots.map((spot) => (
              <article key={spot.contentid} className={styles.card} >
                <div className={styles.cardImage}>
                  <img src={spot.firstimage ? spot.firstimage : "/no-image.png"} alt={spot.title} />
                </div>

                <div className={styles.cardContent}>
                  <h3>{spot.title}</h3>
                  <p>📍 {spot.addr1}</p>

                  <button className={styles.saveButton}>
                    ♥️ 저장
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {hasMore && touristSpots.length > 0 && (
          <button onClick={handleLoadMore} className={styles.moreButton}>
            관광지 더 둘러보기
          </button>
        )}
      </section>


    </main >
  );
}
