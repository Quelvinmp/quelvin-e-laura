'use client'
import { useEffect, useState } from 'react';
import GiftCard from './GiftCard';
import Hero from './Hero';
import { getList } from '../actions/getList';
export const fetchCache = 'force-no-store'

type WishList = {
  id: string;
  name: string;
  description: string;
  link: string;
  image: string;
  boughtBy: string;
  type: string;
  local: string;
  preferences: string;
  isSugestion: boolean;
  isRealGift: boolean;
}

export default function ListaDePresentes() {
  const [realGifts, setRealGifts] = useState<WishList[] | []>([])
  const [symbolicGifts, setSymbolicGifts] = useState<WishList[] | []>([])
  const [loading, setLoading] = useState(true)
  const [bought, setBought] = useState(false)
  const [listType, setListType] = useState<'real' | 'symbolic'>('real');



  const forceUpdate = () => {
    setBought(currentBought => !currentBought);
  };

  useEffect(() => {
    setLoading(true)
    const getData = async () => {
      const res = await getList()
      if (res) {
        const realGifts: any = [];
        const symbolicGifts: any = [];
        res.forEach((item: WishList) => {
          if (item.isRealGift) {
            realGifts.push(item)
          } else {
            symbolicGifts.push(item)
          }
        })

        const realGiftsOrdered = realGifts.sort((a: WishList, b: WishList) => {
          if (!a.boughtBy.length && b.boughtBy.length) return -1
          if (a.boughtBy.length && !b.boughtBy.length) return 1
          return 0
        })
        setRealGifts(realGiftsOrdered)
        setSymbolicGifts(symbolicGifts)
      }
      setLoading(false)
    }
    getData()
  }, [bought])

  return (
    <div className='flex flex-col h-screen max-w-xl text-secondary '>
      <Hero />
      <div className='bg-secondary-content flex flex-col max-w-md items-center justify-center m-auto'>
        {loading ? <span className=" loading-lg loading loading-dots text-primary m-auto self-center"></span> : null}
        {!loading &&
          <div className='flex flex-col w-full items-center'>
            {symbolicGifts.length > 0 &&
              <div className='flex gap-2 mt-4'>
                <button className={`${listType === 'real' ? 'btn-success' : 'btn-info btn-outline'} btn btn-sm md:btn-md `} onClick={() => setListType('real')}>Presentes Reais</button>
                <button className={`${listType === 'symbolic' ? 'btn-success' : 'btn-info btn-outline'} btn btn-sm md:btn-md   `} onClick={() => setListType('symbolic')}>Presentes Simbólicos</button>
              </div>
            }

            {listType === 'real'
              ? (
                <ul id="lista" className='flex flex-col gap-3 my-3 w-full'>
                  {(realGifts.map((item) => (
                    <div key={item.id} className='flex items-center justify-between px-2'>
                      <li className='flex-1' id={item.id} >{item.name}</li>
                      {!item.boughtBy.length ? <GiftCard key={item.id} item={item} forceUpdate={forceUpdate} />
                        : <div className="align-middle badge badge-warning badge-xs font-bold">Já Ganhamos!</div>
                      }
                    </div>
                  )))}
                </ul>
              )
              : (
                <ul id="lista" className='flex flex-col gap-3 my-3 w-full'>
                  {(symbolicGifts.map((item) => (
                    <div key={item.id} className='flex items-center justify-between px-2 '>
                      <li className='flex-1' id={item.id} >{item.name}</li>
                      {!item.boughtBy.length ? <GiftCard key={item.id} item={item} forceUpdate={forceUpdate} />
                        : <div className="align-middle badge badge-warning badge-xs font-bold">Já Ganhamos!</div>
                      }
                    </div>
                  )))}
                </ul>
              )}
          </div>
        }
      </div>
    </div>
  );
}