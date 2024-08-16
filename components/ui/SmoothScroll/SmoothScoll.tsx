"use client";
import { ReactLenis } from "@studio-freight/react-lenis";

function SmoothScroll({ children }:any) {
  return (
    <ReactLenis root options={{ duration:2.1,smoothWheel:true}}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;