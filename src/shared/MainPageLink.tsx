import { t } from 'i18next'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const MainPageLink = () => {
    
  return (
        <Link
             to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
            <Home className="h-5 w-5" />
          <span>{t('common.toMain')}</span>
        </Link>
  )
}

export default MainPageLink