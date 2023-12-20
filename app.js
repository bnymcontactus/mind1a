
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isGroupingMode = false;
    var selectedGroups = [];

    // Toggle between drawing mode and grouping mode
    document.getElementById('toggleButton').addEventListener('click', function() {
        isGroupingMode = !isGroupingMode;
        canvas.isDrawingMode = !isGroupingMode;
    });

    // Group selected objects or connect groups with a line
    canvas.on('selection:created', function(e) {
        if (isGroupingMode) {
            // Create a group from selected objects
            var group = new fabric.Group(e.selected, { canvas: canvas });
            canvas.add(group);
            canvas.discardActiveObject();  // Clear selection
        }
    });

    // Handle selection of groups for connecting them
    canvas.on('mouse:up', function(e) {
        if (isGroupingMode && e.target && e.target.type === 'group') {
            selectedGroups.push(e.target);

            // When two groups are selected, draw a line between them
            if (selectedGroups.length === 2) {
                var fromGroup = selectedGroups[0];
                var toGroup = selectedGroups[1];
                var line = new fabric.Line(
                    [fromGroup.left, fromGroup.top, toGroup.left, toGroup.top], 
                    { stroke: 'black', selectable: false }
                );
                canvas.add(line);
                selectedGroups = [];  // Reset for next selection
            }
        }
    });

    // Start with drawing mode enabled
    canvas.isDrawingMode = true;
});