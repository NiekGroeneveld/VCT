import {Product, PlacedProduct} from "../types/product.types";

export const getPalletConfigurationString = (product: PlacedProduct, palletDelta?: number): string => {
    if (!palletDelta || palletDelta <= 0) {
        console.warn("Cannot get pallet configuration: Invalid pallet delta");
        return "unknown";
    }

    const productDepth = product.depth;
    const productWidth = product.width;
    const palletDeltaMM = palletDelta/10;

    const amountOfDots = Math.ceil(productDepth / palletDeltaMM);

    const gapString = amountOfDots <= 4 ? '.'.repeat(amountOfDots) : amountOfDots.toString();
    


    return productWidth > 100 ? "/" + gapString + "/" + amountOfDots + "/" : "/" + gapString + "/" ;
}