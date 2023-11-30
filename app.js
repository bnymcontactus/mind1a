
document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c', { selection: true });
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    let isDrawingMode = true;
    canvas.isDrawingMode = isDrawingMode;
    let selectedObjects = [];
    let arrow;
    let group = null;

    function toggleDrawingMode() {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;
        group = null; // Reset group when toggling mode
    }

    var toggleButton = document.getElementById('toggleButton');
    toggleButton.onclick = toggleDrawingMode;

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

    function updateArrow(arrow) {
        if (!arrow) return;
        var points = [arrow.start.left, arrow.start.top, arrow.end.left, arrow.end.top];
        arrow.set({ x1: points[0], y1: points[1], x2: points[2], y2: points[3] });
        canvas.renderAll();
    }

    canvas.on('selection:created', function(e) {
        if (!isDrawingMode) {
            if (!group) {
                group = new fabric.Group(e.selected, { canvas: canvas });
            } else {
                group.addWithUpdate(e.selected[0]);
            }
            canvas.setActiveObject(group);
            canvas.requestRenderAll();
        } else {
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