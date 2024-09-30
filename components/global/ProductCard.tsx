import React from 'react';
import Image from 'next/image';

interface ProductCardProps {
    productImage: string[];
    productPrice: number;
    productTitle: string;
    productDescription: string;
    city: string;
    postDate: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({productImage, productPrice, productTitle, productDescription, city, postDate}) => {
    return (
        <div className="flex flex-row justify-start rounded-lg border border-border-light-blue bg-white shadow-sm w-full overflow-hidden">
            <div>
                {productImage && productImage.length > 0 ? (
                    <Image
                        src={productImage[0]}
                        width={200}
                        height={200}
                        alt="Product Image"
                        className="object-cover md:h-36 h-36 md:w-36 w-36 rounded-lg m-2"
                    />
                ) : (
                    <Image
                        src={'/images/empityImage.png'}
                        width={200}
                        height={200}
                        alt="Product Image"
                        className="object-cover md:h-36 h-36 md:w-36 w-36 rounded-lg p-2"
                    />
                )}
            </div>
            <div className="p-3 md:w-2/3 w-2/5 justify-evenly flex flex-col">
                <h3 className="text-dark-blue font-avenir-arabic font-bold md:text-base text-sm">{productPrice} ر.س</h3>
                <h3 className="text-dark-blue font-avenir-arabic font-bold md:text-base text-sm text-limit">{productTitle}</h3>
                <h3 className="text-light-blue font-avenir-arabic font-light md:text-base text-sm line-clamp-2 text-ellipsis overflow-hidden">{productDescription}</h3>
                <div className="flex flex-row justify-start gap-2 mt-2">
                    <span className="flex flex-row justify-start gap-1 items-center">
                        <i className="ri-map-pin-range-fill text-base text-light-blue"></i>
                        <p className="font-avenir-arabic font-light md:text-sm text-xs text-limit text-light-blue">{city}</p>
                    </span>
                    <span className="flex flex-row justify-start gap-1 items-center">
                        <i className="ri-calendar-fill text-base text-light-blue"></i>
                        <p className="font-avenir-arabic font-light md:text-sm text-xs text-limit text-light-blue">{postDate}</p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;