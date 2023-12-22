
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c');
    var isDrawingMode = true;
    var selectedGroups = [];
    var watermark = new fabric.Text('Default', {
        fontSize: 100,
        fill: 'grey',
        left: 50,
        top: 50,
        selectable: false,
        evented: false
    });
    canvas.add(watermark);
    canvas.sendToBack(watermark);

    function updateWatermark(text) {
        watermark.set({ text: text });
        canvas.renderAll();
    }

    canvas.isDrawingMode = isDrawingMode;
    updateWatermark('Drawing Mode');

    document.getElementById('toggleButton').addEventListener('click', function() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;
        updateWatermark(isDrawingMode ? 'Drawing Mode' : 'Grouping Mode');
        selectedGroups = []; // Reset selected groups when toggling mode
    });

    document.getElementById('createLineButton').addEventListener('click', function() {
        updateWatermark('Drawing Lines Mode');
        canvas.off('selection:created');
        canvas.on('selection:created', function(e) {
            if (e.target.type === 'group') {
                selectedGroups.push(e.target);
                if (selectedGroups.length === 2) {
                    createLineBetweenGroups(selectedGroups[0], selectedGroups[1]);
                    selectedGroups = [];
                    updateWatermark('Grouping Mode');
                }
            }
        });
    });

    function createLineBetweenGroups(group1, group2) {
        var line = new fabric.Line([group1.left, group1.top, group2.left, group2.top], {
            fill: 'blue',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false,
            evented: false
        });

        function updateLine() {
            line.set({ x1: group1.left, y1: group1.top, x2: group2.left, y2: group2.top });
            canvas.renderAll();
        }

        group1.on('moving', updateLine);
        group2.on('moving', updateLine);

        canvas.add(line);
    }
});
