"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, updateFavoriteStatus, deleteFavorite, saveMemo } from "@/api/api";
import styles from "./page.module.css";

export default function MyTripsPage() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const data = await getFavorites();

            setFavorites(data);
        };

        fetchFavorites();
    }, []);

    // 방문 상태 변경
    const handleStatusChange = async (id, status) => {
        await updateFavoriteStatus(id, status);

        setFavorites((prev) =>
            prev.map((favorite) =>
                favorite.id === id
                    ? { ...favorite, status: status }
                    : favorite
            )
        );
    };


    // 저장한 관광지 삭제
    const handleDelete = async (id) => {
        await deleteFavorite(id);

        setFavorites((prev) =>
            prev.filter((favorite) => favorite.id !== id)
        );
    };

    const handleMemo = async (contentId) => {
        const memo = prompt("방문 메모를 입력해주세요.");

        if (!memo) {
            return;
        }

        await saveMemo(contentId, memo);

        alert("메모가 저장되었습니다!");
    };

    return (
        <main className={styles.main}>
            <div className={styles.titleArea}>
                <h1>나의 여행 리스트</h1>
                <p>저장한 관광지를 확인하고 여행 계획을 관리해보세요.</p>
            </div>

            {favorites.length === 0 ? (
                <div className={styles.empty}>
                    <p>아직 저장한 관광지가 없습니다.</p>

                    <Link href="/">
                        관광지 둘러보기
                    </Link>
                </div>
            ) : (
                <div className={styles.tripGrid}>
                    {favorites.map((favorite) => (
                        <article
                            key={favorite.id}
                            className={styles.card}
                        >
                            <Link
                                href={`/tourist/${favorite.contentId}`}
                                className={styles.cardLink}
                            >
                                <img
                                    src={favorite.image || "/no-image.png"}
                                    alt={favorite.title}
                                    className={styles.cardImage}
                                />

                                <div className={styles.cardContent}>
                                    <h2>{favorite.title}</h2>

                                    <p className={styles.address}>
                                        📍 {favorite.addr}
                                    </p>
                                </div>
                            </Link>

                            <div className={styles.cardBottom}>
                                <select
                                    className={styles.statusSelect}
                                    value={favorite.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            favorite.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="planned">방문 예정</option>
                                    <option value="visited">방문 완료</option>
                                </select>

                                <div className={styles.cardActions}>
                                    {favorite.status === "visited" && (
                                        <button
                                            className={styles.memoButton}
                                            onClick={() =>
                                                handleMemo(favorite.contentId)
                                            }
                                        >
                                            메모 추가
                                        </button>
                                    )}

                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(favorite.id)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}