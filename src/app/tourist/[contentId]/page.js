"use client";
import styles from "./page.module.css";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTouristDetail } from "@/api/api";

export default function TouristDetailPage() {
    const { contentId } = useParams();

    const [tourist, setTourist] = useState(null);

    useEffect(() => {
        const fetchTouristDetail = async () => {
            const data = await getTouristDetail(contentId);

            const items = data.response.body.items?.item || [];
            const item = Array.isArray(items) ? items[0] : items;

            setTourist(item);
        };

        fetchTouristDetail();
    }, [contentId]);

    if (!tourist) {
        return <p>관광지 정보를 불러오는 중입니다...</p>;
    }

    return (
        <main className={styles.main}>
            <div className={styles.detailContainer}>
                <img
                    className={styles.detailImage}
                    src={tourist.firstimage || "/no-image.png"}
                    alt={tourist.title || "관광지 이미지"}
                />

                <div className={styles.detailContent}>
                    <h1>{tourist.title || "관광지 정보"}</h1>

                    {tourist.addr1 && (
                        <p className={styles.address}>
                            📍 {tourist.addr1}
                        </p>
                    )}

                    <div className={styles.overview}>
                        {tourist.overview ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: tourist.overview,
                                }}
                            />
                        ) : (
                            <p>등록된 소개 정보가 없습니다.</p>
                        )}
                    </div>

                    <button className={styles.saveButton}>
                        ♥ 저장
                    </button>
                </div>
            </div>
        </main>
    );
}