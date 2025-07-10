export type extractorType = 'low' | 'high';

export const extractorConstants = {
    LOW_EXTRACTOR_HEIGHT : 40,   // Default height for low EXTRACTOR products
    HIGH_EXTRACTOR_HEIGHT : 55,  // Default height for high EXTRACTOR products
    CLIP_DELTA: 0     // Default distance between clips in mm
}
export type ExtractorConstants = typeof extractorConstants;