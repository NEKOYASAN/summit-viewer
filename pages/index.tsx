import type { NextPage } from 'next';
import {
  Box,
  Button,
  Checkbox,
  Code,
  Flex,
  Grid,
  Heading,
  Icon,
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
import { MdChat, MdLiveTv, MdPalette } from 'react-icons/md';

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
    graphicRecording: string;
  } | null)[];
};

const Home: NextPage = () => {
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
    }
  }, [data]);
  useEffect(() => {
    if (data) {
      setViewYTID(data.data[viewTrack]?.broadcastingURL);
      setViewUDWeb(data.data[viewTrack]?.udtalkWebURL);
      setViewUDApp(data.data[viewTrack]?.udtalkAppURL);
      setViewGRID(data.data[viewTrack]?.graphicRecording);
    }
  }, [viewTrack]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (time.minute() !== dayjs().minute()) {
        updateData();
      }
      updateTime(dayjs());
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [time]);
  return (
    <Box backgroundColor={'#262626'} minH={'100vh'} height={'100vh'} width={'100vw'} p={2}>
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
          borderWidth={'2px'}
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
        </Flex>
        <Flex
          width={'100%'}
          height={'100%'}
          flexDirection={'column'}
          borderColor={'#ffffff'}
          borderWidth={'2px'}
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
                配信を選ぶとチャットが表示されます
              </Text>
              <Text color={'#ffffff'} fontSize={'1.2rem'}>
                字幕を見るボタンもここに表示されます。
              </Text>
            </Flex>
          )}
          <Flex justify={'space-evenly'}>
            {viewUDWeb ? (
              <Button as={'a'} href={viewUDWeb} target={'_blank'} rel={'noopener noreferrer'}>
                字幕をWebで見る
              </Button>
            ) : undefined}

            {viewUDApp ? (
              <Button
                as={'a'}
                href={`udtalkapp://?${viewUDApp.split('?')[1]}`}
                target={'_blank'}
                rel={'noopener noreferrer'}
              >
                字幕をAppで見る
              </Button>
            ) : undefined}
          </Flex>
          {/*<iframe src="https://live.udtalk.jp/1222dd9e47e38f1357840e2f5bf3da1a77fe139a8cd0f177f098734683c84115" width="100%" height="100%"  /> */}
        </Flex>
        <Flex
          paddingY={'18px'}
          flexWrap={'wrap'}
          gridGap={'10px'}
          justifyContent={'center'}
          width={'100%'}
          height={'100%'}
          overflowY={'scroll'}
          gridArea={'s'}
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
        <Box
          width={'100%'}
          height={'100%'}
          borderColor={'#ffffff'}
          borderWidth={'2px'}
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
                このトラックにはグラレコはないみたいです
              </Text>
              <Text color={'#ffffff'} fontSize={'1.2rem'}>
                <Link href={'https://note.com/tokumisa/n/n8787d9cbd65f'} isExternal>
                  グラレコについてはこちらをクリック！
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
                まだ配信を見るトラックが選ばれてないみたいです
              </Text>
              <Text color={'#ffffff'} fontSize={'1.2rem'}>
                <Link href={'https://note.com/tokumisa/n/n8787d9cbd65f'} isExternal>
                  グラレコについてはこちらをクリック！
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
          <ModalHeader>Code of Conduct / Privacy Policyについて</ModalHeader>
          <ModalBody>
            <Heading fontSize={'1.4rem'} mb={2}>
              Code of Conduct (行動規約)について
            </Heading>
            <UnorderedList>
              <ListItem>
                サミットは参加者・セッション登壇者・スタッフみんなでつくるイベントです
              </ListItem>
              <ListItem>
                誰もが参加しやすいサミットを「ともに考え、ともにつくる」ことを目指しています
              </ListItem>
              <ListItem>
                お互い敬意を持って、価値観を認め合いながら、建設的に意見を交わしましょう
              </ListItem>
              <ListItem>
                それぞれが文化的および個人的なバックグラウンドがあることを理解するように努めましょう
              </ListItem>
            </UnorderedList>
            <Text fontWeight="bold" mt={2}>
              全文は以下のURLにございますのでご確認ください。
            </Text>
            <Link href="https://github.com/codeforjapan/codeofconduct" isExternal>
              https://github.com/codeforjapan/codeofconduct
            </Link>
            <Text>
              また、お困りのことがありましたら<Code>CoC[at]code4japan.org</Code>
            </Text>
            <Text>
              もしくはCode for Japan Slackにて<Code>@jinnouchi</Code> / <Code>@takesada_c4j</Code>
              のどちらかにご連絡ください。
            </Text>

            <Heading fontSize={'1.4rem'} mb={2} mt={'1rem'}>
              Privacy Policyについて
            </Heading>
            <Text>本イベントはCode for Japanが主催し開催しているイベントとなります。</Text>
            <Text>以下のリンクよりPrivacy Policyも合わせてご確認ください。</Text>
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
              Code for Japanのプライバシーポリシー・ Code of Conductに同意する
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
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
