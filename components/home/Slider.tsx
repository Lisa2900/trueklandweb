"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SliderItem {
  id?: string
  name: string
  image: string
  description?: string
}

interface SliderProps {
  sliderList: SliderItem[]
}

export default function Slider({ sliderList }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  console.log("Slider List:", sliderList)

  useEffect(() => {
    if (sliderList.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderList.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [sliderList.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sliderList.length) % sliderList.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderList.length)
  }

  if (sliderList.length === 0) {
    return (
      <div className="relative h-48 md:h-64 glass-effect rounded-3xl flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/20 to-[#fcf326]/20"></div>
        <div className="relative text-center z-10">
          <h3 className="text-2xl font-bold mb-2 gradient-text">¡Bienvenido a TrueKland!</h3>
          <p className="text-lg text-gray-600">Descubre increíbles oportunidades de intercambio</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden group glass-effect">
      <div className="relative w-full h-full">
        <Image
          src={sliderList[currentIndex]?.image || "/placeholder.svg?height=300&width=800"}
          alt={sliderList[currentIndex]?.name || "Slider"}
          fill
          className="object-cover transition-all duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-1">{sliderList[currentIndex]?.name}</h3>
          {sliderList[currentIndex]?.description && (
            <p className="text-sm md:text-base opacity-90">{sliderList[currentIndex].description}</p>
          )}
        </div>
      </div>

      {sliderList.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 glass-effect hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 glass-effect hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 right-4 flex space-x-2">
            {sliderList.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
