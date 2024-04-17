'use client'
import { useEffect, useState } from 'react';
import GiftCard from './GiftCard';
import Hero from './Hero';

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
}

export default function ListaDePresentes() {
  const [data, setData] = useState<WishList[] | []>([])
  const [loading, setLoading] = useState(true)
  const [bought, setBought] = useState(false)

  const forceUpdate = () => {
    setBought(currentBought => !currentBought);
  };

  useEffect(() => {
    setLoading(true)
    const getData = async () => {
      await fetch('/api/gifts-list/list', { next: { revalidate: 0 } })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const orderedData = data.wishList.sort((a: WishList, b: WishList) => {
              if (!a.boughtBy.length && b.boughtBy.length) return -1
              if (a.boughtBy.length && !b.boughtBy.length) return 1
              return 0
            })
            setData(orderedData)
          }
          setLoading(false)
        })
    }
    getData()
  }, [bought])

  return (
    <div className='flex flex-col h-screen  text-secondary'>
      <Hero />
      <div className='bg-secondary-content flex flex-col'>
        {loading ? <span className=" loading-lg loading loading-dots text-primary m-auto self-center"></span> : null}
        {!loading &&
          (
            <ul id="lista" className='flex flex-col gap-3 my-3'>
              {(data.map((item) => (
                <div key={item.id} className='flex items-center justify-between px-2'>
                  <li className='flex-1' id={item.id} >{item.name}</li>
                  {!item.boughtBy.length ? <GiftCard key={item.id} item={item} forceUpdate={forceUpdate} />
                    : <div className="align-middle badge badge-warning badge-xs font-bold">Já Ganhamos!</div>
                  }
                </div>
              )))}
            </ul>)
        }
      </div>
    </div>
  );
}