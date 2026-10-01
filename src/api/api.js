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

export async function getTouristDetail(contentId) {
    const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        MobileOS: "ETC",
        MobileApp: "TripPick",
        _type: "json",
        contentId: contentId,
    });

    const url = `${BASE_URL}/detailCommon2?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("상세 API 응답:", data);

    return data;
}

export async function saveFavorite(tourist) {
    // 관광지 ID 가져오기
    const contentId = tourist.contentid || tourist.contentId;

    // 현재 저장된 관광지 목록 가져오기
    const checkResponse = await fetch(
        "http://localhost:4000/favorites"
    );

    const existingFavorites = await checkResponse.json();

    // 같은 관광지가 이미 저장되어 있는지 확인
    const alreadySaved = existingFavorites.some((favorite) => {
        return String(favorite.contentId) === String(contentId);
    });

    // 이미 저장되어 있으면 여기서 함수 종료
    if (alreadySaved) {
        return { alreadySaved: true };
    }

    // 중복이 아니면 새로 저장
    const response = await fetch(
        "http://localhost:4000/favorites",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contentId: contentId,
                title: tourist.title,
                image: tourist.firstimage || tourist.image || "",
                addr: tourist.addr1 || tourist.addr || "",
                status: "planned",
            }),
        }
    );

    const data = await response.json();

    return {
        alreadySaved: false,
        data: data,
    };
}

// 저장한 관광지 목록 조회
export async function getFavorites() {
    const response = await fetch("http://localhost:4000/favorites");
    const data = await response.json();

    return data;
}

// 여행 상태 변경
export async function updateFavoriteStatus(id, status) {
    const response = await fetch(
        `http://localhost:4000/favorites/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: status,
            }),
        }
    );

    const data = await response.json();

    return data;
}


// 저장한 관광지 삭제
export async function deleteFavorite(id) {
    await fetch(
        `http://localhost:4000/favorites/${id}`,
        {
            method: "DELETE",
        }
    );
}

// 방문 메모 저장
export async function saveMemo(contentId, memo) {
    const response = await fetch(
        "http://localhost:4000/memos",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contentId: contentId,
                memo: memo,
            }),
        }
    );

    const data = await response.json();

    return data;
}

// 방문 메모 목록 조회
export async function getMemos() {
    const response = await fetch("http://localhost:4000/memos");
    const data = await response.json();

    return data;
}

// 방문 메모 수정
export async function updateMemo(id, memo) {
    const response = await fetch(
        `http://localhost:4000/memos/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                memo: memo,
            }),
        }
    );

    const data = await response.json();

    return data;
}

// 방문 메모 삭제
export async function deleteMemo(id) {
    await fetch(
        `http://localhost:4000/memos/${id}`,
        {
            method: "DELETE",
        }
    );
}