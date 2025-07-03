export const getXFromDropPosition = (
    clientOffset: { x: number; y: number },
    trayElement: HTMLElement,
    productWidth: number
) : number => {
    const trayRect = trayElement.getBoundingClientRect();
    const relativeX = clientOffset.x - trayRect.left - (productWidth / 2);
    return Math.max(0, Math.round(relativeX / 5)* 5); //round to nearest 5mm
};