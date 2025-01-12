import { HiOutlinePlusCircle } from "react-icons/hi";
import { FaRegCircle } from "react-icons/fa6";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function Abc() {
  useGSAP(() => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, i) => {
      const xLine = card.querySelector(".x-line");
      const yLine = card.querySelector(".y-line");
      const img = card.querySelector(".images");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "bottom 100%",
          end: "top 10%",
          toggleActions: "play none none reverse",
          markers: true, // Enable markers for debugging (remove in production)
        },
      });
      timeline.fromTo(xLine, { height: 0 }, { height: 304, duration: 1.2 });
      timeline.fromTo(
        yLine,
        { width: 0 },
        { width: 20, duration: 0.5 },
      );
      if (i % 2 !== 0) {
        timeline.fromTo(
          img,
          { opacity: 0, scale: 0, transformOrigin: `right` },
          { opacity: 1, scale: 1, duration: 0.5 },
        );
      } else {
        timeline.fromTo(
          img,
          { opacity: 0, scale: 0, transformOrigin: `left` },
          { opacity: 1, scale: 1, duration: 0.8 },
        );
      }
    });
  }, []);

  return (
    <main className="snap-y flex min-h-dvh w-full flex-col items-center justify-end bg-stone-200 p-10 overflow-y-auto scroll-snap-type-y-mandatory">
    <HiOutlinePlusCircle
      size={36}
      className="translate-y-1 cursor-pointer text-stone-600 duration-200 hover:rotate-90 hover:text-stone-800"
    />
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div
        key={i}
        className={`snap-center card flex ${i % 2 == 0 ? "-translate-x-[49.4%]" : "translate-x-[50%] flex-row-reverse"} scroll-snap-align-center`}
      >
        <div
          className={`images my-6 aspect-3/2 w-96 rounded-2xl bg-white p-3 shadow-xl drop-shadow-xl`}
        >
          <img
            className="h-full w-full rounded-xl object-cover"
            src="img.jpg"
          />
        </div>
        <div className="y-line flex w-5 items-center justify-center">
          <div className="w-full border border-stone-500"></div>
        </div>
        <div className="flex">
          <div className="x-line w-full border border-stone-500"></div>
        </div>
      </div>
    ))}
    <FaRegCircle size={32} className="text-stone-600" />
  </main>
  
  );
}

export default Abc;
