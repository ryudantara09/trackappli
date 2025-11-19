import React from 'react';

// Use a broad type to accommodate both button and anchor props.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  as?: 'button' | 'a';
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  as = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: 'bg-primary-blue text-white border-transparent hover:bg-primary-dark focus:ring-primary-blue',
    secondary: 'bg-transparent text-primary-blue border-primary-blue hover:bg-primary-light',
    danger: 'bg-error text-white border-transparent hover:bg-red-700 focus:ring-error',
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (as === 'a') {
    // Cast props to `any` to allow passing anchor-specific props like `href`
    // and remove button-specific props like `type` to avoid invalid DOM attributes.
    const { type, ...anchorProps } = props as any;
    return (
      <a className={combinedClassName} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
