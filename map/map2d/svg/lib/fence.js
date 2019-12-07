
/**
 * Created by zwt on 2017/6/24 0024.
 */

var FenceTool = window.LibName || {}, FenceTool = function () {
    var d,
        a = {},
        b = !1;
    return initialize = function initialize(a) {
        d = a;
    }, deleteFence = function deleteFence(delData) {
        a[delData.id].fenceDrawing.entireSet.remove();
        delete a[delData.id];
        checkAndSetValidFence();
    }, test = function test(b, c) {
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
    }, attachTooltipEvent = function attachTooltipEvent(b,type) {
        var fence = a[b];
        var fenceDrawing = a[b].fenceDrawing.entireSet;
        var markerTip = null;
        //围栏：hover时显示，维度：实时提示时，总是显示，否则hover显示
        // if(key=='fence'){
            fenceDrawing.hover(function (event) {
                var left = event.offsetX + 10;
                var top = event.offsetY + 2;

                markerTip = document.createElement('div');
                markerTip.innerHTML = createFenceInfoTable(fence, top, left,type);

                document.body.appendChild(markerTip);
                // $('#allHandle')[0].appendChild(markerTip);
            }, function (event) {
                if (markerTip&&!fenceDrawing.isHover) {
                    document.body.removeChild(markerTip);
                    // $('#allHandle')[0].removeChild(markerTip);
                }
            });



    }, createFenceInfoTable = function createFenceInfoTable(a, top, left,key) {
        var innerTagNum = Object.getOwnPropertyNames(a.innerTags).length - 1;
        innerTagNum=innerTagNum>0?innerTagNum:0;
        var tagCatCname='';
        var catName = {0:lang['total3'],'':lang['total3']};
        if(ME.vm.tagCat&&ME.vm.tagCat.data){
            ME.vm.tagCat.data.forEach((value) => {
                catName[value.id] = value.cname;
            })
            tagCatCname = a.tagCat.split(',').map((value) => {
                return catName[value];
            }).join(',');
        }
        var c = '<div class="qtip-default" style="position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:100;padding:10px;">';
        c += "<span style='float: left;' ><table class='infowindowTable'>";
        if(key=='fence'){
            c += "<tr><td>"+lang['fenceId']+"</td><td>" + a.id + "</td></tr>", c += "<tr><td>"+lang['fenceName']+"</td><td>" + a.cname + "</td></tr>", c += "<tr><td>"+lang['fenceType']+"</td><td>" + a.ftype + "</td></tr>",
                c += "<tr><td>"+lang['warningCondition']+"</td><td>" + (a.trif == 'i' ? lang['triggeringIn'] : a.trif == 'o' ? lang['triggeringOut'] : (a.trif == 'in' ? '内部触发' : lang['triggeringInOut'])) + "</td></tr>";

                // c += "<tr><td>内部标签：</td><td>";

        }else if(key=='dimension'){
            c += "<tr><td>"+lang['dimensionId']+"</td><td>" + a.id + "</td></tr>", c += "<tr><td>"+lang['dimensionName']+"</td><td>" + a.cname + "</td></tr>", c += "<tr><td>"+lang['fenceDimensionType']+"</td><td>" + a.dim + "</td></tr>", c += "<tr><td>"+lang['inTag']+"</td><td>";
        }
        // c += "共" + innerTagNum + "个<br/>";
        c += "</td></tr>";
        // if (innerTagNum > 0) {
        //     c += "<tr><td>标签列表：</td><td>";
        //     for (var t in a.innerTags) {
        //         var tag = a.innerTags[t];
        //         c += (tag.alias ? tag.alias : tag.code) + '<br/>';
        //     }
        //     c += "</td></tr>";
        // }
        if(tagCatCname){
            c += '<tr><td>'+lang['tagCat']+'</td><td>' + tagCatCname + '</td></tr>';
        }
        c += "</table></span>", c += "</div>";
        return c;
    },

        hideFences = function hideFences(b) {
        for (var c in a) {
            (b.force || a[c].buildingID == b.building && a[c].plan == b.plan) && void 0 !== a[c].fenceDrawing && hideFence(c, b);
        }
    }, hideFence = function hideFence(b, c) {
        (c.force || a[b].buildingID == c.building && a[b].plan == c.plan) && a[b].fenceDrawing.entireSet.hide();
    },
        showFence = function showFence(b, c,key) {
        var fence = a[b];
        if (!c.force && a[b].mapId != c.mapId) {
            return;
        }
        if (!fence.fenceDrawing) {
            // a[b].color=a[b].color?a[b].color:'#87CEEB';
            a[b].color=a[b].color?a[b].color:ME.vm[key].color;
            a[b].opacity=a[b].opacity?a[b].opacity:ME.vm[key].opacity;
            a[b].fenceDrawing = d.Fence(a[b].polygonPoints, a[b].color, a[b].opacity);
            attachTooltipEvent(b,key);
        } else {
            fence.fenceDrawing.entireSet.show(), markersToFront();
        }
        fence.isShow?fence.fenceDrawing.entireSet.show():fence.fenceDrawing.entireSet.hide();
    }, markersToFront = function markersToFront() {
        for (var b in a) {
            a[b].entireSet.toFront();
        }
    },
        showFences = function showFences(b, fences,key) {
        fences.forEach(function (data) {
            a[data.id] = data;
        });
        for (var c in a) {
            (b.force || a[c].mapId == b.mapId) && showFence(c, b,key);
        }
    }, updateFence = function updateFence(b) {
        void 0 !== b.type && (a[b.id].name = b.name), void 0 !== b.name && (a[b.id].type = b.type), a[b.id].fenceDrawing.set("color", createColorByType(a[b.id].type)), a[b.id].fenceDrawing.set("opacity", createOpacityByType(a[b.id].type)), checkAndSetValidFence();
    },
        setFences = function setFences(c, e, f, g) {
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
    }, getFences = function getFences(b) {
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
    }, markFenceSaved = function markFenceSaved(data,type) {
        //fence、dimension
        var f = data.id;
        for (var i in a) {
            if (a[i].savedInDb) {
                continue;
            }

            a[i].savedInDb = !0, a[f] = data, a[f].id = f, a[f].savedInDb = !0, a[f].nvert = a[i].nvert;

            if(type=='fence'){
                var fenceType = ME.vm.getFenceTypeByid(data.ftypeId);
            }
            var color=fenceType&&fenceType.color?fenceType.color:ME.vm[type].color;
            var opacity=fenceType&&fenceType.opacity?fenceType.opacity:ME.vm[type].opacity;
            a[f].fenceDrawing = d.Fence(a[i].points, color, opacity);
            attachTooltipEvent(f,type);

            for (var l = 0; l < a[i].vertices.length; l++) {
                a[i].vertices[l].entireSet.remove();
            }delete a[i];
            break;
        }
    }, markFenceUpdate = function markFenceUpdate(data,key) {
        if(key!='fence'){return}
        var f = data.id;
        var fence = a[f];
        if (!fence) return;

        a[f].ftype = data.ftype, a[f].cname = data.cname;

        var fenceType = ME.vm.getFenceTypeByid(data.ftypeId);
        if (fenceType) {
            fence.fenceDrawing.set('color', fenceType.color);
            fence.fenceDrawing.set('opacity', fenceType.opacity);
        }
    }, checkAndSetValidFence = function checkAndSetValidFence() {
        var e = !1;
        for (var f in a) {
            a[f].mapId == ME.vm.mapId && a[f].savedInDb && (e = !0);
        }b = e;
    },
        createNewFence = function createNewFence(b, c, d, e, f, g) {
        a[b] = {}, a[b].points = c, a[b].vertices = d, a[b].nvert = e, a[b].savedInDb = f, a[b].mapId = g;
    }, removeUnsavedFence = function removeUnsavedFence() {
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
    }, isValidfencePresent = function isValidfencePresent() {
        return b;
    }, {
        markFenceSaved: markFenceSaved,
        markFenceUpdate: markFenceUpdate,
        setFences: setFences,
        deleteFence: deleteFence,
        showFences: showFences,
        hideFences: hideFences,
        hideFence: hideFence,
        showFence: showFence,
        updateFence: updateFence,
        getFences: getFences,
        initialize: initialize,
        createNewFence: createNewFence,
        removeUnsavedFence: removeUnsavedFence,
        isValidfencePresent: isValidfencePresent
    };
}();