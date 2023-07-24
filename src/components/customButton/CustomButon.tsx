import React from "react";
// @ts-ignore
import {LoadingIcon, Lucide} from "@/components";


interface Props {
    children?: React.ReactNode;
    onClick?: () => void;
    isLoading?: boolean;
    className?: string,
    widthIconSize?: string,
    heightIconSize?: string,
    type?: any,
    icon?: any
    iconColor?: any
    disabled?: any,
}

const CustomButton: React.FC<Props> = ({
                                           children,
                                           onClick,
                                           className,
                                           type,
                                           icon,
                                           iconColor,
                                           widthIconSize,
                                           heightIconSize,
                                           disabled,
                                           isLoading,
                                       }) => {
    return (
        <button
            onClick={onClick}
            className={className}
            type={type}
            disabled={disabled || isLoading}
        >
            {isLoading ?
                <div className="flex">
                    <LoadingIcon icon="spinning-circles" color="white" className="w-4 h-4 mr-1"/>
                    Loading
                </div>
                : icon ? <div className="flex items-center">
                    <Lucide icon={icon} color={iconColor} className={`${widthIconSize} ${heightIconSize} mr-1`} />
                    {children}
                </div> : icon && !children ? <div className="flex">
                    <Lucide icon={icon} color={iconColor} className={`${widthIconSize} ${heightIconSize} mr-1`} />
                </div> : children}
        </button>
    );
}

export default CustomButton;
