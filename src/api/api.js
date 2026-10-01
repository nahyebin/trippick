const SERVICE_KEY = process.env.NEXT_PUBLIC_TOUR_API_KEY;
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

export async function getTouristSpots(pageNo, numOfRows, areaCode, contentTypeId) {

    const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        pageNo: pageNo,
        numOfRows: numOfRows,
        MobileOS: "ETC",
        MobileApp: "TripPick",
        _type: "json",
        arrange: "A",
    });

    if (areaCode) {
        params.append("areaCode", areaCode);
    }
    if (contentTypeId) {
        params.append("contentTypeId", contentTypeId);
    }


    const url = `${BASE_URL}/areaBasedList2?${params.toString()}`;

    const response = await fetch(url); //url주소로 관광지 데이터 주세요 요청!
    const data = await response.json(); // =response의 body를 읽어서 JSON내용을 JavaScript 객체로 변환해줘

    console.log(data);

    return data;
}

export async function searchTouristSpots(keyword, pageNo, numOfRows, areaCode, contentTypeId) {

    console.log("=== searchTouristSpots 함수 내부 ===");
    console.log("keyword:", keyword);
    console.log("pageNo:", pageNo);
    console.log("numOfRows:", numOfRows);
    console.log("areaCode:", areaCode);
    console.log("contentTypeId:", contentTypeId);

    const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        keyword: keyword,
        pageNo: pageNo,
        numOfRows: numOfRows,
        MobileOS: "ETC",
        MobileApp: "TripPick",
        _type: "json",
        arrange: "A",
    });

    if (areaCode) {
        params.append("areaCode", areaCode);
    }
    if (contentTypeId) {
        params.append("contentTypeId", contentTypeId);
    }

    const url = `${BASE_URL}/searchKeyword2?${params.toString()}`;
    console.log("검색 API URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

export async function getAreaCodes() {
    const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        numOfRows: 20,
        pageNo: 1,
        MobileOS: "ETC",
        MobileApp: "TripPick",
        _type: "json",
    });

    const url = `${BASE_URL}/areaCode2?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;

}