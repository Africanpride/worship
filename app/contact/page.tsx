import { Contact31 } from "@/components/contact31";
import React from "react";

const page = () => {
  return (
    <div className="space-y-4">
      <Contact31 />

        <div className='rounded-2xl dark:bg-slate-800 bg-slate-200 text-slate-900 dark:text-slate-300 shadow md:px-10 py-5 md:py-16 px-5 mb-5 md:mb-16 rounded-neat relative overflow-hidden'>
          <div className='w-72 h-72 absolute -right-20 -top-16 z-20 opacity-10 -rotate-45'>
            <span
              style={{
                boxSizing: "border-box",
                display: "block",
                overflow: "hidden",
                width: "initial",
                height: "initial",
                background: "none",
                opacity: 1,
                border: "0px",  
                margin: "0px",
                padding: "0px",
                position: "absolute",
                inset: "0px",
              }}
            >
              <img
                alt='Non-Stop Series Feedback'
                src='/images/feedback.svg'
                decoding='async'
                data-nimg='fill'
                className='object-fit'
                sizes='100vw'
                srcSet='/images/feedback.svg 640w, /images/feedback.svg 750w, /images/feedback.svg 828w, /images/feedback.svg 1080w, /images/feedback.svg 1200w, /images/feedback.svg 1920w, /images/feedback.svg 2048w, /images/feedback.svg 3840w'
                style={{
                  position: "absolute",
                  inset: "0px",
                  boxSizing: "border-box",
                  padding: "0px",
                  border: "none",
                  margin: "auto",
                  display: "block",
                  width: "0px",
                  height: "0px",
                  minWidth: "100%",
                  maxWidth: "100%",
                  minHeight: "100%",
                  maxHeight: "100%",
                }}
              />
              <noscript />
            </span>
          </div>
          <h2 className=' text-4xl '>Feedback</h2>
          <div className='my-2 text-base dark:text-white line-clamp-2'>
            Let you know how we're doing. (We read everything, butsometimes we
            can't answer.) <br />
            Please choose the relevant feedback option.
          </div>
          <br />
          <div className='flex md:gap-4 gap-8 flex-col md:flex-row justify-between '>
            <div>
              <h1 className='mb-3'>Testimonies</h1>
              <p className='leading-relaxed text-base mb-3 line-clamp-3'>
                Share your tesimonies with us with regards to what the Lord has
                done in your life through this experience.{" "}
              </p>
              <div className='flex items-center flex-wrap '>
                <a
                  className='text-yellow-500 dark:text-yellow-500 inline-flex items-center md:mb-2 lg:mb-0'
                  href='mailto:info@thenonstop.org'
                >
                  Click Here
                  <svg
                    className='w-4 h-4 ml-2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M5 12h14' />
                    <path d='M12 5l7 7-7 7' />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h1 className=' mb-3'>Suggestions</h1>
              <p className='leading-relaxed text-base mb-3 line-clamp-3'>
                We welcome your Spirit led suggestions on the overall
                organisation of the next Non-Stop Worship experience.
              </p>
              <div className='flex items-center flex-wrap '>
                <a
                  className='text-yellow-500 dark:text-yellow-500 inline-flex items-center md:mb-2 lg:mb-0'
                  href='mailto:info@thenonstop.org'
                >
                  Click Here
                  <svg
                    className='w-4 h-4 ml-2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M5 12h14' />
                    <path d='M12 5l7 7-7 7' />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h1 className=' mb-3'>Website Feedback</h1>
              <p className='leading-relaxed text-base mb-3 line-clamp-3'>
                We shall be glad to know your thoughts on ways we can improve
                the overall web presence to better serve you.
              </p>
              <div className='flex items-center flex-wrap '>
                <a
                  className='text-yellow-500 dark:text-yellow-500 inline-flex items-center md:mb-2 lg:mb-0'
                  href='mailto:webmaster@thenonstop.org'
                >
                  Click Here
                  <svg
                    className='w-4 h-4 ml-2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M5 12h14' />
                    <path d='M12 5l7 7-7 7' />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default page;
