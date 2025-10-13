import { 
  FileText, 
  Shield, 
  Truck, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Users
} from 'lucide-react';

export const getTermsSections = (t: (key: string) => string) => [
  {
    id: "general",
    title: t("terms.sections.general.title"),
    icon: FileText,
    content: [
      t("terms.sections.general.content.0"),
      t("terms.sections.general.content.1"),
      t("terms.sections.general.content.2"),
      t("terms.sections.general.content.3"),
      t("terms.sections.general.content.4"),
    ]
  },
  {
    id: "sellers",
    title: t("terms.sections.sellers.title"),
    icon: Users,
    content: [
      t("terms.sections.sellers.content.0"),
      t("terms.sections.sellers.content.1"),
      t("terms.sections.sellers.content.2"),
      t("terms.sections.sellers.content.3"),
      t("terms.sections.sellers.content.4"),
      t("terms.sections.sellers.content.5"),
      t("terms.sections.sellers.content.6"),
      t("terms.sections.sellers.content.7"),
    ]
  },
  {
    id: "products",
    title: t("terms.sections.products.title"),
    icon: CheckCircle,
    content: [
      t("terms.sections.products.content.0"),
      t("terms.sections.products.content.1"),
      t("terms.sections.products.content.2"),
      t("terms.sections.products.content.3"),
      t("terms.sections.products.content.4"),
    ]
  },
  {
    id: "ordering",
    title: t("terms.sections.ordering.title"),
    icon: CreditCard,
    content: [
      t("terms.sections.ordering.content.0"),
      t("terms.sections.ordering.content.1"),
      t("terms.sections.ordering.content.2"),
      t("terms.sections.ordering.content.3"),
      t("terms.sections.ordering.content.4"),
    ]
  },
  {
    id: "delivery",
    title: t("terms.sections.delivery.title"),
    icon: Truck,
    content: [
      t("terms.sections.delivery.content.0"),
      t("terms.sections.delivery.content.1"),
      t("terms.sections.delivery.content.2"),
      t("terms.sections.delivery.content.3"),
      t("terms.sections.delivery.content.4"),
    ]
  },
  {
    id: "warranty",
    title: t("terms.sections.warranty.title"),
    icon: Shield,
    content: [
      t("terms.sections.warranty.content.0"),
      t("terms.sections.warranty.content.1"),
      t("terms.sections.warranty.content.2"),
      t("terms.sections.warranty.content.3"),
      t("terms.sections.warranty.content.4"),
    ]
  },
  {
    id: "returns",
    title: t("terms.sections.returns.title"),
    icon: RefreshCw,
    content: [
      t("terms.sections.returns.content.0"),
      t("terms.sections.returns.content.1"),
      t("terms.sections.returns.content.2"),
      t("terms.sections.returns.content.3"),
      t("terms.sections.returns.content.4"),
    ]
  },
  {
    id: "responsibilities",
    title: t("terms.sections.responsibilities.title"),
    icon: AlertCircle,
    content: [
      t("terms.sections.responsibilities.content.0"),
      t("terms.sections.responsibilities.content.1"),
      t("terms.sections.responsibilities.content.2"),
      t("terms.sections.responsibilities.content.3"),
      t("terms.sections.responsibilities.content.4"),
    ]
  },
  {
    id: "seasonal",
    title: t("terms.sections.seasonal.title"),
    icon: Clock,
    content: [
      t("terms.sections.seasonal.content.0"),
      t("terms.sections.seasonal.content.1"),
      t("terms.sections.seasonal.content.2"),
      t("terms.sections.seasonal.content.3"),
      t("terms.sections.seasonal.content.4"),
    ]
  }
];