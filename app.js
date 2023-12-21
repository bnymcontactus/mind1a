document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var watermarkText = "123"; // Replace with your desired watermark number

    canvas.isDrawingMode = isDrawingMode;

    // Create a static, non-interactive watermark
    var watermark = new fabric.Text(watermarkText, {
        fontSize: 100,
        fill: 'grey',
        left: 50,
        top: 50,
        selectable: false,
        evented: false
    });
    canvas.add(watermark);
    canvas.sendToBack(watermark); // Send watermark to back

    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (!isDrawingMode) {
            var objectsToGroup = canvas.getObjects().filter(function(obj) {
                return obj.type !== 'group' && obj !== watermark;
            });

            if (objectsToGroup.length > 0) {
                var newGroup = new fabric.Group(objectsToGroup, { canvas: canvas });
                objectsToGroup.forEach(function(obj) {
                    canvas.remove(obj);
                });
                canvas.add(newGroup);
            }
        }
    });
});
