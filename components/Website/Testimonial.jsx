"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import slider1 from "@/public/assets/images/slider-1.png";
import slider2 from "@/public/assets/images/slider-2.png";
import slider3 from "@/public/assets/images/slider-3.png";
import slider4 from "@/public/assets/images/slider-4.png";
import Image from "next/image";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";

const testimonials = [
  {
    name: "Adewale Johnson",
    review: `This platform has been very reliable for my daily needs.
The features are easy to understand and work smoothly.
I am genuinely impressed with the overall quality.`,
    rating: 5,
  },
  {
    name: "Chinedu Okafor",
    review: `I found the service to be efficient and well structured.
Everything functions exactly as expected without delays.
It has made my workflow much easier.`,
    rating: 4,
  },
  {
    name: "Blessing Uche",
    review: `The user experience is simple and enjoyable.
I didn’t need much guidance to get started.
It delivers great value for the time invested.`,
    rating: 5,
  },
  {
    name: "Oluwaseun Adebayo",
    review: `This solution is thoughtfully designed and dependable.
Performance has been consistent since I started using it.
I would recommend it without hesitation.`,
    rating: 5,
  },
  {
    name: "Emeka Nwoye",
    review: `I appreciate how smooth and responsive everything feels.
Tasks are completed faster compared to other platforms.
Overall, it is a solid and trustworthy service.`,
    rating: 4,
  },
  {
    name: "Victoria Eze",
    review: `The layout is clean and very easy to navigate.
All the features work together seamlessly.
I have had a positive experience so far.`,
    rating: 4,
  },
  {
    name: "Samuel Ogunleye",
    review: `This product performs exactly as advertised.
I encountered no major issues during use.
It has exceeded my expectations.`,
    rating: 5,
  },
  {
    name: "Peace Onyekachi",
    review: `I enjoy how straightforward and intuitive the system is.
It saves time and reduces unnecessary effort.
The overall quality is commendable.`,
    rating: 4,
  },
  {
    name: "Daniel Ajayi",
    review: `The service is fast, stable, and reliable.
It handles tasks efficiently without lag.
I am satisfied with the performance.`,
    rating: 4,
  },
  {
    name: "Esther Obi",
    review: `Using this platform has been a great experience.
Everything works smoothly and looks professional.
I would gladly continue using it.`,
    rating: 5,
  },
];


const Testimonial = () => {

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        infinite: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
      },
    },
  ],
};

  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">
        Customer Review
      </h2>
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <div key={index} className="p-5">
            <div className="border rounded-lg p-5">
              <BsChatQuote size={30} className="mb-3" />
              <p className="mb-5">{item.review}</p>
              <h4 className="font-semibold">{item.name}</h4>
              <div className="flex mt-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <IoStar
                    key={`star${i}`}
                    className="text-yellow-400"
                    size={20}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;
