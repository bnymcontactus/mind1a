document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c', { selection: true });
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    let isDrawingMode = true;
    let lastTap = 0;
    canvas.isDrawingMode = isDrawingMode;
    let selectedObjects = [];
    let arrow;

    function toggleDrawingMode() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;
    }

    function logDebugInfo(message) {
        var debugPanel = document.getElementById('debugPanel');
        debugPanel.innerHTML += `<p>${message}</p>`;
        debugPanel.scrollTop = debugPanel.scrollHeight;
    }

    canvas.on('touch:gesture', function(e) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        logDebugInfo(`Touch gesture detected. Interval: ${tapLength}ms`);
        if (tapLength < 500 && tapLength > 0) {
            toggleDrawingMode();
            e.e.preventDefault();
        }
        lastTap = currentTime;
    });

    var toggleButton = document.getElementById('toggleButton');
    toggleButton.onclick = toggleDrawingMode;

    function updateArrow(arrow) {
        if (!arrow) return;
        var points = [arrow.start.left, arrow.start.top, arrow.end.left, arrow.end.top];
        arrow.set({ x1: points[0], y1: points[1], x2: points[2], y2: points[3] });
        canvas.renderAll();
    }

    function createArrow(fromObj, toObj) {
        var points = [fromObj.left, fromObj.top, toObj.left, toObj.top];
        var newArrow = new fabric.Line(points, {
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            start: fromObj,
            end: toObj
        });

        canvas.add(newArrow);
        return newArrow;
    }

    canvas.on('selection:created', function(e) {
        if (!isDrawingMode) {
            selectedObjects.push(e.selected[0]);

            if (selectedObjects.length === 2) {
                arrow = createArrow(selectedObjects[0], selectedObjects[1]);
                selectedObjects.forEach(obj => obj.lines = (obj.lines || []).concat(arrow));
                selectedObjects = [];
            }
        }
    });

    canvas.on('object:moving', function(e) {
        var activeObject = e.target;
        if (activeObject.lines) {
            activeObject.lines.forEach(line => updateArrow(line));
        }
    });

    document.getElementById('saveButton').addEventListener('click', function() {
        var svg = canvas.toSVG();
        var blob = new Blob([svg], {type: 'image/svg+xml'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.download = 'mindmap.svg';
        link.href = url;
        link.click();
    });
});
