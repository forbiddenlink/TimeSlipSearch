"use client"

import React, { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    tiltMaxAngle?: number
    scaleOnHover?: number
}

export function TiltCard({
    children,
    className,
    tiltMaxAngle = 5,
    scaleOnHover = 1.02,
    ...props
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -tiltMaxAngle
        const rotateY = ((x - centerX) / centerX) * tiltMaxAngle

        setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setRotation({ x: 0, y: 0 })
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    return (
        <motion.div
            ref={ref}
            className={cn("relative preserve-3d", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            animate={{
                rotateX: rotation.x,
                rotateY: rotation.y,
                scale: isHovered ? scaleOnHover : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.5
            }}
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
            }}
            {...props as any}
        >
            {/* Glare effect */}
            <div
                className={cn(
                    "absolute inset-0 z-50 pointer-events-none rounded-[inherit]",
                    "bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-300",
                    isHovered ? "opacity-100" : ""
                )}
                style={{
                    transform: `translateX(${rotation.y * 2}px) translateY(${rotation.x * 2}px)`
                }}
            />

            {children}
        </motion.div>
    )
}
