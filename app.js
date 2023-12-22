document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var currentGroup = null;
    var previousGroup = null;

    // Enable free drawing by default
    canvas.isDrawingMode = isDrawingMode;

    // Create a watermark
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

    // Function to create a line
    function createLine(fromGroup, toGroup) {
        if (!fromGroup || !toGroup) return;
        var points = [fromGroup.left, fromGroup.top, toGroup.left, toGroup.top];
        var line = new fabric.Line(points, {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            start: fromGroup,
            end: toGroup
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

    // Toggle drawing mode
    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (!isDrawingMode) {
            var objectsToGroup = canvas.getObjects().filter(function(obj) {
                return obj.type !== 'group' && obj !== watermark;
            });

            if (objectsToGroup.length > 0) {
                previousGroup = currentGroup;
                currentGroup = new fabric.Group(objectsToGroup, { canvas: canvas });
                objectsToGroup.forEach(function(obj) {
                    canvas.remove(obj);
                });
                canvas.add(currentGroup);

                if (previousGroup) {
                    var line = createLine(previousGroup, currentGroup);
                    currentGroup.line = line;
                    previousGroup.line = line;

                    currentGroup.on('moving', function() {
                        updateLine(line);
                    });
                    previousGroup.on('moving', function() {
                        updateLine(line);
                    });
                }
            }
        }
    });
});
