'use client'
import { useEffect, useState } from 'react';
import { getConfirmationList } from '../../actions/getConfirmationList';
import Swal from 'sweetalert2';
export const fetchCache = 'force-no-store'

export default function Page({ params }: { params: { code: string } }) {
  const [confirmationList, setConfirmationList] = useState<any>()
  const [answered, setAnswered] = useState(false)
  const [checkedNames, setCheckedNames] = useState<any>([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const res = await getConfirmationList(params.code) as any
      if (!res.message) {
        if (res.confirmedList || res.unconfirmedList) {
          setAnswered(true)
        } else {
          setConfirmationList(res)
          const checkedNames = new Array(res.originalList.length).fill(false)
          setCheckedNames(checkedNames)
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: res.message,
          confirmButtonColor: 'red',
        })
      }
      setLoading(false)
    }
    getData()
  }, [])

  const handleChange = (position: number) => {
    const updatedCheckedState = checkedNames.map((item: string, index: number) =>
      index === position ? !item : item
    );
    setCheckedNames(updatedCheckedState);
  }

  const handleConclusion = () => {
    if (checkedNames.every((item: any) => item === false)) {
      Swal.fire({
        icon: 'error',
        title: 'Ninguém selecionado!',
        text: 'Se de fato ninguém vai, clique no botão "Ninguém vai poder!"',
      })
      return
    }
    const confirmedList = confirmationList.originalList.filter(
      (_: string, index: number) => checkedNames[index]
    );
    const unconfirmedList = confirmationList.originalList.filter(
      (_: string, index: number) => !checkedNames[index]
    );
    Swal.fire({
      title: 'Por favor, revise sua confirmação:',
      icon: 'warning',
      html: `<strong>Vai poder ir:</strong> ${confirmedList.join(', ')}<br>${unconfirmedList.length ? `<strong>Não vai poder ir:</strong> ${unconfirmedList.join(', ')}` : ''}`,
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      confirmButtonText: 'Sim, confirmar!',
      cancelButtonText: 'Cancelar',
      focusCancel: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true)
        const response = await fetch(`/api/confirmation-list/confirm?code=${confirmationList.code}`, {
          body: JSON.stringify({ confirmedList, unconfirmedList }),
          method: 'POST'
        });
        const result = await response.json()
        if (!response.ok) {
          Swal.fire({
            icon: 'error',
            title: result.message,
            confirmButtonColor: 'red',
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: result.message,
            confirmButtonColor: 'green',
          })
          setAnswered(true)
        }
        setLoading(false)
      }
    })
  }

  const handleNobody = () => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá desfazer essa ação! (Se precisar, entre em contato com a gente!)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'green',
      focusCancel: true,
      confirmButtonText: 'Sim, ninguém vai poder!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true)
        const response = await fetch(`/api/confirmation-list/confirm?code=${confirmationList.code}`, {
          body: JSON.stringify({ confirmedList: null, unconfirmedList: confirmationList.originalList }),
          method: 'POST'
        });
        const result = await response.json()
        if (!response.ok) {
          Swal.fire({
            icon: 'error',
            title: result.message,
            confirmButtonColor: 'red',
          })
        } else {
          Swal.fire(
            'Muito obrigado pelo retorno!',
            'Sentiremos muito a sua falta! 😢',
            'success'
          )
          setAnswered(true)
        }
        setLoading(false)
      }
    })
  }

  return (
    <div className='bg-secondary-content h-screen'>
      <div className="bg-secondary-content max-w-xl flex flex-col items-center m-auto">
        <div className="hero" style={{ backgroundImage: `url(/pre-wedding-1.jpg)` }}>
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content p-0">
            <div className="max-w-md h-screen flex flex-col justify-center p-4">
              {loading ? <span className=" loading-lg loading loading-dots text-primary m-auto self-center"></span> : null}
              {!answered ? (
                <>
                  {!loading && (
                    <div className='flex flex-col justify-between h-full'>
                      <div className='flex flex-col justify-center items-center text-center'>
                        <h1 className='text-2xl font-bold'>Confirmação de Presença</h1>
                        <div className='mt-10 gap-4 flex flex-col'>
                          <p className='text-4xl font-bold'>Casamento<br />Laura & Quelvin</p>
                          <p className='text-2xl font-bold'>24/08/2024 às 10h30</p>
                          <p className='text-lg font-bold'><a target='_blank' className='link link-info' href='https://www.google.com.br/maps/place/Du+Alem%C3%A3o/@-22.3492525,-42.5053291,237m/data=!3m1!1e3!4m6!3m5!1s0x97897bcac6e15f:0xb2679bbb35a357e8!8m2!3d-22.3492538!4d-42.5049753!16s%2Fg%2F11bychzs19?entry=ttu'>Sítio Du Alemão - Rua Dr. Mário Haiut, Mury, Nova Friburgo, CEP: 28615-064</a></p>
                        </div>
                      </div>
                      <div className='flex flex-col gap-4'>
                        <div className='flex flex-col bg-white bg-opacity-80 p-4 rounded-xl items-center'>
                          <p className='mb-4 text-secondary-content'>Clique no nome das pessoas que <u>irão ao casamento!</u></p>
                          <div className='grid grid-cols-2 items-center gap-8 justify-between'>
                            {confirmationList.originalList.map((name: string, index: number) => (
                              <div className="form-control text-white" key={index}>
                                <label className="label cursor-pointer flex gap-2 items-center justify-center">
                                  <input
                                    type="checkbox"
                                    className="checkbox checkbox-info checkbox-lg"
                                    name={name}
                                    value={name}
                                    id={`${confirmationList.code}-${name}`}
                                    checked={checkedNames[index]}
                                    onChange={() => handleChange(index)} />
                                  <span className="label-text font-bold">{name}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                          <button
                            className='mt-5 btn btn-success w-32'
                            onClick={handleConclusion}
                          >Confirmar</button>
                        </div>
                        <button className='
                      text-md btn btn-link link-error'
                          onClick={handleNobody}
                        >Ninguém vai poder! 😢</button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <h1 className='bg-white bg-opacity-50 p-2 text-lg text-secondary-content rounded-xl mt-64'>Agradecemos pela confirmação!!</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
