import { Configuration } from "../types/configuration.types";

export const RecommendedV8LiftHeight = (config: Configuration): number => {
    const highestTrayDot = Math.max(...config.trays.map(tray => tray.dotPosition));

    const configurationType = config.configurationTypeData?.configurationType || config.ConfigurationType;
    
    if(configurationType !== "VisionV8"){
        console.warn("RecommendedV8LiftHeight called on non-VisionV8 configuration");
        return 1; // Default to setting 1 if not VisionV8
    }

    if (!config.configurationTypeData?.elevatorDotIndicators) {
        console.warn("Elevator dot indicators not defined in configuration type data");
        return 1; // Default to setting 1 if data is missing
    }

    console.log("Highest tray dot:", highestTrayDot);
    console.log("Elevator dot indicators:", config.configurationTypeData.elevatorDotIndicators);
    if (highestTrayDot > config.configurationTypeData?.elevatorDotIndicators.at(-2)!) {
        return 1; 
    }
    if (highestTrayDot > config.configurationTypeData?.elevatorDotIndicators.at(-3)!) {

        return 2;
        
    }
    if (highestTrayDot > config.configurationTypeData?.elevatorDotIndicators.at(-4)!) { 
       return 3;
    }
    else{
        return 4; // Default to setting 1 if trays span multiple levels
    }
    
}
/* feature does not work properly */
export const ConfigurationSupportsLiftSetting = (config: Configuration): boolean => {
    const lowestTrayDot = Math.min(...config.trays.map(tray => tray.dotPosition));
    const highestTrayDot = Math.max(...config.trays.map(tray => tray.dotPosition));

    const configurationType = config.configurationTypeData?.configurationType || config.ConfigurationType;
    
    if(configurationType !== "VisionV8"){
        console.warn("ConfigurationSupportsLift called on non-VisionV8 configuration");
        return false; // Only VisionV8 supports lift
    }

    let elevatorDots = config.configurationTypeData?.elevatorDotIndicators;
    if (!elevatorDots || elevatorDots.length === 0) {
        console.warn("Elevator dot indicators not defined in configuration type data");
        return false; // Cannot determine support without data
    }
    
    let recommendedLiftHeight = RecommendedV8LiftHeight(config);
    console.log(elevatorDots);
    console.log("Lowest tray dot:", lowestTrayDot);
    console.log("Highest tray dot:", highestTrayDot);
    console.log("Recommended lift height:", recommendedLiftHeight);
    if (recommendedLiftHeight < 1 || recommendedLiftHeight > 4) {
        console.warn("Invalid recommended lift height:", recommendedLiftHeight);
        return false; // Invalid lift height
    }

    if  ((lowestTrayDot > elevatorDots.at(recommendedLiftHeight - 1)! && highestTrayDot < elevatorDots.at(elevatorDots.length-(recommendedLiftHeight-1))!)) {
        console.log("Configuration does not support the recommended lift setting");
        return false; // Setting 4 cannot cover all trays
    }

    return true; // All checks passed, lift is supported    
}

export const LiftFeedbackService = {
    RecommendedV8LiftHeight,
};

