"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, updateFavoriteStatus, deleteFavorite, saveMemo, getMemos, updateMemo, deleteMemo } from "@/api/api";
import styles from "./page.module.css";
import { translations } from "@/data/translations";
import { useFilterStore } from "@/store/filterStore";

export default function MyTripsPage() {
    const [favorites, setFavorites] = useState([]);
    const [memos, setMemos] = useState([]);
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [memoText, setMemoText] = useState("");
    const [selectedContentId, setSelectedContentId] = useState(null);
    const [editingMemoId, setEditingMemoId] = useState(null);
    const [deleteMemoId, setDeleteMemoId] = useState(null);
    const [deleteFavoriteId, setDeleteFavoriteId] = useState(null);

    const { language } = useFilterStore();
    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            const favoritesData = await getFavorites();
            const memosData = await getMemos();

            setFavorites(favoritesData);
            setMemos(memosData);
        };

        fetchData();
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
    const handleDelete = (id) => {
        setDeleteFavoriteId(id);
    };

    const handleConfirmDeleteFavorite = async () => {
        await deleteFavorite(deleteFavoriteId);

        setFavorites((prev) =>
            prev.filter(
                (favorite) => favorite.id !== deleteFavoriteId
            )
        );

        setDeleteFavoriteId(null);
    };

    // 메모 모달 열기
    const handleOpenMemoModal = (contentId) => {
        setSelectedContentId(contentId);
        setMemoText("");
        setEditingMemoId(null);
        setIsMemoModalOpen(true);
    };

    const handleEditMemo = (memo) => {
        setEditingMemoId(memo.id);
        setSelectedContentId(memo.contentId);
        setMemoText(memo.memo);
        setIsMemoModalOpen(true);
    };

    const handleDeleteMemo = (id) => {
        setDeleteMemoId(id);
    };

    const handleConfirmDeleteMemo = async () => {
        await deleteMemo(deleteMemoId);

        setMemos((prev) =>
            prev.filter((memo) => memo.id !== deleteMemoId)
        );

        setDeleteMemoId(null);
    };


    // 메모 모달 닫기
    const handleCloseMemoModal = () => {
        setIsMemoModalOpen(false);
        setMemoText("");
        setSelectedContentId(null);
        setEditingMemoId(null);
    };


    // 메모 저장
    const handleSaveMemo = async () => {
        if (!memoText.trim()) {
            alert(t.memoRequired);
            return;
        }

        // 기존 메모 수정
        if (editingMemoId) {
            const updatedMemo = await updateMemo(
                editingMemoId,
                memoText
            );

            setMemos((prev) =>
                prev.map((memo) =>
                    memo.id === editingMemoId
                        ? updatedMemo
                        : memo
                )
            );
        }

        // 새 메모 추가
        else {
            const newMemo = await saveMemo(
                selectedContentId,
                memoText
            );

            setMemos((prev) => [
                ...prev,
                newMemo
            ]);
        }

        handleCloseMemoModal();
    };

    return (
        <main className={styles.main}>
            <div className={styles.titleArea}>
                <h1>{t.myTripsTitle}</h1>
                <p>{t.myTripsDescription}</p>
            </div>

            {favorites.length === 0 ? (
                <div className={styles.empty}>
                    <p>{t.emptyTrips}</p>

                    <Link href="/">
                        {t.exploreTrips}
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

                            {favorite.status === "visited" && (
                                <div className={styles.memoArea}>
                                    {memos.some(
                                        (memo) =>
                                            String(memo.contentId) === String(favorite.contentId)
                                    ) ? (
                                        memos
                                            .filter(
                                                (memo) =>
                                                    String(memo.contentId) === String(favorite.contentId)
                                            )
                                            .map((memo) => (
                                                <div key={memo.id} className={styles.memoItem}>
                                                    <p className={styles.memo}>{memo.memo}</p>

                                                    <div className={styles.memoActions}>
                                                        <button
                                                            className={styles.editMemoButton}
                                                            onClick={() => handleEditMemo(memo)}
                                                        >
                                                            {t.edit}
                                                        </button>

                                                        <button
                                                            className={styles.deleteMemoButton}
                                                            onClick={() => handleDeleteMemo(memo.id)}
                                                        >
                                                            {t.delete}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <p className={styles.emptyMemo}>
                                            {t.memoGuide}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className={styles.cardBottom}>
                                <select
                                    className={`${styles.statusSelect} ${favorite.status === "visited"
                                        ? styles.visitedStatus
                                        : styles.plannedStatus
                                        }`}
                                    value={favorite.status}
                                    onChange={(e) =>
                                        handleStatusChange(favorite.id, e.target.value)
                                    }
                                >
                                    <option value="planned">{t.planned}</option>
                                    <option value="visited">{t.visited}</option>
                                </select>

                                <div className={styles.cardActions}>
                                    {favorite.status === "visited" && (
                                        <button
                                            className={styles.memoButton}
                                            onClick={() =>
                                                handleOpenMemoModal(favorite.contentId)
                                            }
                                        >
                                            {t.memoAdd}
                                        </button>
                                    )}

                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(favorite.id)}
                                    >
                                        {t.delete}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            {isMemoModalOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={handleCloseMemoModal}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>
                            {editingMemoId ? t.memoEditTitle : t.memoAddTitle}
                        </h2>

                        <p className={styles.modalDescription}>
                            {t.memoDescription}
                        </p>

                        <textarea
                            className={styles.memoTextarea}
                            placeholder={t.memoPlaceholder}
                            value={memoText}
                            onChange={(e) => setMemoText(e.target.value)}
                        />

                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCloseMemoModal}
                            >
                                {t.cancel}
                            </button>

                            <button
                                className={styles.modalSaveButton}
                                onClick={handleSaveMemo}
                            >
                                {editingMemoId ? t.edit : t.memoSave}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* 메모 삭제 확인 모달 */}
            {deleteMemoId !== null && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setDeleteMemoId(null)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{t.memoDeleteTitle}</h2>

                        <p className={styles.modalDescription}>
                            {t.memoDeleteDescription}
                        </p>

                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setDeleteMemoId(null)}
                            >
                                {t.cancel}
                            </button>

                            <button
                                className={styles.modalDeleteButton}
                                onClick={handleConfirmDeleteMemo}
                            >
                                {t.delete}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* 여행지 삭제 확인 모달 */}
            {deleteFavoriteId !== null && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setDeleteFavoriteId(null)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{t.favoriteDeleteTitle}</h2>

                        <p className={styles.modalDescription}>
                            {t.favoriteDeleteDescription}
                        </p>

                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setDeleteFavoriteId(null)}
                            >
                                {t.cancel}
                            </button>

                            <button
                                className={styles.modalDeleteButton}
                                onClick={handleConfirmDeleteFavorite}
                            >
                                {t.delete}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}