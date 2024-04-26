'use client'
import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { handleClipboard } from '../utils/handleClipboard';
import { FaRegClipboard } from "react-icons/fa";


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

type GiftCardProps = {
  item: WishList;
  forceUpdate: any;
};

export default function GiftCard({ item, forceUpdate }: GiftCardProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: any) {
    event.preventDefault();

    if (name.length) {
      const id = event.target.id.value;
      setLoading(true)

      await fetch(`/api/gifts-list/bought?id=${id}&name=${name}`, {
        method: 'POST'
      });

      forceUpdate()

      Swal.bindClickHandler();
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Item marcado como comprado com sucesso!",
        text: "Nós ficamos muito felizes, agradecemos mais uma veeez!!"
      });
    } else {
      Swal.bindClickHandler();
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
        showCloseButton: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Digite seu nome!",
      });
    };
    (document.getElementById(`${item.name}-${item.id}`) as HTMLDialogElement)?.close()
    setLoading(false)
  }

  function handleClipboardAddress() {
    navigator.clipboard.writeText('Rua Gonçalo Ribeiro, 08 - Fundos, Jardim Ouro Preto, Nova Friburgo, RJ, 28633-110')

    Swal.fire({
      toast: true,
      text: '',
      title: 'Endereço Copiado!',
      icon: 'success',
      position: 'top-end',
      showConfirmButton: false,
      showCloseButton: true,
      timer: 2000,
      timerProgressBar: true,
    })
  }

  return (
    <div className='text-slate-50 ' >
      <button className="btn btn-link text-xs" onClick={() => (document.getElementById(`${item.name}-${item.id}`) as HTMLDialogElement)?.showModal()}>Ver Detalhes</button>
      <dialog id={`${item.name}-${item.id}`} className="modal">
        <div className="modal-box bg-primary-content">
          <h3 className="font-bold text-lg">{item.name}</h3>
          <div className='py-4 flex flex-col gap-1'>
            {item.image &&
              <div className='flex items-center justify-center'>
                <Image src={item.image} alt={item.name} width={100} height={100} className='w-full h-full rounded-xl mb-2 min-w-40 max-w-56' />
                <hr />
              </div>
            }
            {item.link &&
              <p className="flex items-baseline justify-between"><strong>{item.isSugestion ? 'Inspiração:' : 'Queremos Este:'}</strong> <Link href={item.link} className='flex-1 text-center btn-link text-secondary text-xs font-bold'>Clique Aqui!</Link></p>
            }
            {item.type && <p><strong>Loja:</strong> {item.type}</p>}
            {item.local && <p><strong>Lugar:</strong> {item.local}</p>}
            {item.description && <p><strong>Descrição:</strong> {item.description}</p>}
            {item.preferences && <p><strong>Preferências:</strong> {item.preferences}</p>}
          </div>

          <hr />

          <div className="collapse collapse-arrow text-sm">
            <input type="radio" name="my-accordion-2" />
            <div tabIndex={0} className="collapse-title">
              Prefere dar o valor em pix?
            </div>
            <div className="collapse-content flex flex-col gap-1 ">
              <div className='items-center gap-2 flex w-full justify-between'>
                <p tabIndex={0} className=''>22992298716</p>
                <p className='text-green-500 text-lg cursor-pointer' onClick={handleClipboard}><FaRegClipboard /></p>
              </div>
              <p className='text-xs text-slate-700'>(Laura Medeiros da Rosa Bussinger - NuBank)</p>
            </div>
          </div>
          <div className="collapse collapse-arrow text-sm">
            <input type="radio" name="my-accordion-2" />
            <div tabIndex={0} className="collapse-title">
              Gostaria de enviar diretamente para nosso endereço?
            </div>
            <div className="collapse-content flex flex-col gap-1">
              <div className='items-center gap-2 flex w-full justify-between'>
                <p tabIndex={0}  >Rua Gonçalo Ribeiro, 08 - Fundos, Jardim Ouro Preto, Nova Friburgo, RJ, 28633-110</p>
                <p className='text-green-500 text-lg cursor-pointer' onClick={handleClipboardAddress}><FaRegClipboard className='' /></p>
              </div>
              <p className='text-xs text-slate-700'>(Se optar por isso, favor entrar em contato avisando!)</p>

            </div>
          </div>

          <hr />

          <form action="" className='my-4 w-full flex flex-col gap-2' onSubmit={handleSubmit}>
            <p>Você deu este presente?</p>
            <div className='flex flex-col gap-1'>
              <input type="text" name="name" id="name" placeholder="Seu Nome" className="input input-primary input-sm text-primary-content" value={name} onChange={(e) => setName(e.target.value)} />
              <span className='text-warning text-xs'>*Seu nome não será exibido publicamente!</span>
            </div>
            <input type="hidden" name="id" id="id" value={item.id} />
            {loading ? <span className=" loading-lg loading loading-dots text-primary m-auto self-center"></span> : <input type="submit" value="Marcar como Comprado" className="btn btn-primary btn-xs" />}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop ">
          <button>Fechar</button>
        </form>
      </dialog>
    </div>
  )
}