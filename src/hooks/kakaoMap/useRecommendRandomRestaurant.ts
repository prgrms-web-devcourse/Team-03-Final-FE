import useKakaoMapContext from 'contexts/kakaoMap';
import useKakaoMapMarkerContext from 'contexts/kakaoMapMarker';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { kakaoMapOptionsState } from 'stores/kakaoMap';

const DEFAULT_RADIUS = 300;
const DEFAULT_BADGE_IMAGE_SIZE = 72;
const KAKAO_RESTAURANT_CATEGORY_CODE = 'FD6';
const RESTAURANT_BADGE_IMAGE_FILE_PATH = '/images/restaurant-badge.svg';

const useRecommendRandomRestaurant = () => {
  const [recommendRandomRestaurantIsLoading, setRecommendRandomRestaurantIsLoading] =
    useState(false);
  const setKakaoMapOptions = useSetRecoilState(kakaoMapOptionsState);
  const { kakaoMap } = useKakaoMapContext();
  const { setKakaoMapMarker } = useKakaoMapMarkerContext();

  const recommendRandomRestaurant = () => {
    if (!kakaoMap) return;

    setRecommendRandomRestaurantIsLoading(true);
    const kakaoPlacesService = new kakao.maps.services.Places();

    const currentLatitude = kakaoMap.getCenter().getLat();
    const currentLongitude = kakaoMap.getCenter().getLng();
    const placesSearchOptions: kakao.maps.services.PlacesSearchOptions = {
      x: currentLongitude,
      y: currentLatitude,
      radius: DEFAULT_RADIUS,
    };

    const nearbyRestaurants: kakao.maps.services.PlacesSearchResultItem[] = [];
    kakaoPlacesService.categorySearch(
      KAKAO_RESTAURANT_CATEGORY_CODE,
      (result, status, pagination) => {
        // To Do
        // ZERO_RESULT, ERROR 각 상황 처리 필요
        const { OK, ZERO_RESULT, ERROR } = kakao.maps.services.Status;

        if (status === OK) {
          nearbyRestaurants.push(...result);
          pagination.hasNextPage && pagination.nextPage();
        }

        // 더 이상 맛집 데이터가 없을 때 랜덤으로 맛집을 추천하는 로직을 수행.
        // 최대 45개의 맛집 데이터를 얻을 수 있다.
        if (!pagination.hasNextPage) {
          const randomIndex = Math.floor(Math.random() * nearbyRestaurants.length);
          const markerImage = new kakao.maps.MarkerImage(
            RESTAURANT_BADGE_IMAGE_FILE_PATH,
            new kakao.maps.Size(DEFAULT_BADGE_IMAGE_SIZE, DEFAULT_BADGE_IMAGE_SIZE)
          );
          const createdMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(
              Number(nearbyRestaurants[randomIndex].y),
              Number(nearbyRestaurants[randomIndex].x)
            ),
            image: markerImage,
          });

          // const googlePlacesService = new google

          setKakaoMapOptions((previousKakaoMapOptions) => ({
            ...previousKakaoMapOptions,
            center: {
              lat: currentLatitude,
              lng: currentLongitude,
            },
          }));
          setKakaoMapMarker(createdMarker);
          setRecommendRandomRestaurantIsLoading(false);
        }
      },
      placesSearchOptions
    );
  };

  return {
    recommendRandomRestaurant,
    recommendRandomRestaurantIsLoading,
  };
};

export default useRecommendRandomRestaurant;
