import { handleClipboard } from "../utils/handleClipboard"

export default function Hero() {


  return (
    <div className="hero min-h-screen" style={{ backgroundImage: `url(/quelvin-e-laura.jpg)` }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md h-screen flex flex-col justify-center ">
          <h1 className="mb-32 text-5xl font-bold">
            <p>Quelvin</p>
            <p>&</p>
            <p>Laura</p>
          </h1>
          <p className="mb-5 mt-64">Se desejarem nos presentear, a lista de presentes pode ser encontrada nas lojas:</p>
          <ul>
            <li>Bazar Opção Utilidades</li>
            <li>Super Louças</li>
            <li>Casa & Cia (Alberto Braune)</li>
          </ul>
          <p>Agradecemos de coração qualquer carinho! ❤️</p>
          <p className="mt-5 text-xs ">Quer fazer um pix?</p>
          <p className="font-bold btn-link text-xs" onClick={handleClipboard}>Copie a Chave Aqui</p>
        </div>
      </div>
    </div>
  )
}
