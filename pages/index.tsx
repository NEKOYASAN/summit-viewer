import type { GetServerSidePropsContext, NextPage } from 'next';
import {
  Box,
  Button,
  Checkbox,
  Code,
  Flex,
  Grid,
  Heading,
  Icon,
  IconButton,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { TrackCard } from '../components/TrackCard';
import { Yazirusi } from '../components/yazirusi';
import json from '../day2.json';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { MdChat, MdContentCopy, MdLiveTv, MdPalette } from 'react-icons/md';
import MetaHead from '../components/MetaHead';
import { useRouter } from 'next/router';
import { ButtonIcon } from '@chakra-ui/button/dist/types/button-icon';
import { GrFacebook, GrTwitter } from 'react-icons/gr';

type SessionType = {
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
  graphicRecording: string;
};
type TimeSections = {
  startTime: string;
  endTime: string;
  data: (SessionType | null)[];
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const day = context.query.day;
  const track = context.query.track;
  const time = context.query.t;

  if (typeof day === 'string' && typeof track === 'string' && typeof time === 'string') {
    const dayj = dayjs.unix(Number(time));
    const datas = json.filter((value) => {
      return (
        (dayj.isAfter(dayjs(`2021-09-19T${value.startTime}:00.000+09:00`, 'minute')) &&
          dayj.isBefore(dayjs(`2021-09-19T${value.endTime}:00.000+09:00`, 'minute'))) ||
        dayj.isSame(dayjs(`2021-09-19T${value.endTime}:00.000+09:00`, 'minute'))
      );
    });
    if (datas.length) {
      const trackData = datas[0].data[Number(track)];
      return {
        props: {
          trackData,
        },
      };
    } else {
      const trackData = json[0].data[Number(track)];
      return {
        props: {
          trackData,
        },
      };
    }
  }
  return {
    props: {
      trackData: null,
    },
  };
}

const Home: NextPage<{ trackData: SessionType | null }> = ({ trackData }) => {
  const [data, setData] = useState<TimeSections | undefined>(undefined);
  const [time, updateTime] = useState(dayjs());
  const [viewTrack, setViewTrack] = useState(-1);
  const [viewYTID, setViewYTID] = useState<undefined | string>(undefined);
  const [viewGRID, setViewGRID] = useState<undefined | string>(undefined);
  const [viewUDWeb, setViewUDWeb] = useState<undefined | string>(undefined);
  const [viewUDApp, setViewUDApp] = useState<undefined | string>(undefined);
  const [hostName, setHostName] = useState<string>('');
  const [cocCheck, setCoCCheck] = useState<boolean>(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [ogpData, setOGPData] = useState<SessionType | null>(null);
  const router = useRouter();
  const twitter = () => {
    if (ogpData) {
      const url =
        'https://twitter.com/intent/tweet?text=' +
        ogpData.title +
        '??????????????? / ' +
        '???????????????????????????????????????' +
        '&url=' +
        encodeURIComponent(location.href) +
        '&' +
        'hashtags=cfjsummit,civictech';
      window.open(url);
    }
  };
  const facebook = () => {
    const url = 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(location.href);
    window.open(url);
  };
  const updateData = () => {
    const datas = json.filter((value) => {
      return (
        (dayjs().isAfter(dayjs(`2021-09-19T${value.startTime}:00.000+09:00`, 'minute')) &&
          dayjs().isBefore(dayjs(`2021-09-19T${value.endTime}:00.000+09:00`, 'minute'))) ||
        dayjs().isSame(dayjs(`2021-09-19T${value.endTime}:00.000+09:00`, 'minute'))
      );
    });
    if (datas.length) {
      setData(datas[0]);
    } else {
      setData(json[0]);
    }
  };
  useEffect(() => {
    const CoC = localStorage.getItem('CoCCheck');
    setCoCCheck(!!CoC);
    setHostName(location.hostname);
    if (trackData) {
      setOGPData(trackData);
      if (trackData.broadcastingURL) {
        setViewYTID(trackData.broadcastingURL);
      }
      if (trackData.udtalkWebURL) {
        setViewUDWeb(trackData.udtalkWebURL);
      }
      if (trackData.udtalkAppURL) {
        setViewUDApp(trackData.udtalkAppURL);
      }
      if (trackData.graphicRecording) {
        setViewGRID(trackData.graphicRecording);
      }
    }
    updateData();
  }, []);
  useEffect(() => {
    if (data) {
      if (data.data[viewTrack]?.broadcastingURL) {
        setViewYTID(data.data[viewTrack]?.broadcastingURL);
      }
      if (data.data[viewTrack]?.udtalkWebURL) {
        setViewUDWeb(data.data[viewTrack]?.udtalkWebURL);
      }
      if (data.data[viewTrack]?.udtalkAppURL) {
        setViewUDApp(data.data[viewTrack]?.udtalkAppURL);
      }
      if (data.data[viewTrack]?.graphicRecording) {
        setViewGRID(data.data[viewTrack]?.graphicRecording);
      }
      if (data.data[viewTrack]) {
        setOGPData(data.data[viewTrack]);
      }
      if (viewTrack >= 0)
        router.push(
          `?day=2&track=${viewTrack}&t=${dayjs().unix()}`,
          `?day=2&track=${viewTrack}&t=${dayjs().unix()}`,
          { shallow: true }
        );
    }
  }, [data]);
  useEffect(() => {
    if (data) {
      setViewYTID(data.data[viewTrack]?.broadcastingURL);
      setViewUDWeb(data.data[viewTrack]?.udtalkWebURL);
      setViewUDApp(data.data[viewTrack]?.udtalkAppURL);
      setViewGRID(data.data[viewTrack]?.graphicRecording);
      if (data.data[viewTrack]) {
        setOGPData(data.data[viewTrack]);
      }
      if (viewTrack >= 0)
        router.push(
          `?day=2&track=${viewTrack}&t=${dayjs().unix()}`,
          `?day=2&track=${viewTrack}&t=${dayjs().unix()}`,
          { shallow: true }
        );
    }
  }, [viewTrack]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (time.minute() !== dayjs().minute()) {
        updateData();
        if (viewTrack >= 0)
          router.push(
            `?day=2&track=${viewTrack}&t=${dayjs().unix()}`,
            `?day=2&track=${viewTrack}&t=${dayjs().unix()}`,
            { shallow: true }
          );
      }
      updateTime(dayjs());
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [time]);
  const getTrackID = (startTime: string) => {
    if (startTime === '13:30') {
      return '-0';
    }
    if (startTime === '14:30' || startTime === '14:20') {
      return '-1';
    }
    if (startTime === '15:30' || startTime === '15:20') {
      return '-2';
    }
    if (startTime === '16:30' || startTime === '16:20') {
      return '-3';
    }
    return '';
  };
  return (
    <Box backgroundColor={'#262626'} minH={'100vh'} height={'100vh'} width={'100vw'} p={2}>
      {!ogpData && !!trackData && trackData.category !== 4 ? (
        <MetaHead
          title={`${trackData.title}????????????!`}
          description={`Day2 Track${trackData.trackNum} | ${trackData.startTime} ~ ${trackData.endTime} | ${trackData.description}`}
          ogpImage={`thumbnails/CfJS2021_day2_track${trackData.trackNum}${getTrackID(
            trackData.startTime
          )}.png`}
        />
      ) : ogpData && ogpData.category !== 4 ? (
        <MetaHead
          title={`${ogpData.title}????????????!`}
          description={`Day2 Track${ogpData.trackNum} | ${ogpData.startTime} ~ ${ogpData.endTime} | ${ogpData.description}`}
          ogpImage={`thumbnails/CfJS2021_day2_track${ogpData.trackNum}${getTrackID(
            ogpData.startTime
          )}.png`}
        />
      ) : (
        <MetaHead />
      )}
      <Grid
        gridGap={1}
        templateColumns={'repeat(3, 1fr)'}
        templateRows={'repeat(3, 1fr)'}
        width={'100%'}
        height={'100%'}
        gridTemplateAreas={`'m m g' 'm m c' 's s c'`}
      >
        <Flex
          width={'100%'}
          height={'100%'}
          borderColor={'#ffffff'}
          borderWidth={!viewYTID ? '2px' : undefined}
          borderStyle={'dashed'}
          gridArea={'m'}
        >
          {viewYTID ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${viewYTID}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              width="100%"
              height="100%"
            />
          ) : (
            <Flex
              flexDirection={'column'}
              gridGap={'10px 0'}
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
              height={'100%'}
              position={'relative'}
            >
              <Icon as={MdLiveTv} color={'#ffffff'} boxSize={'100px'} />
              <Text color={'#ffffff'} fontSize={'1.6rem'}>
                ?????????????????????????????????????????????????????????????????????
              </Text>
              <Text color={'#ffffff'} fontSize={'1.2rem'}>
                ???????????????????????????????????????
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
        </Flex>
        <Flex
          width={'100%'}
          height={'100%'}
          flexDirection={'column'}
          borderColor={'#ffffff'}
          borderWidth={!viewYTID ? '2px' : undefined}
          borderStyle={'dashed'}
          gridGap={'10px 0'}
          justifyContent={'center'}
          gridArea={'c'}
        >
          {viewYTID ? (
            <iframe
              src={`https://www.youtube.com/live_chat?v=${viewYTID}&embed_domain=${hostName}`}
              width="100%"
              height="100%"
              title="Chat"
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <Flex
              flexDirection={'column'}
              gridGap={'10px 0'}
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
              height={'100%'}
            >
              <Icon as={MdChat} color={'#ffffff'} boxSize={'100px'} />
              <Text color={'#ffffff'} fontSize={'1.6rem'}>
                ???????????????????????????????????????????????????
              </Text>
              <Text color={'#ffffff'} fontSize={'1.2rem'}>
                ?????????????????????????????????????????????????????????
              </Text>
            </Flex>
          )}
          <Flex justify={'space-evenly'}>
            {viewUDWeb ? (
              <Button as={'a'} href={viewUDWeb} target={'_blank'} rel={'noopener noreferrer'}>
                ?????????Web?????????
              </Button>
            ) : undefined}

            {viewUDApp ? (
              <Button
                as={'a'}
                href={`udtalkapp://?${viewUDApp.split('?')[1]}`}
                target={'_blank'}
                rel={'noopener noreferrer'}
              >
                ?????????App?????????
              </Button>
            ) : undefined}
          </Flex>
          {/*<iframe src="https://live.udtalk.jp/1222dd9e47e38f1357840e2f5bf3da1a77fe139a8cd0f177f098734683c84115" width="100%" height="100%"  /> */}
        </Flex>
        <Flex
          flexDirection={'row'}
          width={'100%'}
          height={'100%'}
          gridArea={'s'}
          overflowY={'hidden'}
        >
          <Flex
            paddingY={'18px'}
            flexWrap={'wrap'}
            gridGap={'10px'}
            justifyContent={'center'}
            width={'100%'}
            height={'100%'}
            overflowY={'scroll'}
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
          {ogpData ? (
            <Flex flexDirection={'column'} width={'48px'} margin={'0.3rem 0.1rem'}>
              <IconButton
                aria-label={'Twitter???????????????'}
                icon={<Icon as={GrTwitter} />}
                bgColor={'#1DA1F2'}
                color={'#ffffff'}
                size={'lg'}
                margin={'1rem auto'}
                onClick={() => {
                  twitter();
                }}
              />
              <IconButton
                aria-label={'Facebook???????????????'}
                icon={<Icon as={GrFacebook} />}
                bgColor={'#3b5998'}
                color={'#ffffff'}
                size={'lg'}
                onClick={() => {
                  facebook();
                }}
              />
              {/*
            <IconButton
              aria-label={'????????????????????????'}
              icon={<Icon as={MdContentCopy} />}
              bgColor={'#ffffff'}
              color={'#2f2f2f'}
              size={'lg'}
              onClick={() => {
                twitter();
              }}
            />*/}
            </Flex>
          ) : undefined}
        </Flex>
        <Box
          width={'100%'}
          height={'100%'}
          borderColor={'#ffffff'}
          borderWidth={!viewGRID || viewGRID === '' ? '2px' : undefined}
          borderStyle={'dashed'}
          gridArea={'g'}
        >
          {viewGRID ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${viewGRID}?autoplay=1&mute=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              width="100%"
              height="100%"
            />
          ) : viewGRID === '' ? (
            <Flex
              height={'100%'}
              width={'100%'}
              flexDirection={'column'}
              gridGap={'10px 0'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Icon as={MdPalette} color={'#ffffff'} boxSize={'100px'} />
              <Text color={'#ffffff'} fontSize={'1.5rem'}>
                ????????????????????????????????????????????????????????????
              </Text>
              <Text color={'#ffffff'} fontSize={'1.2rem'}>
                <Link href={'https://note.com/tokumisa/n/n8787d9cbd65f'} isExternal>
                  ??????????????????????????????????????????????????????
                </Link>
              </Text>
            </Flex>
          ) : (
            <Flex
              height={'100%'}
              width={'100%'}
              flexDirection={'column'}
              gridGap={'10px 0'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Icon as={MdPalette} color={'#ffffff'} boxSize={'100px'} />
              <Text color={'#ffffff'} fontSize={'1.5rem'}>
                ?????????????????????????????????????????????????????????????????????
              </Text>
              <Text color={'#ffffff'} fontSize={'1.2rem'}>
                <Link href={'https://note.com/tokumisa/n/n8787d9cbd65f'} isExternal>
                  ??????????????????????????????????????????????????????
                </Link>
              </Text>
            </Flex>
          )}
        </Box>
      </Grid>
      <Modal
        closeOnOverlayClick={false}
        isOpen={!cocCheck}
        onClose={() => {}}
        scrollBehavior={'inside'}
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Code of Conduct / Privacy Policy????????????</ModalHeader>
          <ModalBody>
            <Heading fontSize={'1.4rem'} mb={2}>
              Code of Conduct (????????????)????????????
            </Heading>
            <UnorderedList>
              <ListItem>
                ?????????????????????????????????????????????????????????????????????????????????????????????????????????
              </ListItem>
              <ListItem>
                ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
              </ListItem>
              <ListItem>
                ????????????????????????????????????????????????????????????????????????????????????????????????????????????
              </ListItem>
              <ListItem>
                ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
              </ListItem>
            </UnorderedList>
            <Text fontWeight="bold" mt={2}>
              ??????????????????URL????????????????????????????????????????????????
            </Text>
            <Link href="https://github.com/codeforjapan/codeofconduct" isExternal>
              https://github.com/codeforjapan/codeofconduct
            </Link>
            <Text>
              ????????????????????????????????????????????????<Code>CoC[at]code4japan.org</Code>
            </Text>
            <Text>
              ????????????Code for Japan Slack??????<Code>@jinnouchi</Code> / <Code>@takesada_c4j</Code>
              ??????????????????????????????????????????
            </Text>

            <Heading fontSize={'1.4rem'} mb={2} mt={'1rem'}>
              Privacy Policy????????????
            </Heading>
            <Text>??????????????????Code for Japan????????????????????????????????????????????????????????????</Text>
            <Text>????????????????????????Privacy Policy???????????????????????????????????????</Text>
            <Link href="https://www.code4japan.org/privacy-policy" isExternal>
              https://www.code4japan.org/privacy-policy
            </Link>
          </ModalBody>

          <ModalFooter>
            <Checkbox
              isChecked={modalCheck}
              onChange={(e) => {
                setModalCheck(e.target.checked);
              }}
            >
              Code for Japan???????????????????????????????????? Code of Conduct???????????????
            </Checkbox>
            <Button
              colorScheme="blue"
              mr={3}
              isDisabled={!modalCheck}
              onClick={() => {
                if (modalCheck) {
                  localStorage.setItem('CoCCheck', 'true');
                  setCoCCheck(true);
                }
              }}
            >
              ?????????
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
