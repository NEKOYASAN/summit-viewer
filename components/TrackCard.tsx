import { Box, Grid, Text } from '@chakra-ui/react';
import { MouseEventHandler, VFC } from 'react';

type Props = {
  onClick: MouseEventHandler<HTMLDivElement>;
  trackName: string;
  trackTitle: string;
};

export const TrackCard: VFC<Props> = ({ onClick, trackName, trackTitle }) => {
  return (
    <Grid
      rounded={'lg'}
      backgroundColor={'#383838'}
      templateRows={'25px 1fr'}
      templateColumns={'1fr'}
      gap={'3px 0'}
      alignItems={'center'}
      justifyItems={'center'}
      minW={'240px'}
      minH={'160px'}
      maxW={'240px'}
      maxH={'160px'}
      padding={'10px'}
      onClick={(e) => {
        onClick(e);
      }}
    >
      <Text color={'#c7c7c7'} fontWeight={'bold'}>
        {trackName}
      </Text>
      <Text color={'#ffffff'} fontWeight={'bold'}>
        {trackTitle}
      </Text>
    </Grid>
  );
};
