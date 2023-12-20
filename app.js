
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isGroupingMode = false;
    var selectedGroup = null;

    document.getElementById('toggleButton').addEventListener('click', function() {
        isGroupingMode = !isGroupingMode;

        if (isGroupingMode) {
            canvas.isDrawingMode = false;
        } else {
            canvas.isDrawingMode = true;
            selectedGroup = null; // Reset selected group
        }
    });

    canvas.on('object:selected', function(e) {
        if (isGroupingMode) {
            if (!selectedGroup) {
                // First group selected
                selectedGroup = e.target;
            } else {
                // Second group selected, draw a line between them
                var points = [
                    selectedGroup.left, 
                    selectedGroup.top, 
                    e.target.left, 
                    e.target.top
                ];
                var line = new fabric.Line(points, { stroke: 'black' });
                canvas.add(line);
                selectedGroup = null; // Reset for next selection
            }
        }
    });

    // Function to group selected objects
    canvas.on('selection:created', function(e) {
        if (isGroupingMode) {
            var group = new fabric.Group(e.selected, { canvas: canvas });
            canvas.setActiveObject(group);
            canvas.requestRenderAll();
        }
    });

    // Enable drawing mode by default
    canvas.isDrawingMode = true;
});