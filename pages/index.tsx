import type { NextPage } from 'next';
import { AspectRatio, Box, Center, Flex } from '@chakra-ui/react';
import { TrackCard } from '../components/TrackCard';
import json from '../day1.json';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
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
        (dayjs(`2021-09-18T14:${dayjs().second()}:00.000+09:00`).isAfter(
          dayjs(`2021-09-18T${value.startTime}:00.000+09:00`, 'minute')
        ) &&
          dayjs(`2021-09-18T14:${dayjs().second()}:00.000+09:00`).isBefore(
            dayjs(`2021-09-18T${value.endTime}:00.000+09:00`, 'minute')
          )) ||
        dayjs(`2021-09-18T14:${dayjs().second()}:00.000+09:00`).isSame(
          dayjs(`2021-09-18T${value.endTime}:00.000+09:00`, 'minute')
        )
      );
    });
    setData(datas.length ? datas[0] : undefined);
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
        <Flex>
          <AspectRatio ratio={16 / 9} width={'60vw'}>
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
              <Box rounded={'md'} />
            )}
          </AspectRatio>
          <Box width={'35vw'}>
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
              <Box rounded={'md'} />
            )}
            {/*<iframe src="https://live.udtalk.jp/1222dd9e47e38f1357840e2f5bf3da1a77fe139a8cd0f177f098734683c84115" width="100%" height="100%"  /> */}
          </Box>
        </Flex>
      </Center>
      <Flex paddingY={'18px'} flexWrap={'wrap'} gridGap={'10px'} justifyContent={'center'}>
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
    </Box>
  );
};

export default Home;
