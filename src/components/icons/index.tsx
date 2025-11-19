// Collection of SVG icons for the Mental Health Club website
import React from 'react';
import {
  Calendar,
  BookOpen,
  Users,
  Lightbulb,
  Heart,
  Building2,
  MapPin,
  FileText,
  Check as LucideCheck,
  Shield,
  Zap,
  Scale,
  Mail,
  Clock,
  Eye,
  Home,
  Menu,
  MessageCircle,
  BarChart3,
  User as LucideUser,
  AlertTriangle,
  Volume2,
  Sun,
  Camera,
} from 'lucide-react';

interface IconProps {
  className?: string;
  ariaLabel?: string;
}

const withA11y = (Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>) => {
  const WrappedIcon = ({ className = 'w-6 h-6', ariaLabel }: IconProps) => (
    <Icon
      className={className}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
  WrappedIcon.displayName = `A11yIcon(${Icon.displayName || Icon.name || 'Component'})`;
  return WrappedIcon;
};

export const CalendarIcon = withA11y(Calendar);
export const BookIcon = withA11y(BookOpen);
export const PeopleIcon = withA11y(Users);
export const LightbulbIcon = withA11y(Lightbulb);
export const HeartIcon = withA11y(Heart);
export const BuildingIcon = withA11y(Building2);
export const LocationIcon = withA11y(MapPin);
export const DocumentIcon = withA11y(FileText);
export const CheckIcon = withA11y(LucideCheck);
export const ShieldIcon = withA11y(Shield);
export const LightningIcon = withA11y(Zap);
export const BalanceIcon = withA11y(Scale);
export const EmailIcon = withA11y(Mail);
export const ClockIcon = withA11y(Clock);
export const EyeIcon = withA11y(Eye);
export const HomeIcon = withA11y(Home);
export const MenuIcon = withA11y(Menu);
export const ChatIcon = withA11y(MessageCircle);
export const ChartIcon = withA11y(BarChart3);
export const UserIcon = withA11y(LucideUser);
export const WarningIcon = withA11y(AlertTriangle);
export const SoundIcon = withA11y(Volume2);

// Extra icon for Monthly Awareness
export const SunIcon = withA11y(Sun);
export const CameraIcon = withA11y(Camera);