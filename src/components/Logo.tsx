'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} relative mr-2 flex-shrink-0`}>
        <Image
          src="/strathmore-logo.png"
          alt="Strathmore University Logo"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-su-blue to-su-red rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-xs">SU</span>
                </div>
              `;
            }
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-su-blue ${textSizeClasses[size]} leading-tight`}>
            Strathmore University
          </span>
          <span className="text-su-red text-xs font-semibold leading-tight">
            Mental Health Club
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;