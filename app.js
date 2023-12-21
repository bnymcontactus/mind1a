
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isGroupingMode = false;

    canvas.isDrawingMode = true;

    document.getElementById('toggleButton').addEventListener('click', function() {
        isGroupingMode = !isGroupingMode;
        canvas.isDrawingMode = !isGroupingMode;

        if (isGroupingMode && canvas.getActiveObject()) {
            var group = new fabric.Group(canvas.getActiveObject().getObjects(), { canvas: canvas });
            canvas.clear();
            canvas.add(group);
        }
    });
});
 