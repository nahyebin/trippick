"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { useFilterStore } from "@/store/filterStore";
import { translations } from "@/data/translations";

export default function Footer() {

    const { language } = useFilterStore();
    const t = translations[language];

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.info}>
                    <h2 className={styles.logo}>TripPick</h2>

                    <p className={styles.description}>
                        {t.footerDescription}
                    </p>
                </div>

                <nav className={styles.nav}>
                    <Link href="/">{t.explore}</Link>
                    <Link href="/my-trips">{t.myTrips}</Link>
                </nav>

                <div className={styles.bottom}>
                    <p>{t.dataSource}</p>
                    <p>© 2026 TripPick. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}