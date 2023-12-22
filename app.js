document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var currentGroup = null;
    var lastGroup = null;

    // Enable free drawing by default
    canvas.isDrawingMode = isDrawingMode;

    // Create a watermark
    var watermark = new fabric.Text('2', {
        fontSize: 100,
        fill: 'grey',
        left: 50,
        top: 50,
        selectable: false,
        evented: false
    });
    canvas.add(watermark);
    canvas.sendToBack(watermark);

    // Function to create a line
    function createLine(fromGroup, toGroup) {
        var points = [fromGroup.left, fromGroup.top, toGroup.left, toGroup.top];
        var line = new fabric.Line(points, {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false
        });

        canvas.add(line);
        return line;
    }

    // Update line position when groups move
    function updateLine(line) {
        var points = [line.start.left, line.start.top, line.end.left, line.end.top];
        line.set({ x1: points[0], y1: points[1], x2: points[2], y2: points[3] });
        canvas.renderAll();
    }

    // Toggle drawing and grouping mode
    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (!isDrawingMode) {
            var objectsToGroup = canvas.getObjects().filter(function(obj) {
                return obj.type !== 'group' && obj !== watermark;
            });

            if (objectsToGroup.length > 0) {
                lastGroup = currentGroup;
                currentGroup = new fabric.Group(objectsToGroup, { canvas: canvas });
                objectsToGroup.forEach(function(obj) {
                    canvas.remove(obj);
                });
                canvas.add(currentGroup);
            }
        }
    });

    // Draw a line between the last group and a newly selected group
    canvas.on('selection:created', function(e) {
        if (!isDrawingMode && lastGroup && e.target && e.target.type === 'group' && e.target !== lastGroup) {
            var line = createLine(lastGroup, e.target);
            lastGroup.line = line;
            e.target.line = line;

            // Attach event listeners to update line position
            lastGroup.on('moving', function() {
                updateLine(line);
            });
            e.target.on('moving', function() {
                updateLine(line);
            });
        }
    });
});
