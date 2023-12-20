
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isGroupingMode = false;

    document.getElementById('toggleButton').addEventListener('click', function() {
        isGroupingMode = !isGroupingMode;
        canvas.isDrawingMode = !isGroupingMode;
    });

    document.getElementById('groupButton').addEventListener('click', function() {
        if (canvas.getActiveObject() && canvas.getActiveObject().type === 'activeSelection' && isGroupingMode) {
            canvas.getActiveObject().toGroup();
            canvas.requestRenderAll();
        }
    });

    document.getElementById('ungroupButton').addEventListener('click', function() {
        if (canvas.getActiveObject() && canvas.getActiveObject().type === 'group' && isGroupingMode) {
            canvas.getActiveObject().toActiveSelection();
            canvas.requestRenderAll();
        }
    });

    canvas.isDrawingMode = true;
});
