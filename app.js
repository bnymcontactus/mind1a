
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;

    canvas.isDrawingMode = isDrawingMode;

    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (!isDrawingMode) {
            var objects = canvas.getObjects().filter(function(obj) {
                return obj.type !== 'group';
            });

            if (objects.length > 0) {
                var group = new fabric.Group(objects, { canvas: canvas });
                canvas.add(group);
            }
        }
    });
});
