"use client";
import styles from "./page.module.css";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTouristDetail, saveFavorite, getFavorites, deleteFavorite } from "@/api/api";
import { translations } from "@/data/translations";
import { useFilterStore } from "@/store/filterStore";

export default function TouristDetailPage() {
    const { contentId } = useParams();
    const router = useRouter();

    const [tourist, setTourist] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const { language } = useFilterStore();
    const t = translations[language];

    useEffect(() => {
        const fetchTouristDetail = async () => {
            const data = await getTouristDetail(contentId);

            const items = data.response.body.items?.item || [];
            const item = Array.isArray(items) ? items[0] : items;

            setTourist(item);
        };

        fetchTouristDetail();
    }, [contentId]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const data = await getFavorites();
            setFavorites(data);
        };

        fetchFavorites();
    }, []);




    const handleSave = async () => {
        try {
            const savedFavorite = favorites.find(
                (favorite) =>
                    String(favorite.contentId) ===
                    String(tourist.contentid)
            );

            // 이미 저장되어 있으면 → 저장 취소
            if (savedFavorite) {
                await deleteFavorite(savedFavorite.id);

                setFavorites((prev) =>
                    prev.filter(
                        (favorite) =>
                            favorite.id !== savedFavorite.id
                    )
                );

                return;
            }

            // 저장되어 있지 않으면 → 저장
            const result = await saveFavorite(tourist);

            setFavorites((prev) => [
                ...prev,
                result.data
            ]);

        } catch (error) {
            console.error("저장 처리 실패:", error);
            alert("저장 처리에 실패했습니다.");
        }
    };

    if (!tourist) {
        return <p>{t.loading}</p>;
    }



    const isSaved = favorites.some(
        (favorite) =>
            String(favorite.contentId) ===
            String(tourist.contentid)
    );

    return (
        <main className={styles.main}>
            <div className={styles.detailContainer}>
                <button
                    className={styles.backButton}
                    onClick={() => router.back()}
                >
                    {t.back}
                </button>
                <img
                    className={styles.detailImage}
                    src={tourist.firstimage || "/no-image.png"}
                    alt={tourist.title || t.touristImage}
                />

                <div className={styles.detailContent}>
                    <h1>{tourist.title || t.touristInfo}</h1>

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
                            <p>{t.noOverview}</p>
                        )}
                    </div>

                    <button
                        className={`${styles.saveButton} ${isSaved ? styles.savedButton : ""
                            }`}
                        onClick={handleSave}
                    >
                        {isSaved ? t.saved : t.save}
                    </button>
                </div>
            </div>
        </main>
    );
}