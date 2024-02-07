/* eslint-disable jsx-a11y/alt-text */
import '../../../../../src/styles/NotFound.css'

import { Button } from '@mui/material'
import React, { useEffect, useRef } from 'react'

const NotFound: React.FC = () => {
  return (
    <>
      {/* ==================== MAIN ==================== */}
      <main className="mainNick">
        {/* ==================== HOME ==================== */}
        <section className="homeNick">
          <div className="homeNick__container container">
            <div className="homeNick__data">
              <span className="homeNick__subtitle">Error 404</span>
              {/* <h1 className="homeNick__title">Hey Buddy</h1> */}
              <h1 className="homeNick__title">Upss.....</h1>
              <p className="homeNick__description">
                No Pudimos Encontrar la página <br /> que buscabas.
              </p>
              {/* <a href="#" className="homeNick__button"> */}
              <Button className="homeNick__button" href="/">
                Volver a Inicio
              </Button>
            </div>

            <div className="homeNick__img">
              <img
                // src="https://github.com/Nicky-nn/Nicky-nn/blob/main/ghost-img.png?raw=true"
                src="/assets/images/ghost-img.png"
                alt=""
              />
              <div className="homeNick__shadow"></div>
            </div>
          </div>

          <footer className="homeNick__footer">
            <span>(591) 68048228</span>
            <span>|</span>
            <span>contactos@integrate.com.bo</span>
          </footer>
        </section>
      </main>
    </>
  )
}

export default NotFound

