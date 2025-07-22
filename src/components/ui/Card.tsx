import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  className?: string
  animate?: boolean
}

const Card = ({ 
  children, 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor = 'text-blue-500',
  className = '',
  animate = true 
}: CardProps) => {
  const cardContent = (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {(title || Icon) && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div>
                {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className="h-full"
      >
        {cardContent}
      </motion.div>
    )
  }

  return cardContent
}

export default Card
