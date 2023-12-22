document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var newGroup = null;
    var line = null;

    // Create a watermark
    var watermark = new fabric.Text('3', {
        fontSize: 100,
        fill: 'grey',
        left: 50,
        top: 50,
        selectable: false,
        evented: false
    });
    canvas.add(watermark);
    canvas.sendToBack(watermark);

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
            }
        } else {
            newGroup = null;
            line = null;
        }
    });

    canvas.on('selection:created', function(e) {
        if (!isDrawingMode && newGroup && e.target && e.target.type === 'group' && e.target !== newGroup) {
            // Draw an anchored line between the new group and the selected group
            line = makeLine([newGroup.left, newGroup.top, e.target.left, e.target.top], newGroup, e.target);
            canvas.add(line);
        }
    });

    function makeLine(coords, startObj, endObj) {
        var newLine = new fabric.Line(coords, {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false
        });

        newLine.start = startObj;
        newLine.end = endObj;

        // Update line position when objects move
        startObj.on('moving', function() {
            updateLinePosition(newLine);
        });
        endObj.on('moving', function() {
            updateLinePosition(newLine);
        });

        return newLine;
    }

    function updateLinePosition(line) {
        line.set({ 'x1': line.start.left, 'y1': line.start.top, 'x2': line.end.left, 'y2': line.end.top });
        canvas.requestRenderAll();
    }

    canvas.isDrawingMode = true;
});
