import {Product, PlacedProduct} from '../types/product.types';
import { extractorConstants } from '../types/extractor.types';      

export const getCanalHeight = (product: PlacedProduct): number => {
    return product.extractorHeight + product.height;
};

export const getCanalHeightProduct = (product : Product): number => {
    return product.height + (
        product.stable 
            ? extractorConstants.LOW_EXTRACTOR_HEIGHT 
            : extractorConstants.HIGH_EXTRACTOR_HEIGHT
    );
};
        