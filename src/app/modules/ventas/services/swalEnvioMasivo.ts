import Swal from 'sweetalert2'

import { EmisionMasivaProps } from '../interfaces/emisionMasiva.interface'

export const swalEnvioMasivo = (resp: EmisionMasivaProps) => {
  const html = `
  <p>Estado de importación: <strong style="color: ${
    resp.estado === 'ELABORADO' ? 'green' : 'red'
  }">${resp.estado}</strong></p>
  <p>
  ${
    resp.estado === 'ELABORADO'
      ? `<span style="color: green">El paquete de facturas se ha subido correctamente, ahora puede enviar los paquetes al SIN.</span>`
      : `<span style="color: red">Existen documentos observados. las mismas se detallan a continuación</span>`
  }
  </p>
  <p>
    Observaciones:
    <ul style="padding-left: 20px; line-height: 25px">
      ${resp.archivos
        .map(
          (a) =>
            `<li><strong style="font-size: 0.81em; color: #673AB7">Fila: </strong>${
              a.fila
            }; &nbsp;&nbsp;<strong style="font-size: 0.81em; color: #673AB7">Nro.Fact: </strong>${
              a.numeroFactura
            }; &nbsp;&nbsp;<strong style="font-size: 0.81em; color: #673AB7">Msg.: </strong> ${a.errores.join(
              ', ',
            )}</li>`,
        )
        .join('')}
    </ul>
    <span>${resp.archivos.length === 0 ? 'NINGUNO' : ''}</span>
  </p>
  `
  Swal.fire({
    title: 'Respuesta!!',
    width: '850px',
    customClass: 'swalError',
    allowEscapeKey: false,
    allowOutsideClick: false,
    html: html,
  }).then()
}
