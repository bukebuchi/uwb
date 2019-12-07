
var CameraTool = window.LibName || {}, CameraTool = function () {
    var d,
        a = {},
        b = !1;
    var cameraConf={color:'greenblue',opacity:.5};
    return initialize = function initialize(a) {
        d = a;
    }, 
    deleteCamera = function deleteCamera(delData) {
        a[delData.id].cameraDrawing.entireSet.remove();
        delete a[delData.id];
        checkAndSetValidCamera();
    }, 
    test = function test(b, c) {
        var d,
            e,
            f = 0;
        var poly = {
            isIn: f,
            polygon: g
        };
        for (var g in a) {
            for (d = 0, e = a[g].nvert - 1; d < a[g].nvert; e = d++) {
                a[g].polygonPoints[d].y > c != a[g].polygonPoints[e].y > c && b < (a[g].polygonPoints[e].x - a[g].polygonPoints[d].x) * (c - a[g].polygonPoints[d].y) / (a[g].polygonPoints[e].y - a[g].polygonPoints[d].y) + a[g].polygonPoints[d].x && (f = !f);
            }if (f) return poly = {
                isIn: f,
                polygon: g
            }, poly;
        }
        return poly;
    }, 
    CameraAttachTooltipEvent = function CameraAttachTooltipEvent(b) {
        var camera = a[b];
        var cameraDrawing = a[b].FenceDrawing.entireSet;
        var markerTip = null;
        cameraDrawing.hover(function (event) {
            var left = event.offsetX + 10;
            var top = event.offsetY + 2;

            markerTip = document.createElement('div');
            markerTip.innerHTML = createCameraInfoTable(camera, top, left);

            document.body.appendChild(markerTip);
        }, function (event) {
            if (markerTip) document.body.removeChild(markerTip);
        });
    },
     createCameraInfoTable = function createCameraInfoTable(a, top, left) {
        var innerTagNum = Object.getOwnPropertyNames(a.innerTags).length - 1;

        var c = '<div class="qtip-default" style="position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:100;padding:10px;">';
        c += "<span style='float: left;' ><table class='infowindowTable'>", c += "<tr><td>"+lang['fenceId']+"</td><td>" + a.id + "</td></tr>", c += "<tr><td>"+lang['fenceName']+"</td><td>" + a.cname + "</td></tr>", c += "<tr><td>"+lang["fenceType"]+"</td><td>" + a.ftype + "</td></tr>", c += "<tr><td>"+lang['warningCondition']+"</td><td>" + (a.trif == 'i' ? lang['triggeringIn'] : a.trif == 'o' ? lang['triggeringOut'] : lang['triggeringInOut']) + "</td></tr>", c += "<tr><td>"+lang['inTag']+"</td><td>";
        c += "total" + innerTagNum +lang['one'] +"<br/>";
        c += "</td></tr>";

        if (innerTagNum > 0) {
            c += "<tr><td>"+lang['tagList']+"</td><td>";
            for (var t in a.innerTags) {
                var tag = a.innerTags[t];
                c += (tag.alias ? tag.alias : tag.code) + '<br/>';
            }
            c += "</td></tr>";
        }

        c += "</table></span>", c += "</div>";
        return c;
    },
     hideCameras = function hideCameras(b) {
        for (var c in a) {
            (b.force || a[c].buildingID == b.building && a[c].plan == b.plan) && void 0 !== a[c].cameraDrawing && hideCamera(c, b);
        }
    }, hideCamera = function hideCamera(b, c) {
        (c.force || a[b].buildingID == c.building && a[b].plan == c.plan) && a[b].cameraDrawing.entireSet.hide();
    },
        showCamera = function showCamera(b, c) {
        var camera = a[b];
            if (!c.force && a[b].mapId != c.mapId) {
            return;
        }
        if (!camera.cameraDrawing) {
            a[b].cameraDrawing = d.Fence(a[b].polygonPoints, '#ccc', .3);
            // CameraAttachTooltipEvent(b);
        } else {
            camera.cameraDrawing.entireSet.show(), markersToFront();
        }
    }, markersToFront = function markersToFront() {
        for (var b in a) {
            a[b].cameraDrawing.entireSet.toFront();
        }
    },
    showCameras = function showCameras(b, cameras) {
        cameras.forEach(function (data) {
            a[data.id] = data;
        });
        for (var c in a) {
            (b.force || a[c].mapId == b.mapId) && showCamera(c, b);
        }
    }, updateCamera = function updateCamera(b) {
        void 0 !== b.type && (a[b.id].name = b.name), void 0 !== b.name && (a[b.id].type = b.type), a[b.id].cameraDrawing.set("color", createColorByType(a[b.id].type)), a[b.id].cameraDrawing.set("opacity", createOpacityByType(a[b.id].type)), checkAndSetValidCamera();
    }, setCameras = function setCameras(c, e, f, g) {
        g && (b = !0);
        for (var h = 0; h < f.length; h++) {
            if (void 0 === a[f[h].id]) {
                a[f[h].id] = {};
                for (var i = [], j = 0; j < f[h].polygonPoints.length; j++) {
                    i[j] = {
                        x: f[h].polygonPoints[j].x * d.scale + d.originX,
                        y: f[h].polygonPoints[j].y * d.scale + d.originY
                    };
                }a[f[h].id].id = f[h].id, a[f[h].id].polygonPoints = i, a[f[h].id].savedInDb = !0, a[f[h].id].buildingID = c, a[f[h].id].plan = e, a[f[h].id].type = f[h].type, a[f[h].id].name = f[h].name;
            }
        }
    }, getCameras = function getCameras(b) {
        if (b) {
            var c = {};
            for (var e in a) {
                var f = [];
                c[e] = {
                    mapId: a[e].mapId,
                    nvert: a[e].nvert,
                    savedInDb: a[e].savedInDb,
                    points: f,
                    vertices: a[e].vertices
                };
                for (var g in a[e].points) {
                    f.push({
                        x: a[e].points[g].x,
                        y: a[e].points[g].y,
                        relX: a[e].points[g].relX,
                        relY: a[e].points[g].relY
                        // x: (a[e].points[g].x - d.originX) / d.scale,
                        // y: (a[e].points[g].y - d.originY) / d.scale
                    });
                }c[e].points = f;
            }
            return c;
        }
        return a;
    }, markCameraSaved = function markCameraSaved(data) {
        var f = data.id;
        for (var i in a) {
            if (a[i].savedInDb) {
                continue;
            }

            a[i].savedInDb = !0, a[f] = data, a[f].id = f, a[f].savedInDb = !0, a[f].nvert = a[i].nvert;
            //var cameraType = ME.vm.getCameraTypeByid(data.ftypeId);
            a[f].cameraDrawing = d.Fence(a[i].points, cameraConf.color, cameraConf.opacity);
            // CameraAttachTooltipEvent(f);

            for (var l = 0; l < a[i].vertices.length; l++) {
                a[i].vertices[l].entireSet.remove();
            }delete a[i];
            break;
        }
    }, markCameraUpdate = function markCameraUpdate(data) {
        var f = data.id;
        var camera = a[f];
        if (!camera) return;

        a[f].ftype = data.ftype, a[f].cname = data.cname;

        // var cameraType = ME.vm.getCameraTypeByid(data.ftypeId);
        cameraType=true;
        if (cameraType) {
            camera.cameraDrawing.set('color', cameraConf.color);
            camera.cameraDrawing.set('opacity', cameraConf.opacity);
        }
    }, checkAndSetValidCamera = function checkAndSetValidCamera() {
        var e = !1;
        for (var f in a) {
            a[f].mapId == ME.vm.mapId && a[f].savedInDb && (e = !0);
        }b = e;
    },
        createNewCamera = function createNewCamera(b, c, d, e, f, g) {
        a[b] = {}, a[b].points = c, a[b].vertices = d, a[b].nvert = e, a[b].savedInDb = f, a[b].mapId = g;
    }, removeUnsavedCamera = function removeUnsavedCamera() {
        if (void 0 !== a.new && !a.new.savedInDb) {
            for (var b = 0; b < a.new.vertices.length; b++) {
                a.new.vertices[b].entireSet.remove();
            }delete a.new;
        }
    }, createOpacityByType = function createOpacityByType(a) {
        var b = "0.1";
        return "danger" == a && (b = "0.2"), "warning" == a && (b = "0.2"), "info" == a && (b = "0.2"), "valid" == a && (b = "0.0"), b;
    }, createColorByType = function createColorByType(a) {
        var b = "#4ba7c2";
        return "danger" == a && (b = "#75302d"), "warning" == a && (b = "#936524"), "info" == a && (b = "#2f5c69"), "valid" == a && (b = "#D3D3D3"), b;
    }, isValidcameraPresent = function isValidcameraPresent() {
        return b;
    }, {
        markCameraSaved: markCameraSaved,
        markCameraUpdate: markCameraUpdate,
        setCameras: setCameras,
        deleteCamera: deleteCamera,
        showCameras: showCameras,
        hideCameras: hideCameras,
        hideCamera: hideCamera,
        showCamera: showCamera,
        updateCamera: updateCamera,
        getCameras: getCameras,
        initialize: initialize,
        createNewCamera: createNewCamera,
        removeUnsavedCamera: removeUnsavedCamera,
        isValidcameraPresent: isValidcameraPresent
    };
}();




function openVidio (cameraId) {
    console.log(cameraId);
    window.open(UBIT.selfHost + '/super/camera/?cameraId=' + cameraId + '&type=1', cameraId + Date.now(),
        "height=600, width=800, top=60, left=300, center:true，toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
    );
}
