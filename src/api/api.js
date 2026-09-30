const SERVICE_KEY = process.env.NEXT_PUBLIC_TOUR_API_KEY;
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

export async function getTouristSpots() {

    const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        pageNo: "1",
        numOfRows: "3",
        MobileOS: "ETC",
        MobileApp: "TripPick",
        _type: "json",
        arrange: "A",
    });

    const url = `${BASE_URL}/areaBasedList2?${params.toString()}`;

    const response = await fetch(url); //url주소로 관광지 데이터 주세요 요청!
    const data = await response.json(); // =response의 body를 읽어서 JSON내용을 JavaScript 객체로 변환해줘

    console.log(data);

    return data;
}