import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import Button from 'components/common/Button';
import Category from 'components/common/Category';
import { useRouter } from 'next/router';
// import Image from 'next/image';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { foodPartyCreateDrawerOpenState } from 'stores/drawer';
import { searchRestaurantListState, selectedRestaurantState } from 'stores/restaurant';
import { DEFAULT_IMAGE } from 'utils/constants/foodParty';
import ROUTING_PATHS from 'utils/constants/routingPaths';
import { getCategoryArray } from 'utils/helpers/foodParty';

type SearchRestaurantItemProps = {
  name: string;
  address: string;
  categories: string;
  photos: string[];
  placeUrl: string;
  phoneNumber: string;
  index: number;
};

const SearchRestaurantItem = ({
  name,
  address,
  categories,
  photos,
  placeUrl,
  index,
  phoneNumber,
}: SearchRestaurantItemProps) => {
  const router = useRouter();
  const searchRestaurantList = useRecoilValue(searchRestaurantListState);
  const setSelectedRestaurantList = useSetRecoilState(selectedRestaurantState);
  const foodPartyCreateDrawerOpen = useSetRecoilState(foodPartyCreateDrawerOpenState);

  const handleClickCreateFoodParty = () => {
    setSelectedRestaurantList({ ...searchRestaurantList[index] });
    foodPartyCreateDrawerOpen(false);
    router.push(ROUTING_PATHS.FOOD_PARTY.CREATE);
  };

  return (
    <AccordionItem w='100%'>
      <h2>
        <AccordionButton borderRadius='8px'>
          <Box as='span' flex='1' textAlign='left'>
            <Heading fontSize='xl'>
              <a href={placeUrl} target='_blank' rel='noreferrer noopener'>
                {name}
              </a>
            </Heading>
            <Text fontSize='md' color='#b2b4b8'>
              {address}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        <Flex w='100%' flexDir='column' justify='space-between'>
          <Stack direction='row'>
            {getCategoryArray(categories).map((category) => (
              <Category
                key={category}
                style={{
                  borderRadius: '0.5rem',
                  padding: '2px 5px',
                }}>
                {category}
              </Category>
            ))}
          </Stack>
          <Text fontSize='sm' color='#8b8b8b'>
            {phoneNumber}
          </Text>
          <Flex overflowX='auto' gap='1rem' py='0.5rem'>
            {photos?.map((photoUrl, index) => (
              <Image
                key={photoUrl + index.toString()}
                referrerPolicy='no-referrer'
                boxSize='100px'
                borderRadius={8}
                objectFit='cover'
                src={photoUrl}
                fallbackStrategy={'onError' || 'beforeLoadOrError'}
                fallbackSrc={DEFAULT_IMAGE}
                alt='food'
              />
            ))}
          </Flex>
          <Button
            onClick={handleClickCreateFoodParty}
            style={{
              backgroundColor: 'primary',
              color: 'white',
            }}>
            밥모임 생성하기
          </Button>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default React.memo(SearchRestaurantItem);
