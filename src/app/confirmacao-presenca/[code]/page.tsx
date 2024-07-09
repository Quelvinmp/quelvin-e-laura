'use client'
import { useEffect, useState } from 'react';
import { getConfirmationList } from '../../actions/getConfirmationList';
import Hero from '@/app/components/Hero';
export const fetchCache = 'force-no-store'

export default function Page({ params }: { params: { code: string } }) {
  const [confirmationList, setConfirmationList] = useState<any>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const res = await getConfirmationList(params.code)
      if (res) {
        setConfirmationList(res)
      }
      setLoading(false)
    }
    getData()
  }, [])

  return (
    <div className='bg-secondary-content'>
      <div className="bg-secondary-content max-w-xl flex flex-col items-center m-auto">
        <div className="hero min-h-screen" style={{ backgroundImage: `url(/pre-wedding-1.jpg)` }}>
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md h-screen flex flex-col justify-center ">
              {loading ? <span className=" loading-lg loading loading-dots text-primary m-auto self-center"></span> : null}
              {!loading && (
                <div >
                  <p>Olá! Por favor, nos informe quem vai poder ir ao casamento!</p>
                  {confirmationList.originalList.split(',').map((name: string, index: number) => (
                    <div className="form-control flex" key={index}>
                      <label className="label cursor-pointer">
                        <span className="label-text">{name}</span>
                        <input type="checkbox" className="checkbox checkbox-primary" name={name} value={name} id={`${confirmationList.code}-${name}`} />
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
