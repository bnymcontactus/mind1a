document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var selectedGroups = [];

    // Initialize watermark
    var watermark = new fabric.Text('3', {
        fontSize: 100,
        fill: 'grey',
        left: 50,
        top: 50,
        selectable: false,
        evented: false
    });
    canvas.add(watermark);
    canvas.sendToBack(watermark);

    // Enable drawing mode
    canvas.isDrawingMode = true;

    // Function to create an anchored line
    function createAnchoredLine(from, to) {
        var line = new fabric.Line([from.left, from.top, to.left, to.top], {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false
        });
        canvas.add(line);

        // Attach line to groups and update its position when they move
        line.start = from;
        line.end = to;
        function updateLine() {
            line.set({ x1: line.start.left, y1: line.start.top, x2: line.end.left, y2: line.end.top });
            canvas.requestRenderAll();
        }
        from.on('moving', updateLine);
        to.on('moving', updateLine);
    }

    // Button to listen for two group selections
    document.getElementById('createLineButton').addEventListener('click', function() {
        canvas.on('selection:created', function(e) {
            if (e.target.type === 'group') {
                selectedGroups.push(e.target);
                if (selectedGroups.length === 2) {
                    createAnchoredLine(selectedGroups[0], selectedGroups[1]);
                    selectedGroups = []; // Reset for next operation
                }
            }
        });
    });
});
