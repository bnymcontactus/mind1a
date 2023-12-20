document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c', { selection: true });
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    let isDrawingMode = true;
    canvas.isDrawingMode = isDrawingMode;
    let selectedObjects = [];
    let arrow;

    // Function to update arrow position
    function updateArrow(arrow) {
        if (!arrow) return;
        var points = [arrow.start.left, arrow.start.top, arrow.end.left, arrow.end.top];
        arrow.set({ x1: points[0], y1: points[1], x2: points[2], y2: points[3] });
        canvas.renderAll();
    }

    // Function to create an arrow
    function createArrow(fromObj, toObj) {
        var points = [fromObj.left, fromObj.top, toObj.left, toObj.top];
        var newArrow = new fabric.Line(points, {
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            start: fromObj,
            end: toObj
        });

        canvas.add(newArrow);
        return newArrow;
    }

    // Handle object selection for connecting them
    canvas.on('selection:created', function(e) {
        if (!isDrawingMode) {
            selectedObjects.push(e.selected[0]);

            // Connect two selected objects with an arrow
            if (selectedObjects.length === 2) {
                arrow = createArrow(selectedObjects[0], selectedObjects[1]);
                selectedObjects.forEach(obj => obj.lines = (obj.lines || []).concat(arrow));
                selectedObjects = []; // Reset the selection
            }
        }
    });

    // Update arrow when objects move
    canvas.on('object:moving', function(e) {
        var activeObject = e.target;
        if (activeObject.lines) {
            activeObject.lines.forEach(line => updateArrow(line));
        }
    });

    // Toggle drawing mode on double-click
    canvas.on('mouse:dblclick', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;
        if (!isDrawingMode) {
            // Remove the dot created by double-clicking
            canvas.remove(canvas.getActiveObject());
            canvas.discardActiveObject();
        }
    });

    // Save functionality
    document.getElementById('saveButton').addEventListener('click', function() {
        var svg = canvas.toSVG();
        var blob = new Blob([svg], {type: 'image/svg+xml'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.download = 'mindmap.svg';
        link.href = url;
        link.click();
    });
});

