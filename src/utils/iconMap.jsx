import React from 'react';
import {
  Coffee,
  Fuel,
  Utensils,
  UtensilsCrossed,
  Smartphone,
  Dumbbell,
  Beer,
  ShoppingCart,
  Sparkles,
  Car,
  HelpCircle,
  Home,
  Wifi,
  Zap,
  Tv,
  ShieldCheck,
  CreditCard,
  FileText,
  Shield,
  Plane,
  Laptop,
  Heart,
  TrendingUp,
  Tag,
  Gamepad2,
  Pill,
  Cookie,
  Briefcase,
  ArrowRightLeft,
  Building2,
  Banknote,
  Send,
  PlusCircle,
  Coins,
  Music,
  Film,
  Shirt,
  Flame,
  PawPrint,
  Dog,
  Cat,
  Stethoscope,
  Wrench,
  Bike,
  Package,
  Fish,
  AlertCircle,
  Smile,
  Hammer,
  Users
} from 'lucide-react';

// Icono Sushi oficial de Lucide Lab
const SushiIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M22 10a2 2 0 0 1-2 2h-.5l-5.6-1.4c-1.1-.3-2.8-.3-3.9 0L4.4 12H4a2 2 0 0 1-2-2 4 4 0 0 1 4-4h12a4 4 0 0 1 4 4" />
    <path d="m6 11 1-5" />
    <path d="m10 10 1-4" />
    <path d="m14 10 1-4" />
    <path d="m18 11 1-4" />
    <path d="M20 12v4a2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0v-4" />
  </svg>
);

const iconComponents = {
  Coffee,
  Fuel,
  Utensils,
  UtensilsCrossed,
  Smartphone,
  Dumbbell,
  Beer,
  ShoppingCart,
  Sparkles,
  Car,
  HelpCircle,
  Home,
  Wifi,
  Zap,
  Tv,
  ShieldCheck,
  CreditCard,
  FileText,
  Shield,
  Plane,
  Laptop,
  Heart,
  TrendingUp,
  Tag,
  Gamepad2,
  Pill,
  Cookie,
  Briefcase,
  ArrowRightLeft,
  Building2,
  Banknote,
  Send,
  PlusCircle,
  Coins,
  Music,
  Film,
  Shirt,
  Flame,
  PawPrint,
  Dog,
  Cat,
  Stethoscope,
  Wrench,
  Bike,
  Package,
  Fish,
  AlertCircle,
  Smile,
  Hammer,
  Users,
  Sushi: SushiIcon,
};

export const renderIcon = (name, className = 'w-5 h-5') => {
  const IconComponent = iconComponents[name] || Tag;
  return <IconComponent className={className} />;
};
