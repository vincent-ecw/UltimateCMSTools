/** CSS slot width required to preserve both dimensions when fitting the source. */
export function requiredImageWidth(width, height, sourceWidth, sourceHeight, fit) {
    if (width <= 0 || height <= 0 || sourceWidth <= 0 || sourceHeight <= 0) {
        return Math.ceil(Math.max(0, width));
    }

    const widthForHeight = height * sourceWidth / sourceHeight;
    const fittedWidth = fit === 'cover'
        ? Math.max(width, widthForHeight)
        : (fit === 'contain' ? Math.min(width, widthForHeight) : width);

    // Include the largest existing hover/active scaling (up to 10%).
    // The browser applies devicePixelRatio to this CSS-pixel width itself.
    return Math.ceil(fittedWidth * 1.1);
}
