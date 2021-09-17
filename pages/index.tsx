import type { NextPage } from 'next';
import { Icon, AspectRatio, Box, Button, Center, Flex, Text } from '@chakra-ui/react';
import { TrackCard } from '../components/TrackCard';
import { Yazirusi } from '../components/yazirusi';
import json from '../day1.json';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { MdLiveTv, MdChat } from 'react-icons/md';

const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

type TimeSections = {
  startTime: string;
  endTime: string;
  data: ({
    title: string;
    startTime: string;
    endTime: string;
    category: number;
    description: string;
    inputCompleted: string;
    presenters: string[];
    programId: string;
    trackNum: number;
    broadcastingURL: string;
    udtalkAppURL: string;
    udtalkWebURL: string;
  } | null)[];
};

const Home: NextPage = () => {
  const [data, setData] = useState<TimeSections | undefined>(undefined);
  const [time, updateTime] = useState(dayjs());
  const [viewTrack, setViewTrack] = useState(-1);
  const updateData = () => {
    const datas = json.filter((value) => {
      return (
        (dayjs().isAfter(dayjs(`2021-09-18T${value.startTime}:00.000+09:00`, 'minute')) &&
          dayjs().isBefore(dayjs(`2021-09-18T${value.endTime}:00.000+09:00`, 'minute'))) ||
        dayjs().isSame(dayjs(`2021-09-18T${value.endTime}:00.000+09:00`, 'minute'))
      );
    });
    if (datas.length) {
      setData(datas[0]);
    } else {
      setData(json[0]);
    }
  };
  useEffect(() => {
    updateData();
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // if (time.minute() !== dayjs().minute()) {
      updateData();
      //}
      updateTime(dayjs());
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [time]);
  return (
    <Box backgroundColor={'#262626'} minH={'100vh'}>
      <Center paddingY={'5px'}>
        <Flex gridGap={'0 10px'}>
          <AspectRatio
            ratio={16 / 9}
            width={'60vw'}
            rounded={'md'}
            borderColor={'#ffffff'}
            borderWidth={'3px'}
            borderStyle={'dashed'}
          >
            {data && data.data[viewTrack]?.broadcastingURL ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${data.data[viewTrack]?.broadcastingURL}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                width="100%"
                height="100%"
              />
            ) : (
              <Flex rounded={'md'} flexDirection={'column'} gridGap={'10px 0'}>
                <Icon as={MdLiveTv} color={'#ffffff'} boxSize={'100px'} />
                <Text color={'#ffffff'} fontSize={'1.6rem'}>
                  まだ配信を見るトラックが選ばれてないみたいです
                </Text>
                <Text color={'#ffffff'} fontSize={'1.2rem'}>
                  下から配信を選びましょう！
                </Text>
                <Box
                  height={'25%'}
                  width={'auto'}
                  position={'absolute'}
                  bottom={'10px'}
                  right={'35%'}
                >
                  <Yazirusi />
                </Box>
              </Flex>
            )}
          </AspectRatio>
          <Flex
            width={'35vw'}
            flexDirection={'column'}
            rounded={'md'}
            borderColor={'#ffffff'}
            borderWidth={'3px'}
            borderStyle={'dashed'}
            justify={'center'}
            alignItems={'center'}
            gridGap={'10px 0'}
          >
            {data && data.data[viewTrack]?.broadcastingURL ? (
              <iframe
                src={`https://www.youtube.com/live_chat?v=${data.data[viewTrack]?.broadcastingURL}&embed_domain=localhost`}
                width="100%"
                height="100%"
                title="Chat"
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              <Flex
                rounded={'md'}
                flexDirection={'column'}
                gridGap={'10px 0'}
                justify={'center'}
                alignItems={'center'}
              >
                <Icon as={MdChat} color={'#ffffff'} boxSize={'100px'} />
                <Text color={'#ffffff'} fontSize={'1.6rem'}>
                  配信を選ぶとチャットが表示されます
                </Text>
                <Text color={'#ffffff'} fontSize={'1.2rem'}>
                  字幕を見るボタンもここに表示されます。
                </Text>
              </Flex>
            )}
            <Flex justify={'space-evenly'}>
              {data && data.data[viewTrack]?.udtalkWebURL ? (
                <Button
                  as={'a'}
                  href={data.data[viewTrack]?.udtalkWebURL}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                >
                  字幕をWebで見る
                </Button>
              ) : undefined}

              {data && data.data[viewTrack]?.udtalkWebURL ? (
                <Button
                  as={'a'}
                  href={`udtalkapp://?${data.data[viewTrack]?.udtalkAppURL.split('?')[1]}`}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                >
                  字幕をAppで見る
                </Button>
              ) : undefined}
            </Flex>
            {/*<iframe src="https://live.udtalk.jp/1222dd9e47e38f1357840e2f5bf3da1a77fe139a8cd0f177f098734683c84115" width="100%" height="100%"  /> */}
          </Flex>
        </Flex>
      </Center>
      <Center>
        <Flex
          paddingY={'18px'}
          flexWrap={'wrap'}
          gridGap={'10px'}
          justifyContent={'center'}
          maxW={'1280px'}
        >
          {data
            ? data.data.map((value, i) => {
                if (value) {
                  return (
                    <TrackCard
                      key={value.programId}
                      onClick={() => {
                        setViewTrack(i);
                      }}
                      trackName={'Track' + value.trackNum}
                      trackTitle={value.title}
                    />
                  );
                }
              })
            : undefined}
        </Flex>
      </Center>
    </Box>
  );
};

export default Home;
