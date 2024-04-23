'use client'
import { useEffect, useState } from 'react';
import GiftCard from './GiftCard';
import Hero from './Hero';
import axios from 'axios'
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
  randomId: number;
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
      const res = await getList()
      // await axios('/api/gifts-list/list', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Cache-Control': 'no-store'
      //   }
      // })
      //   .then((res) => {
      //     const data = res.data;
      if (res) {
        const orderedData = res.sort((a: WishList, b: WishList) => {
          if (!a.boughtBy.length && b.boughtBy.length) return -1
          if (a.boughtBy.length && !b.boughtBy.length) return 1
          return 0
        })
        setData(orderedData)
      }
      //       console.log(orderedData[0].randomId, orderedData[0].name)
      //       setData(orderedData)
      //     }
      setLoading(false)
      //     })
    }
    getData()
  }, [bought])

  return (
    <div className='flex flex-col h-screen max-w-xl text-secondary '>
      <Hero />
      <div className='bg-secondary-content flex flex-col max-w-md items-center justify-center m-auto'>
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