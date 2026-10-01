"use client";
import styles from "./page.module.css";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTouristDetail, saveFavorite } from "@/api/api";


export default function TouristDetailPage() {
    const { contentId } = useParams();
    const router = useRouter();

    const [tourist, setTourist] = useState(null);

    const handleSave = async () => {
        try {
            const result = await saveFavorite(tourist);

            if (result.alreadySaved) {
                alert("이미 저장된 관광지입니다!");
                return;
            }

            alert("나의 여행 리스트에 저장했습니다!");
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장에 실패했습니다.");
        }
    };

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
                <button
                    className={styles.backButton}
                    onClick={() => router.back()}
                >
                    ← 목록으로 돌아가기
                </button>
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

                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                    >
                        ♥ 저장
                    </button>
                </div>
            </div>
        </main>
    );
}