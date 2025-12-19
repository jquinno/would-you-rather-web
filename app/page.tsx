import { WouldYouRather } from "@/components/would-you-rather"
import { getActiveExperiment } from "@/lib/firestore"
import { Item } from "@/lib/types"

// Fallback cards in case Firestore fetch fails or no active experiment exists
const FALLBACK_CARDS: Item[] = [
  { id: "1", index: 0, name: "Card 1", imageUrl: "https://hd.wallpaperswide.com/thumbs/naruto_uzumaki_4-t2.jpg" },
  { id: "2", index: 1, name: "Card 2", imageUrl: "https://a.storyblok.com/f/178900/960x540/0c18c46877/ena-chikawa-in-laid-back-camp-s1-e2.jpg" },
  { id: "3", index: 2, name: "Card 3", imageUrl: "https://hd.wallpaperswide.com/thumbs/one_piece_monkey_d__luffy_ii-t2.jpg" },
  { id: "4", index: 3, name: "Card 4", imageUrl: "https://a.storyblok.com/f/178900/960x540/3855da2716/hello-kitty-sanrio.jpg" },
  { id: "5", index: 4, name: "Card 5", imageUrl: "https://s.yimg.com/ny/api/res/1.2/6bDvQQKhgyzZeUUTiXtJjw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xMzUwO2NmPXdlYnA-/https://media.zenfs.com/en/techradar_949/9f6d5164acd2439835c8c54835baa58e" },
  { id: "6", index: 5, name: "Card 6", imageUrl: "https://cdn.bhdw.net/im/boruto-naruto-next-generation-naruto-uzumaki-baryon-mode-wallpaper-80676_w635.webp" },
  { id: "7", index: 6, name: "Card 7", imageUrl: "https://hd.wallpaperswide.com/thumbs/minion_2-t2.jpg" },
  { id: "8", index: 7, name: "Card 8", imageUrl: "https://hd.wallpaperswide.com/thumbs/pokemon_x-t2.jpg" },
  { id: "9", index: 8, name: "Card 9", imageUrl: "https://a.storyblok.com/f/178900/960x540/6c73a2d708/dragon-ball-super-op.jpg" },
]

export default async function Home() {
  let cards: Item[] = FALLBACK_CARDS
  let experimentId: string | undefined = undefined

  try {
    // Fetch the active experiment from Firestore
    const experiment = await getActiveExperiment()

    // Use experiment data if available, otherwise use fallback
    if (experiment && experiment.items && experiment.items.length > 0) {
      cards = experiment.items
      experimentId = experiment.id
    } else {
      console.warn('No active experiment found, using fallback cards')
    }
  } catch (error) {
    console.error('Error fetching active experiment, using fallback cards:', error)
  }

  return <WouldYouRather cards={cards} experimentId={experimentId} />
}
