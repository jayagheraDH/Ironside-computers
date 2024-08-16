import React from 'react'
import { useInView } from 'react-intersection-observer'

const BuilderVideoTextBanner = (props: any) => {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      className={`cta-banner ${inView ? 'Visible' : 'Not-visible'}`}
    >
      <div className="cta-banner-img">
        <video
          poster={props?.posterVideo}
          width="100%"
          controls={false}
          autoPlay
          loop
          muted
        >
          <source type="video/mp4" src={props?.video}></source>
        </video>
      </div>
      <div className="cta-banner-content flex flex-direction align-v-center justify-center">
        <h3>{props.heading}</h3>
        <p className="m-0">{props.description}</p>
        <img className="signature" src={props.creativeTeam} />
      </div>
    </div>
  )
}

export default BuilderVideoTextBanner
