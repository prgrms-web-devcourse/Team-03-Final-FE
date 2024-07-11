import { useRecoilValue, useSetRecoilState } from 'recoil';
import { foodPartyCreateDrawerOpenState } from 'stores/drawer';
import { kakaoMapOptionsState } from 'stores/kakaoMap';
import { searchRestaurantListState } from 'stores/restaurant';
import { AxiosPhotoResponseValue } from 'types/kakaoSearch';
import { DEFAULT_IMAGE } from 'utils/constants/foodParty';
import { keywordSearch } from 'utils/helpers/kakaoMap';
import { getKeywordPhotos } from 'utils/helpers/kakaoSearch';

const useSearchRestaurant = () => {
  const kakaoMapOptions = useRecoilValue(kakaoMapOptionsState);
  const setRestaurantList = useSetRecoilState(searchRestaurantListState);
  const foodPartyCreateDrawerOpen = useRecoilValue(foodPartyCreateDrawerOpenState);

  const searchByKeyword = async (keyword: string) => {
    if (!foodPartyCreateDrawerOpen) return;
    const kakaoPlaces = new kakao.maps.services.Places();
    const { lng, lat } = kakaoMapOptions.center;

    const options = {
      category_group_code: 'FD6',
      x: lng,
      y: lat,
      radius: 1000,
    };

    const keywordSearchResult: kakao.maps.services.PlacesSearchResult =
      await keywordSearch(kakaoPlaces, keyword, options).then((result) => result);

    const getPhotoPromises = keywordSearchResult.map(
      async ({ address_name, place_name }) => {
        return await getKeywordPhotos(address_name, place_name, 4);
      }
    );

    const photoData = await Promise.allSettled(getPhotoPromises);
    const photoList = photoData.reduce<AxiosPhotoResponseValue[]>((prev, result) => {
      if (result.status === 'fulfilled') {
        prev.push(result.value);
      }
      return prev;
    }, []);

    const photos = photoList.map(({ documents }) => {
      const imageArray = documents.map(({ image_url }) => image_url);
      while (imageArray.length < 4) {
        imageArray.push(DEFAULT_IMAGE);
      }
      return imageArray;
    });

    const searchResult = keywordSearchResult.map((item, index) => {
      const {
        id: placeId,
        place_name: placeName,
        category_name: categories,
        road_address_name: roadAddressName,
        place_url: kakaoPlaceUrl,
        phone: phoneNumber,
        x,
        y,
      } = item;

      return {
        placeId,
        placeName,
        categories,
        roadAddressName,
        photoUrls: photos[index],
        kakaoPlaceUrl,
        phoneNumber,
        longitude: parseFloat(x),
        latitude: parseFloat(y),
      };
    });

    setRestaurantList(searchResult);
  };

  return { searchByKeyword };
};

export default useSearchRestaurant;
