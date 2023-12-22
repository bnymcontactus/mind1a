
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var currentGroup = null;
    var previousGroup = null;
    var selectedGroups = [];

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

    // Button to create a line between selected groups
    document.getElementById('createLineButton').addEventListener('click', function() {
        canvas.on('selection:created', function(e) {
            if (e.target.type === 'group') {
                selectedGroups.push(e.target);
                if (selectedGroups.length === 2) {
                    // Create a line between the two selected groups
                    var line = createLine(selectedGroups[0], selectedGroups[1]);
                    selectedGroups[0].line = line;
                    selectedGroups[1].line = line;
                    selectedGroups = []; // Reset the array for next operation
                }
            }
        });
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

        // Attach the line to both groups and update its position when they move
        line.start = from;
        line.end = to;
        canvas.add(line);
        attachLineEvents(line, from, to);
        return line;
    }

    // Function to attach event listeners to the line
    function attachLineEvents(line, startObj, endObj) {
        function updateLine() {
            line.set({ x1: startObj.left, y1: startObj.top, x2: endObj.left, y2: endObj.top });
            canvas.renderAll();
        }
        startObj.on('moving', updateLine);
        endObj.on('moving', updateLine);
    }
});
