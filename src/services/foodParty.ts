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

export const createFoodParty = async (
  body: FoodPartyCreateBody
): Promise<responseBodyType> => {
  const response = await axiosAuthApi.post<responseBodyType>('/api/v1/crews', body);
  return response.data;
};

export const fetchMyFoodPartyList = async () => {
  const { data } = await axiosAuthApi<{ data: FoodParty[] }>('/api/v1/crews/me');
  return data.data;
};

export const fetchFoodPartyDetail = (partyId: number) => {
  return new Promise<FoodPartyDetail>((resolve, reject) => {
    resolve(DUMMY_PARTY_DETAIL);
  });
};

export const fetchFoodPartyList = (placeId: number) => {
  return new Promise<FoodParty[]>((resolve, reject) => {
    resolve(DUMMY_PARTY_LIST);
  });
};

const DUMMY_PARTY_LIST = [
  {
    id: 1,
    name: '햄최삼 모여라',
    currentMember: 2,
    capacity: 5,
    promiseTime: [2023, 3, 14, 17, 50, 59, 893316700],
    status: 'RECRUITING',
    content: '맥도날드 더쿼파치 뿌수러 갈 사람!',
    category: ['QUIET'],
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
    status: 'RECRUITING',
    content: '식사 예절 좋으신 분만',
    category: ['MANNERS MAKETH MAN'],
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
  partyId: 2,
  name: '라멘 뇸뇸뇸, 나가면 지상렬',
  capacity: 5,
  promiseTime: [2023, 3, 3, 13, 30, 0, 893316700],
  categories: ['QUIET', 'MANNERS MAKETH MAN'],
  members: [
    {
      userId: 1,
      userName: 'hello',
      avatarUrl: 'https://bit.ly/kent-c-dodds',
    },
    {
      userId: 2,
      userName: 'world',
      avatarUrl: 'https://bit.ly/prosper-baba',
    },
    {
      userId: 3,
      userName: 'developer',
      avatarUrl: 'https://bit.ly/code-beast',
    },
  ],
  comments: [
    {
      commentId: 19273,
      userId: 1,
      userName: 'hello',
      avatarUrl: 'https://bit.ly/kent-c-dodds',
      createdAt: [2023, 3, 3, 12, 10, 0, 893316700],
      updatedAt: [2023, 3, 3, 12, 10, 0, 893316700],
      content: '안녕하세요',
    },
    {
      commentId: 19274,
      userId: 2,
      userName: 'world',
      avatarUrl: 'https://bit.ly/prosper-baba',
      createdAt: [2023, 3, 3, 12, 12, 0, 893316700],
      updatedAt: [2023, 3, 3, 12, 12, 0, 893316700],
      content: '네, 하이요',
    },
    {
      commentId: 19275,
      userId: 1,
      userName: 'hello',
      avatarUrl: 'https://bit.ly/kent-c-dodds',
      createdAt: [2023, 3, 3, 12, 15, 0, 893316700],
      updatedAt: [2023, 3, 3, 12, 17, 0, 893316700],
      content: '반갑습니다!',
    },
  ],
};
