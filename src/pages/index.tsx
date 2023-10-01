import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import axios from 'axios';

import Decks from '@/components/deck';
import DeckCategory from '@/components/deckCategory';
import { useCategoryStore } from '@/stores/categoryStore';
// import { useDeckStore } from '@/stores/deckStore'
import { wfContext } from '@/context/context';
import useSWR, {SWRConfig, unstable_serialize} from 'swr';
import { useDeck } from '@/swr/useDeck';
import serverConfig from '@/config';

export const getStaticProps = (async context => {
    const largeCategories = (await axios.get(`http://${serverConfig.publicIp}:${serverConfig.backendPort}/rest/codes/01`)).data;
    const mediumCategories = (await axios.get(`http://${serverConfig.publicIp}:${serverConfig.backendPort}/rest/codes/02`)).data;
    const smallCategories = (await axios.get(`http://${serverConfig.publicIp}:${serverConfig.backendPort}/rest/codes/03`)).data;
    const items = (await axios.get(`http://${serverConfig.publicIp}:${serverConfig.backendPort}/rest/items`)).data;
    const characters = (await axios.get(`http://${serverConfig.publicIp}:${serverConfig.backendPort}/rest/characters`)).data;
    return { props: { categories: { largeCategories, mediumCategories, smallCategories }, items, characters, fallback:[unstable_serialize(["decks", "", "", ""])] } }
}) satisfies GetStaticProps

export default function Main(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const categoryStore = useCategoryStore()
    // const inquiryDecks = useDeckStore().inquiryDecks;
    wfContext.createCategoryContext(props.categories);
    wfContext.createItemContext(props.items);
    wfContext.createCharacterContext(props.characters);
    const {mutate} = useDeck();

    const inqCond = {
        largeCategory: categoryStore.currentLargeCategory,
        mediumCategory: categoryStore.currentMediumCategory,
        smallCategory: categoryStore.currentSmallCategory,
    }
    return <>
        <DeckCategory />
        
        {/* <button onClick={() => { inquiryDecks(inqCond) }}>조회</button> */}
        {/* <button onClick={() => {mutate([categoryStore.currentLargeCategory, categoryStore.currentMediumCategory, categoryStore.currentSmallCategory])}}>조회</button> */}
        <Link rel="stylesheet" href="/register" ><button>등록</button></Link>
        <Decks type='inquiry' />
    </>
}
