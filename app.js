
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var currentGroup = null;

    // Initialize watermark
    var watermark = new fabric.Text('Drawing Mode4', {
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
        watermark.setText(isDrawingMode ? 'Drawing Mode' : 'Grouping Mode');
        canvas.renderAll();

        if (!isDrawingMode) {
            var objectsToGroup = canvas.getObjects().filter(obj => obj !== watermark && obj !== currentGroup);
            if (objectsToGroup.length > 0) {
                currentGroup = new fabric.Group(objectsToGroup, { canvas: canvas });
                canvas.add(currentGroup);
                objectsToGroup.forEach(obj => {
                    if(obj !== watermark) canvas.remove(obj);
                });
            }
        }
    });

    // Button to create a line between selected groups
    document.getElementById('createLineButton').addEventListener('click', function() {
        var selectedGroups = [];
        canvas.on('selection:created', function(e) {
            if (e.target.type === 'group') {
                selectedGroups.push(e.target);
                if (selectedGroups.length === 2) {
                    createLine(selectedGroups[0], selectedGroups[1]);
                    selectedGroups = [];
                }
            }
        });
        watermark.setText('Drawing Lines Mode');
        canvas.renderAll();
    });

    // Function to create a line
    function createLine(fromGroup, toGroup) {
        var line = new fabric.Line([fromGroup.left, fromGroup.top, toGroup.left, toGroup.top], {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false
        });

        function updateLine() {
            line.set({ x1: fromGroup.left, y1: fromGroup.top, x2: toGroup.left, y2: toGroup.top });
            canvas.renderAll();
        }

        fromGroup.on('moving', updateLine);
        toGroup.on('moving', updateLine);

        canvas.add(line);
    }
});