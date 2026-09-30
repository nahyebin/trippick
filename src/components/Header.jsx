"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useState } from "react";

const languages = [
    { code: "KO", label: "한국어"},
    { code: "EN", label: "English"},
    { code: "JA", label: "日本語"},
    { code: "ZH", label: "中文"}
]

export default function Header() {

    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState(languages[0]);

    const filteredLanguages = languages.filter((item) => {
        return item.code !== language.code;
    });

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>TripPick</Link>

                <nav className={styles.nav}>
                    <Link href="/">관광지 탐색</Link>
                    <Link href="/my-trips">내 여행 리스트</Link>
                </nav>

                <div className={styles.language}>
                    <button
                        className={styles.languageButton}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                    {language.label} ▾
                    </button>

                    {isOpen && (
                        <div className={styles.languageMenu}>

                            {filteredLanguages.map((item) => (
                                <button 
                                key={item.code} 
                                onClick={() => {
                                    setLanguage(item);
                                    setIsOpen(false);
                                    }}>
                                    {item.label}
                                </button>
                            ))}
                        </div>   
                    )}
                </div>
            </div>
        </header>
    )
}