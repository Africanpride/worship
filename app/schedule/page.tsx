import LocomotiveScrollWrapper from "@/components/LocomotiveScrollWrapper";

export default function Home() {
  return (
    <LocomotiveScrollWrapper>
      <h1 className="title">Basic Usage</h1>
      <div className="wrapper">
        <div className="box" data-scroll data-scroll-speed="-0.2"></div>
        <div className="box" data-scroll data-scroll-speed="0.3"></div>
      </div>
      <div style={{ height: "200vh" }}></div>
    </LocomotiveScrollWrapper>
  );
}
