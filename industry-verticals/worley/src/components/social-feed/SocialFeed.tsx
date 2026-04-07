import React, { JSX, HTMLAttributes, useId } from 'react';
import {
  NextImage as ContentSdkImage,
  ImageField,
  Text,
  Field,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Fields {
  Image1: ImageField;
  Image2: ImageField;
  Image3: ImageField;
  Image4: ImageField;
  Image5: ImageField;
  Image6: ImageField;
  Caption1: TextField;
  Caption2: TextField;
  Caption3: TextField;
  Caption4: TextField;
  Caption5: TextField;
  Caption6: TextField;
  Heading: Field<string>;
}

export type PromoProps = ComponentProps & {
  fields: Fields;
};

interface GridImageProps extends HTMLAttributes<HTMLDivElement> {
  image: ImageField;
}

export const GridImage = ({ image, className, ...rest }: GridImageProps) => {
  return (
    <div className={`group relative overflow-hidden ${className}`} {...rest}>
      <ContentSdkImage
        field={image}
        className="image-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
      />
      <FontAwesomeIcon
        icon={faInstagram}
        className="text-background/70 absolute right-2 bottom-2 text-2xl"
      />
    </div>
  );
};

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const uid = useId();
  const {
    Heading,
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
    Caption1,
    Caption2,
    Caption3,
    Caption4,
    Caption5,
    Caption6,
  } = props.fields;

  const images = [
    { image: Image1, caption: Caption1 },
    { image: Image2, caption: Caption2 },
    { image: Image3, caption: Caption3 },
    { image: Image4, caption: Caption4 },
    { image: Image5, caption: Caption5 },
    { image: Image6, caption: Caption6 },
  ];

  return (
    <section className={`${props.params.styles} pt-0 pb-18`} id={id}>
      <div className="container space-y-8">
        <h2>
          <Text field={Heading} />
        </h2>
        <div className="flex justify-end">
          <div className="flex items-center gap-4">
            <button className={`social-carousel-prev-${uid}`} name="previous" aria-label="Previous">
              <ChevronLeft className="size-4" />
            </button>
            <div className="social-carousel-pagination flex !w-auto gap-1.5"></div>
            <button className={`social-carousel-next-${uid}`} name="next" aria-label="Next">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <Swiper
          spaceBetween={32}
          loop={true}
          modules={[Navigation, Keyboard, A11y, Pagination]}
          navigation={{
            prevEl: `.social-carousel-prev-${uid}`,
            nextEl: `.social-carousel-next-${uid}`,
            disabledClass: 'pointer-events-none opacity-50',
          }}
          pagination={{
            clickable: true,
            el: '.social-carousel-pagination',
            bulletClass: 'bg-background-accent size-2 rounded-full transition-all',
            bulletActiveClass: '!bg-accent',
            renderBullet: function (_index, className) {
              return `<span class=" ${className}"></span>`;
            },
          }}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            640: { slidesPerView: 2, slidesPerGroup: 2 },
            1024: { slidesPerView: 3, slidesPerGroup: 3 },
          }}
          a11y={{ enabled: true }}
          keyboard={{ enabled: true }}
        >
          {images.map(({ image, caption }, index) => (
            <SwiperSlide key={index}>
              <ContentSdkImage field={image} className="image-cover aspect-square" />
              <p className="mt-6 text-lg">
                <Text field={caption} />
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
