import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import {
  createFoodParty,
  createFoodPartyApplication,
  deleteFoodPartyMember,
  fetchFoodPartyDetail,
  fetchFoodPartyList,
  fetchFoodPartyMessageList,
  fetchFoodPartyReviewees,
  fetchMyFoodPartyList,
  postFoodPartyLeaderReview,
  postFoodPartyMemberReview,
  updateFoodPartyMember,
} from 'services/foodParty';
import {
  FoodPartyLeaderReviewBody,
  FoodPartyMemberReviewBody,
  FoodPartyStatus,
} from 'types/foodParty';
import QUERY_KEYS from 'utils/constants/queryKeys';
import ROUTING_PATHS from 'utils/constants/routingPaths';

import { updateFoodPartyStatus } from './../../services/foodParty';

export const useGetMyFoodPartyList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FOOD_PARTY.MY_FOOD_PARTY_LIST],
    queryFn: () => fetchMyFoodPartyList(),
    suspense: true,
  });
};

export const useGetFoodPartyDetail = (partyId: string, userId?: number) => {
  const result = useQuery({
    queryKey: [QUERY_KEYS.FOOD_PARTY.FOOD_PARTY_DETAIL, partyId],
    queryFn: () => fetchFoodPartyDetail(partyId),
  });
  const isLeader = !!result.data?.members.find(
    ({ userId: memberUserId, crewMemberRole }) =>
      memberUserId === userId && crewMemberRole === 'LEADER'
  );
  const isMember = !!result.data?.members.find(
    ({ userId: memberUserId, crewMemberRole }) =>
      memberUserId === userId && crewMemberRole === 'MEMBER'
  );
  const isFull = result.data?.currentMember === result.data?.capacity;
  const leader = result.data?.members.find(
    (member) => member.crewMemberRole === 'LEADER'
  );

  return {
    ...result,
    isLeader,
    isMember,
    isFull,
    leaderUserId: leader?.userId || -1,
  };
};

export const useGetSearchedFoodPartyList = (placeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FOOD_PARTY.SEARCHED_FOOD_PARTY_LIST, placeId],
    queryFn: () => fetchFoodPartyList(placeId),
  });
};

export const useGetFoodPartyReviewees = (crewId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FOOD_PARTY.FOOD_PARTY_REVIEWEES, crewId],
    queryFn: () => fetchFoodPartyReviewees(crewId),
  });
};

export const useGetFoodPartyMessageList = (roomId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FOOD_PARTY.CHAT_MESSAGE_LIST, roomId],
    queryFn: () => fetchFoodPartyMessageList(roomId),
  });
};

export const usePostLeaderReview = (crewId: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ crewId, body }: { crewId: string; body: FoodPartyLeaderReviewBody }) =>
      postFoodPartyLeaderReview(crewId, body),
    onSuccess: () => {
      toast({
        title: '방장 리뷰가 작성되었습니다',
        description: '작성해주셔서 감사합니다',
        position: 'bottom',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      queryClient.invalidateQueries([QUERY_KEYS.FOOD_PARTY.FOOD_PARTY_REVIEWEES, crewId]);
    },
  });
};

export const useCreateFoodParty = () => {
  const router = useRouter();
  const toast = useToast();

  return useMutation({
    mutationFn: createFoodParty,
    onSuccess: (data) => {
      const partyId = data.id;
      router.push(ROUTING_PATHS.FOOD_PARTY.DETAIL.INFORMATION(partyId));
      toast({
        title: '밥모임이 생성되었습니다!',
        description: '생성된 밥모임 정보를 확인하세요',
        position: 'top',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    },
  });
};

export const usePostMemberReview = (crewId: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ crewId, body }: { crewId: string; body: FoodPartyMemberReviewBody }) =>
      postFoodPartyMemberReview(crewId, body),
    onSuccess: () => {
      toast({
        title: '멤버 리뷰가 작성되었습니다',
        description: '작성해주셔서 감사합니다',
        position: 'bottom',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      queryClient.invalidateQueries([QUERY_KEYS.FOOD_PARTY.FOOD_PARTY_REVIEWEES, crewId]);
    },
  });
};

export const useCreateFoodPartyApplication = (partyId: string, leaderUserId: number) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (content: string) =>
      createFoodPartyApplication(partyId, content, leaderUserId),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.FOOD_PARTY.FOOD_PARTY_DETAIL, partyId]);
      toast({
        title: '신청서가 제출되었습니다.',
        position: 'top',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: '강퇴 당하신 것 같아요...',
        position: 'top',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    },
  });
};

export const useUpdateFoodPartyStatus = (partyId: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (status: FoodPartyStatus) => updateFoodPartyStatus(partyId, status),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.FOOD_PARTY.FOOD_PARTY_DETAIL, partyId]);
    },
    onError: (error: unknown) => {
      toast({
        title: '예기치 못한 에러가 발생했습니다.',
        position: 'top',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    },
  });
};

export const useUpdateFoodPartyMember = (partyId: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ memberId }: { memberId: number }) =>
      updateFoodPartyMember(partyId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.FOOD_PARTY.FOOD_PARTY_DETAIL, partyId]);
    },
    onError: (error: unknown) => {
      toast({
        title: '예기치 못한 에러가 발생했습니다.',
        position: 'top',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    },
  });
};

export const useDeleteFoodPartyMember = (partyId: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: () => deleteFoodPartyMember(partyId),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.FOOD_PARTY.FOOD_PARTY_DETAIL, partyId]);
    },
    onError: (error: unknown) => {
      toast({
        title: '예기치 못한 에러가 발생했습니다.',
        position: 'top',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    },
  });
};
