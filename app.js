document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var newGroup = null;
    var allGroups = [];

    // Initialize the canvas for drawing
    canvas.isDrawingMode = isDrawingMode;

    // Watermark
    var watermark = new fabric.Text('123', {
        fontSize: 100,
        fill: 'grey',
        left: 50,
        top: 50,
        selectable: false,
        evented: false
    });
    canvas.add(watermark);
    canvas.sendToBack(watermark);

    // Toggle button event listener
    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (!isDrawingMode) {
            var objectsToGroup = canvas.getObjects().filter(function(obj) {
                return obj.type !== 'group' && obj !== watermark;
            });

            if (objectsToGroup.length > 0) {
                newGroup = new fabric.Group(objectsToGroup, { canvas: canvas });
                objectsToGroup.forEach(function(obj) {
                    canvas.remove(obj);
                });
                canvas.add(newGroup);
                allGroups.push(newGroup);
            }
        }
    });

    // Selection event listener for drawing lines
    canvas.on('selection:created', function(e) {
        if (!isDrawingMode && newGroup && e.target && e.target.type === 'group' && e.target !== newGroup) {
            drawLineBetweenGroups(newGroup, e.target);
            newGroup = null; // Reset newGroup after drawing the line
        }
    });

    function drawLineBetweenGroups(group1, group2) {
        var line = makeLine([group1.left, group1.top, group2.left, group2.top], group1, group2);
        canvas.add(line);

        // Update line position when groups move
        group1.on('moving', function() {
            updateLinePosition(line, group1, group2);
        });
        group2.on('moving', function() {
            updateLinePosition(line, group1, group2);
        });
    }

    function makeLine(coords, startObj, endObj) {
        return new fabric.Line(coords, {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            start: startObj,
            end: endObj
        });
    }

    function updateLinePosition(line, startObj, endObj) {
        line.set({ 'x1': startObj.left, 'y1': startObj.top, 'x2': endObj.left, 'y2': endObj.top });
        canvas.requestRenderAll();
    }
});
