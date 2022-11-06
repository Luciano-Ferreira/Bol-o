import { useEffect, useState } from 'react';
import { Share } from 'react-native';

import { useToast, VStack, HStack } from 'native-base';
import { useRoute } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Option } from '../components/Option';
import { Loading } from '../components/Loading';
import { PoolCardProps } from '../components/PoolCard';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { PoolHeader } from '../components/PoolHeader';
import { Guesses } from '../components/Guesses';

import { api } from '../services/api';
interface RouteParams {
  id: string;
}

export function PoolDetails() {
  const route = useRoute();

  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);

  const toast = useToast();

  const { id } = route.params as RouteParams;

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pool/${id}`);

      setPoolDetails(response.data);

    } catch (err) {
      console.log(err)

      toast.show({
        title: 'Não foi possivel carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
      
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code
    })
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header 
        title={poolDetails.owner.name} 
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {
        poolDetails._count.participants > 0 ? (
          <VStack px={5} flex={1}>
            <PoolHeader data={poolDetails} key={poolDetails.id}/>
            <HStack
              bgColor='gray.800'
              p={1}
              rounded='sm'
              mb={5}
            >
              <Option 
                title='Seus palpites' 
                isSelected={optionSelected === 'guesses'} 
                onPress={() => setOptionSelected('guesses')}
              />

              <Option 
                title='Ranking do grupo' 
                isSelected={optionSelected === 'ranking'}
                onPress={() => setOptionSelected('ranking')}
              />
            </HStack>
            <Guesses poolId={poolDetails.id} />
          </VStack>
        ) : (
          <EmptyMyPoolList code={poolDetails.code} />
        )
      }
    </VStack>
  )
}