document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;

    canvas.isDrawingMode = isDrawingMode;

    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (!isDrawingMode) {
            var objectsToGroup = canvas.getObjects().filter(function(obj) {
                // Only group objects that are not part of a group
                return obj.type !== 'group';
            });

            if (objectsToGroup.length > 0) {
                var newGroup = new fabric.Group(objectsToGroup, { canvas: canvas });
                // Remove the individual objects and add the group instead
                objectsToGroup.forEach(function(obj) {
                    canvas.remove(obj);
                });
                canvas.add(newGroup);
            }
        }
    });
});
