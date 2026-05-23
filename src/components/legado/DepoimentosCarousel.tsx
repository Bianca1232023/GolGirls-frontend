import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { DEPOIMENTOS } from '../../data/mockData'

export function DepoimentosCarousel() {
  const [index, setIndex] = useState(0)
  const d = DEPOIMENTOS[index]

  function prev() {
    setIndex((i) => (i === 0 ? DEPOIMENTOS.length - 1 : i - 1))
  }
  function next() {
    setIndex((i) => (i === DEPOIMENTOS.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="gg-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={d.id}
          className="gg-card gg-carousel__slide"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <Quote className="text-[#ff1493] mb-2" size={28} />
          <p className="italic text-base leading-relaxed">&ldquo;{d.quote}&rdquo;</p>
          <p className="font-semibold text-sm mt-3 mb-0">{d.author}</p>
          <span className="text-xs text-[#ff1493]">{d.role}</span>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center items-center gap-4 mt-3">
        <button type="button" className="gg-carousel__nav" onClick={prev} aria-label="Anterior">
          <ChevronLeft size={22} />
        </button>
        <span className="text-xs text-gray-500">
          {index + 1} / {DEPOIMENTOS.length}
        </span>
        <button type="button" className="gg-carousel__nav" onClick={next} aria-label="Próximo">
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  )
}
