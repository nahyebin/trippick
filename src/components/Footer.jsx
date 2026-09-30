import Link from "next/link";
import styles from "./Footer.module.css"

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.info}>
                    <h2 className={styles.logo}>TripPick</h2>
                    <p className={styles.description}>한국의 관광지를 탐색하고 나만의 여행 리스트를 만들어보세요.</p>
                </div>

                <nav className={styles.nav}>
                    <Link href="/">관광지 탐색</Link>
                    <Link href="/my-trips">내 여행 리스트</Link>
                </nav>

                <div className={styles.bottom}>
                    <p>관광 정보 제공: 한국관광공사 TourAPI</p>
                    <p>© 2026 TripPick. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}