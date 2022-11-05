import { VStack, Heading, Text } from 'native-base';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import Logo from '../assets/logo.svg';

export function NewPool() {
  return (
    <VStack bgColor='gray.900' height='full'>
      <Header title='Criar novo bolão' />

      <VStack mt={8} mx={5} alignItems='center' bgColor='black.900'>
        <Logo />

        <Heading fontFamily='heading' color='white' fontSize='xl' my={8} textAlign='center'>
          Crie seu próprio bolão da copa {'\n'}
          e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder='Qual o nome do seu bolão'
        />

        <Button 
          title='Criar meu bolão'
        />

        <Text color='gray.200' fontSize='sm' textAlign='center' px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  )
}