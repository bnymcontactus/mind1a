document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var newGroup = null;

    // Initialize the canvas for drawing
    canvas.isDrawingMode = isDrawingMode;

    // Toggle button event listener
    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (!isDrawingMode && canvas.getActiveObject() && canvas.getActiveObject().type !== 'group') {
            var objectsToGroup = canvas.getActiveObject().getObjects();
            newGroup = new fabric.Group(objectsToGroup, { canvas: canvas });
            objectsToGroup.forEach(obj => canvas.remove(obj));
            canvas.add(newGroup);
        }
    });

    // Group selection event listener for drawing lines
    canvas.on('selection:created', function(e) {
        if (!isDrawingMode && newGroup && e.target && e.target.type === 'group' && e.target !== newGroup) {
            drawLineBetweenGroups(newGroup, e.target);
            newGroup = null; // Reset newGroup after drawing the line
        }
    });

    function drawLineBetweenGroups(group1, group2) {
        var lineCoords = [group1.left, group1.top, group2.left, group2.top];
        var line = new fabric.Line(lineCoords, {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false
        });
        canvas.add(line);

        // Add line update logic to group moving events
        group1.on('moving', function() { updateLinePosition(line, group1, group2); });
        group2.on('moving', function() { updateLinePosition(line, group1, group2); });
    }

    function updateLinePosition(line, startObj, endObj) {
        line.set({ 'x1': startObj.left, 'y1': startObj.top, 'x2': endObj.left, 'y2': endObj.top });
        canvas.requestRenderAll();
    }
});
