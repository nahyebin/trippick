"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";
import { translations } from "@/data/translations";

const languages = [
    { code: "KO", label: "한국어" },
    { code: "EN", label: "English" },
    { code: "JA", label: "日本語" },
    { code: "ZH", label: "中文" }
];

export default function Header() {

    const [isOpen, setIsOpen] = useState(false);

    // Zustand에서 현재 선택 언어 가져오기
    const { language, setLanguage } = useFilterStore();
    const t = translations[language];

    // 현재 선택된 언어를 제외한 나머지만 메뉴에 표시
    const filteredLanguages = languages.filter((item) => {
        return item.code !== language;
    });

    // 현재 선택된 언어 정보 찾기
    const currentLanguage = languages.find((item) => {
        return item.code === language;
    });

    return (
        <header className={styles.header}>
            <div className={styles.inner}>

                <Link href="/" className={styles.logo}>
                    Trip<span>Pick</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/">{t.explore}</Link>
                    <Link href="/my-trips">{t.myTrips}</Link>
                </nav>

                <div className={styles.language}>
                    <button
                        className={styles.languageButton}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {currentLanguage?.label} ▾
                    </button>

                    {isOpen && (
                        <div className={styles.languageMenu}>
                            {filteredLanguages.map((item) => (
                                <button
                                    key={item.code}
                                    onClick={() => {
                                        setLanguage(item.code);
                                        setIsOpen(false);
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}