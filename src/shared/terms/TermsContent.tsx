import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTermsSections } from './termsSection';



interface TermsContentProps {
  compact?: boolean;
}

export default function TermsContent({ compact = false }: TermsContentProps) {
  const { t } = useTranslation();
  const sections = getTermsSections(t);

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {sections.map((section) => {
        const IconComponent = section.icon;
        
        return (
          <div
            key={section.id}
            className={`bg-white rounded-lg ${compact ? '' : 'shadow-md'} overflow-hidden`}
          >
            <div className={`bg-emerald-50 px-${compact ? '4' : '6'} py-${compact ? '3' : '4'} border-b border-emerald-100`}>
              <h3 className={`${compact ? 'text-base' : 'text-xl'} font-bold text-gray-800 flex items-center`}>
                <span className="text-emerald-600 mr-3">
                  <IconComponent className={`h-${compact ? '5' : '6'} w-${compact ? '5' : '6'}`} />
                </span>
                {section.title}
              </h3>
            </div>
            
            <div className={`p-${compact ? '4' : '6'}`}>
              <ul className={`space-y-${compact ? '2' : '3'}`}>
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <CheckCircle className={`h-${compact ? '4' : '5'} w-${compact ? '4' : '5'} text-emerald-500 flex-shrink-0 mt-0.5`} />
                    <span className={`text-gray-700 leading-relaxed ${compact ? 'text-sm' : ''}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}