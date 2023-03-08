import { axiosApi, axiosAuthApi } from 'apis/axios';
import { FoodParty, FoodPartyCreateBody, Member } from 'types/foodParty';

type responseBodyType = {
  id: number;
};

type Comment = {
  commentId: number;
  userId: number;
  userName: string;
  avatarUrl: string;
  createdAt: number[];
  updatedAt: number[];
  content: string;
};

type FoodPartyDetail = {
  partyId: number;
  name: string;
  capacity: number;
  promiseTime: number[];
  categories: string[];
  members: Member[];
  comments: Comment[];
};

type FetchMyFoodPartyListResponse = {
  data: {
    responses: FoodParty[];
  };
};

type FetchFoodPartyDetailResponse = {
  data: FoodPartyDetail;
};

type FetchFoodPartyListResponse = {
  data: {
    responses: {
      content: FoodParty[];
    };
  };
};

export const createFoodParty = async (
  body: FoodPartyCreateBody
): Promise<responseBodyType> => {
  const response = await axiosAuthApi.post<responseBodyType>('/api/v1/crews', body);
  return response.data;
};

export const fetchMyFoodPartyList = async () => {
  const {
    data: {
      data: { responses: myFoodPartyList },
    },
  } = await axiosAuthApi<FetchMyFoodPartyListResponse>('/api/v1/crews/me');

  // return myFoodPartyList;
  return DUMMY_PARTY_LIST;
};

export const fetchFoodPartyDetail = async (partyId: string) => {
  const {
    data: { data: foodPartyDetail },
  } = await axiosAuthApi<FetchFoodPartyDetailResponse>(`/api/v1/crews/${partyId}`);

  // return foodPartyDetail;
  return DUMMY_PARTY_DETAIL;
};

export const fetchFoodPartyList = async (placeId: string) => {
  const {
    data: {
      data: {
        responses: { content: foodPartyList },
      },
    },
  } = await axiosAuthApi<FetchFoodPartyListResponse>(`/api/v1/crews/${placeId}`, {
    params: {
      page: 1,
      size: 10,
    },
  });

  return foodPartyList;
};

// 아직 제대로 백엔드 API가 연결되지 않아 남겨둠.
const DUMMY_PARTY_LIST = [
  {
    id: 1,
    name: '햄최삼 모여라',
    currentMember: 2,
    capacity: 5,
    promiseTime: [2023, 3, 14, 17, 50, 59, 893316700],
    status: '모집 중',
    content: '맥도날드 더쿼파치 뿌수러 갈 사람!',
    category: 'QUIET',
    members: [
      {
        userId: 1,
        avatarUrl: 'https://bit.ly/ryan-florence',
      },
      {
        userId: 2,
        avatarUrl: 'https://bit.ly/sage-adebayo',
      },
    ],
  },
  {
    id: 2,
    name: '라멘 뇸뇸뇸, 나가면 지상렬',
    currentMember: 3,
    capacity: 3,
    promiseTime: [2023, 3, 3, 13, 30, 0, 893316700],
    status: '모집 중',
    content: '식사 예절 좋으신 분만',
    category: 'MANNERS MAKETH MAN',
    members: [
      {
        userId: 1,
        avatarUrl: 'https://bit.ly/kent-c-dodds',
      },
      {
        userId: 2,
        avatarUrl: 'https://bit.ly/prosper-baba',
      },
      {
        userId: 3,
        avatarUrl: 'https://bit.ly/code-beast',
      },
    ],
  },
];

const DUMMY_PARTY_DETAIL = {
  id: 2,
  name: '라멘 뇸뇸뇸, 나가면 지상렬',
  currentMember: 3,
  capacity: 3,
  status: '모집 중',
  promiseTime: [2023, 3, 3, 13, 30, 0, 893316700],
  category: 'MANNERS MAKETH MAN',
  content: '쩝쩝이 사절',
  members: [
    {
      userId: 1,
      userName: 'hello',
      avatarUrl: 'https://bit.ly/kent-c-dodds',
      role: 'LEADER',
    },
    {
      userId: 2,
      userName: 'world',
      avatarUrl: 'https://bit.ly/prosper-baba',
      role: 'MEMBER',
    },
    {
      userId: 3,
      userName: 'developer',
      avatarUrl: 'https://bit.ly/code-beast',
      role: 'MEMBER',
    },
  ],
  restaurant: {
    id: 1,
    longitude: 127.030230066229,
    latitude: 37.4973929132991,
    placeId: 12385890,
    placeName: '뽕족 강남역본점',
    category: '음식점 > 한식 > 육류,고기 > 족발,보쌈',
    roadAddressName: '서울 강남구 테헤란로4길 15',
    kakaoPlaceUrl: 'http://place.map.kakao.com/855757075',
    phoneNumber: '02-556-9279',
  },
};
