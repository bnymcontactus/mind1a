document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isGroupingMode = false;
    var previousGroup = null;

    document.getElementById('toggleButton').addEventListener('click', function() {
        isGroupingMode = !isGroupingMode;
        canvas.isDrawingMode = !isGroupingMode;
    });

    canvas.on('selection:created', function(e) {
        if (isGroupingMode) {
            var group = new fabric.Group(e.selected, { canvas: canvas });
            canvas.add(group);
            canvas.discardActiveObject();
            if (previousGroup) {
                var line = new fabric.Line(
                    [previousGroup.left, previousGroup.top, group.left, group.top], 
                    { stroke: 'black', selectable: false }
                );
                canvas.add(line);
            }
            previousGroup = group;
        }
    });

    canvas.isDrawingMode = true;
});