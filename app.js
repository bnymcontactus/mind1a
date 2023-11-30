document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c', { selection: true });
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    let isDrawingMode = true;
    let lastTap = 0;
    canvas.isDrawingMode = isDrawingMode;
    let selectedObjects = [];
    let arrow;

    function toggleDrawingMode() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;
    }

    // Handle double-tap for touch devices
    canvas.on('touch:gesture', function(e) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            toggleDrawingMode();
            e.e.preventDefault();
        }
        lastTap = currentTime;
    });

    // Add a button to manually toggle drawing mode
    var toggleButton = document.createElement('button');
    toggleButton.innerHTML = 'Toggle Mode';
    toggleButton.onclick = toggleDrawingMode;
    document.body.appendChild(toggleButton);

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
