"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, updateFavoriteStatus, deleteFavorite, saveMemo, getMemos, updateMemo, deleteMemo } from "@/api/api";
import styles from "./page.module.css";

export default function MyTripsPage() {
    const [favorites, setFavorites] = useState([]);
    const [memos, setMemos] = useState([]);
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [memoText, setMemoText] = useState("");
    const [selectedContentId, setSelectedContentId] = useState(null);
    const [editingMemoId, setEditingMemoId] = useState(null);

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
    const handleDelete = async (id) => {
        await deleteFavorite(id);

        setFavorites((prev) =>
            prev.filter((favorite) => favorite.id !== id)
        );
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

    const handleDeleteMemo = async (id) => {
        const isConfirmed = confirm("메모를 삭제하시겠습니까?");

        if (!isConfirmed) {
            return;
        }

        await deleteMemo(id);

        setMemos((prev) =>
            prev.filter((memo) => memo.id !== id)
        );
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
            alert("메모를 입력해주세요.");
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

                            {favorite.status === "visited" && (
                                <div className={styles.memoArea}>
                                    {memos
                                        .filter(
                                            (memo) =>
                                                String(memo.contentId) ===
                                                String(favorite.contentId)
                                        )
                                        .map((memo) => (
                                            <div
                                                key={memo.id}
                                                className={styles.memoItem}
                                            >
                                                <p className={styles.memo}>
                                                    📝 {memo.memo}
                                                </p>

                                                <div className={styles.memoActions}>
                                                    <button
                                                        className={styles.editMemoButton}
                                                        onClick={() => handleEditMemo(memo)}
                                                    >
                                                        수정
                                                    </button>

                                                    <button
                                                        className={styles.deleteMemoButton}
                                                        onClick={() => handleDeleteMemo(memo.id)}
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

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
                                                handleOpenMemoModal(favorite.contentId)
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
                            {editingMemoId ? "방문 메모 수정" : "방문 메모 추가"}
                        </h2>

                        <p className={styles.modalDescription}>
                            여행에서 기억하고 싶은 내용을 남겨보세요.
                        </p>

                        <textarea
                            className={styles.memoTextarea}
                            placeholder="방문 후기를 입력해주세요."
                            value={memoText}
                            onChange={(e) => setMemoText(e.target.value)}
                        />

                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCloseMemoModal}
                            >
                                취소
                            </button>

                            <button
                                className={styles.modalSaveButton}
                                onClick={handleSaveMemo}
                            >
                                {editingMemoId ? "수정" : "저장"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}