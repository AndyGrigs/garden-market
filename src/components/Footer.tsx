import { Facebook, Instagram, Leaf, Youtube } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-emerald-900 text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-bold">{t('header.title')}</span>
          </div>
          <p className="text-emerald-200">
            {t('footer.description')}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-emerald-200 hover:text-white transition-colors">
                {t('footer.home')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-emerald-200 hover:text-white transition-colors">
                {t('footer.about')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-emerald-200 hover:text-white transition-colors">
                {t('footer.contact')}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-emerald-200 hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
          <ul className="space-y-2 text-emerald-200">
            <li>{t('footer.address')}</li>
            <li>
              <a href="tel:+1234567890" className="hover:text-white transition-colors">
              +373 79 748 131
              </a>
            </li>
            <li>
              <a href="mailto:info@gardentrees.com" className="hover:text-white transition-colors">
                info@gardentrees.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t('footer.followUs')}</h3>
          <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-200 hover:text-white transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </a>
            <a
              href="https://www.youtube.com/@paulowniamoldova2675"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-200 hover:text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-200 hover:text-white transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-emerald-200">
        <p>
          © {currentYear} Covaci Trees. {t('footer.rights')}
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer


