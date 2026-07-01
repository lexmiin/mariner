
type Props = {
  imgSrc: string
  imgAlt?: string
}

export default function CarouselSlide({ imgSrc, imgAlt = 'Carousel Item' }: Props) {

  return (
    <div className="min-w-full cursor-grab active:cursor-grabbing overflow-hidden aspect-3/2">
      <img alt={imgAlt} src={imgSrc} className="object-cover w-full h-full" />
    </div>
  )
}
