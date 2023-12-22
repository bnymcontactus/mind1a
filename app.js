document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var currentGroup = null;
    var previousGroup = null;

    // Initialize watermark
    var watermark = new fabric.Text('Watermark', {
        fontSize: 100,
        fill: 'grey',
        left: 50,
        top: 50,
        selectable: false,
        evented: false
    });
    canvas.add(watermark);
    canvas.sendToBack(watermark);

    // Enable drawing mode
    canvas.isDrawingMode = isDrawingMode;

    // Toggle between drawing and grouping mode
    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (!isDrawingMode) {
            // Grouping mode
            var objectsToGroup = canvas.getObjects().filter(obj => obj.type !== 'group' && obj !== watermark);
            if (objectsToGroup.length > 0) {
                previousGroup = currentGroup;
                currentGroup = new fabric.Group(objectsToGroup, { canvas: canvas });
                canvas.add(currentGroup);
                objectsToGroup.forEach(obj => canvas.remove(obj));
            }
        }
    });

    // Function to create a line
    function createLine(from, to) {
        var coords = [from.left, from.top, to.left, to.top];
        var line = new fabric.Line(coords, {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false
        });
        canvas.add(line);
        return line;
    }

    // Update line position
    function updateLine(line) {
        var points = [line.start.left, line.start.top, line.end.left, line.end.top];
        line.set({ x1: points[0], y1: points[1], x2: points[2], y2: points[3] });
        canvas.renderAll();
    }

    // Create a line between the previous and current groups
    canvas.on('selection:created', function(e) {
        if (!isDrawingMode && previousGroup && e.target === currentGroup) {
            var line = createLine(previousGroup, currentGroup);
            // Attach the line to both groups
            line.start = previousGroup;
            line.end = currentGroup;
            previousGroup.line = line;
            currentGroup.line = line;

            // Update line position when groups move
            previousGroup.on('moving', function() { updateLine(line); });
            currentGroup.on('moving', function() { updateLine(line); });
        }
    });
});
