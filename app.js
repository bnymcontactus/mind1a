document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var newGroup = null;
    var lastGroup = null;

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

    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;
        newGroup = null; // Reset new group on toggling

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
                lastGroup = newGroup;
            }
        }
    });

    canvas.on('mouse:up', function(e) {
        if (!isDrawingMode && newGroup && e.target && e.target.type === 'group' && e.target !== newGroup) {
            // Draw a line between the new group and the selected group
            var line = new fabric.Line(
                [newGroup.left, newGroup.top, e.target.left, e.target.top], 
                { stroke: 'blue', selectable: false }
            );
            canvas.add(line);
            newGroup = null; // Reset new group after drawing the line
        }
    });

    canvas.isDrawingMode = true;
});
