import Swal from "sweetalert2"

export default function Hero() {

  function handleClipboard() {
    navigator.clipboard.writeText('22981133063')

    Swal.fire({
      toast: true,
      text: '',
      title: 'Chave Copiada!',
      html: `
      <p><strong>Destino</strong>: Quelvin Machado de Paula - Pagseguro / Pagbank</p>
      <p><strong>Chave</strong>: 22981133063</p>
      `,
      icon: 'success',
      position: 'top-end',
      showConfirmButton: false,
      showCloseButton: true,
      timer: 10000,
      timerProgressBar: true,
    })
  }
  return (
    <div className="hero min-h-screen" style={{ backgroundImage: `url(quelvin-e-laura.jpg)` }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">
            <p>Quelvin</p>
            <p>&</p>
            <p>Laura</p>
          </h1>
          <p className="mb-5 mt-64">Agradecemos muuuito seu interesse em nos ajudar nesse momento tão especial de preparativos! O que puder ajudar, será muito bem-vindo! Qualquer dúvida é só falar com a gente ❤️</p>
          <a href="#lista" className="btn btn-primary">Ir para Lista de Presentes</a>
          <p className="mt-5 text-xs ">Quer fazer algum pix?</p>
          <p className="font-bold btn-link text-xs" onClick={handleClipboard}>Copie a Chave Aqui</p>
        </div>
      </div>
    </div>
  )
}