import Swal from "sweetalert2"

export function handleClipboard() {
  navigator.clipboard.writeText('22992298716')

  Swal.fire({
    toast: true,
    text: '',
    title: 'Chave Copiada!',
    html: `
    <p><strong>Destino</strong>: Laura Medeiros da Rosa Bussinger - NuBank</p>
    <p><strong>Chave</strong>: 22992298716</p>
    `,
    icon: 'success',
    position: 'top-end',
    showConfirmButton: false,
    showCloseButton: true,
    timer: 10000,
    timerProgressBar: true,
  })
}