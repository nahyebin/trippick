"use client"

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getTouristSpots } from "@/api/api";

export default function Home() {

  const [touristSpots, setTouristSpots] = useState([]);

  useEffect(() => {
    const fetchTouristSpots = async () => {
      const data = await getTouristSpots();

      const { item } = data.response.body.items;

      setTouristSpots(item);
    };
    fetchTouristSpots();
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>지금, 한국을 여행해보세요</h1>
        <p>가고 싶은 여행지를 찾아 나만의 여행 리스트를 만들어보세요.</p>

        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔎</span>
          <input
            type="text"
            placeholder="관광지역을 검색해보세요."
          />
          <button className={styles.searchButton}>검색</button>
        </div>
      </section>

      <section className={styles.destinationSection}>
        <div className={styles.sectionHeader}>
          <h2>추천 관광지</h2>
          <p>한국의 다양한 관광지를 만나보세요.</p>
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
          {touristSpots.map((spot) => (
            <article key={spot.contentid} className={styles.card}>
              <div className={styles.cardImage}>
                <img src={spot.firstimage ? spot.firstimage : "/no-image.png"} alt={spot.title}/>
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
          }
        </div>
      </section>


    </main>
  );
}
