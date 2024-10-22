import { panelButtonCoordinate } from "./coordinateDonggi";
import { menuButton } from "./coordinates";

export const menuButtonDonggi = (ctx, canvasWidth, canvasHeight) => {
    // Draw buttons
    menuButton.forEach(button => {
        const btnX = button.x * canvasWidth;
        const btnY = button.y * canvasHeight;
        const btnWidth = button.width * canvasWidth;
        const btnHeight = button.height * canvasHeight;

        // Draw button background
        ctx.fillStyle = 'transparent';
        ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

        // Draw button background
        // ctx.fillStyle = 'transparent';
        // ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

        // Optionally draw button visuals here

        button.bounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
    });

}

export const panelButtonDonggi = (ctx, canvasWidth, canvasHeight) => {
    // Draw Panel
    panelButtonCoordinate.forEach(panel => {
        const panelX = panel.x * canvasWidth;
        const panelY = panel.y * canvasHeight;
        const panelWidth = panel.width * canvasWidth;
        const panelHeight = panel.height * canvasHeight;

        // Draw panel background
        ctx.fillStyle = 'transparent';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

        // Draw panel label
        // ctx.fillStyle = 'transparent';
        // ctx.font = `${panelHeight * 0.1}px Arial`;
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.fillText(panel.label, panelX + panelWidth / 2, panelY + panelHeight / 2);

        panel.bounds = { x: panelX, y: panelY, width: panelWidth, height: panelHeight };
    });
}

export const boundClickDonggi = (x, y, router) => {

    menuButton.forEach(button => {
        if (
            x > button.bounds.x && x < button.bounds.x + button.bounds.width &&
            y > button.bounds.y && y < button.bounds.y + button.bounds.height
        ) {
            // Navigate to the respective page without a full page refresh
            router.push(button.href);
        }
    });

    panelButtonCoordinate.forEach(panel => {
        if (
            x > panel.bounds.x && x < panel.bounds.x + panel.bounds.width &&
            y > panel.bounds.y && y < panel.bounds.y + panel.bounds.height
        ) {
            // Navigate to the respective page without a full page refresh
            router.push(panel.href);
        }
    });
}

export const boundHoverDonggi = (x, y, canvas) => {

    let hovering = false

    menuButton.forEach(button => {
        if (
            x > button.bounds.x && x < button.bounds.x + button.bounds.width &&
            y > button.bounds.y && y < button.bounds.y + button.bounds.height
        ) {
            hovering = true
        }
    });

    panelButtonCoordinate.forEach(panel => {
        if (
            x > panel.bounds.x && x < panel.bounds.x + panel.bounds.width &&
            y > panel.bounds.y && y < panel.bounds.y + panel.bounds.height
        ) {
            hovering = true
        }
    });

    if (hovering) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
}