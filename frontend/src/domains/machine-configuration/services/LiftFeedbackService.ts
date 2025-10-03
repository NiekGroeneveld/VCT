import { Configuration } from "../types/configuration.types";

export const RecommendedV8LiftHeight = (config: Configuration): number => {
    const highestTrayDot = Math.max(...config.trays.map(tray => tray.dotPosition));

    if(config.ConfigurationType !== "VisionV8"){
        console.warn("RecommendedV8LiftHeight called on non-VisionV8 configuration");
        return 1; // Default to setting 1 if not VisionV8
    }

    if (!config.configurationTypeData?.elevatorDotIndicators) {
        console.warn("Elevator dot indicators not defined in configuration type data");
        return 1; // Default to setting 1 if data is missing
    }
    if (highestTrayDot >= config.configurationTypeData?.elevatorDotIndicators.at(-1)!) {
        return 1;
    }
    if (highestTrayDot >= config.configurationTypeData?.elevatorDotIndicators.at(-2)!) {
        return 2;
    }
    if (highestTrayDot <= config.configurationTypeData?.elevatorDotIndicators.at(-3)!) { 
        return 3;
    }
    if (highestTrayDot <= config.configurationTypeData?.elevatorDotIndicators.at(-2)!) { 
        return 4;
    }
    else{
        console.warn("Trays span multiple elevator levels, defaulting to setting 1");
        return 1; // Default to setting 1 if trays span multiple levels
    }
}

export const ConfigurationSupportsLift = (config: Configuration): boolean => {
    const lowestTrayDot = Math.min(...config.trays.map(tray => tray.dotPosition));
    const highestTrayDot = Math.max(...config.trays.map(tray => tray.dotPosition));

    if(config.ConfigurationType !== "VisionV8"){
        console.warn("ConfigurationSupportsLift called on non-VisionV8 configuration");
        return false; // Only VisionV8 supports lift
    }

    let elevatorDots = config.configurationTypeData?.elevatorDotIndicators;
    if (!elevatorDots || elevatorDots.length === 0) {
        console.warn("Elevator dot indicators not defined in configuration type data");
        return false; // Cannot determine support without data
    }
    
    let recommendedLiftHeight = RecommendedV8LiftHeight(config);
    if (recommendedLiftHeight < 1 || recommendedLiftHeight > 4) {
        console.warn("Invalid recommended lift height:", recommendedLiftHeight);
        return false; // Invalid lift height
    }

    if  ((lowestTrayDot < elevatorDots.at(recommendedLiftHeight - 1)! || highestTrayDot > elevatorDots.at(-recommendedLiftHeight)!)) {
        return false; // Setting 4 cannot cover all trays
    }

    return true; // All checks passed, lift is supported    
}

export const LiftFeedbackService = {
    RecommendedV8LiftHeight,
    ConfigurationSupportsLift
};

