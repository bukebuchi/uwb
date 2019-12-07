/**
 * raphael.pan-zoom plugin 0.2.1
 * Copyright (c) 2012 @author Juan S. Escobar
 * https://github.com/escobar5
 *
 * licensed under the MIT license
 */

(function () {
    'use strict';
    /*jslint browser: true*/
    /*global Raphael*/

    function findPos(obj) {//文档偏移
        var posX = obj.offsetLeft, posY = obj.offsetTop, posArray;
        while (obj.offsetParent) {
            if (obj === document.getElementsByTagName('body')[0]) {
                break;
            } else {
                posX = posX + obj.offsetParent.offsetLeft;
                posY = posY + obj.offsetParent.offsetTop;
                obj = obj.offsetParent;
            }
        }
        posArray = [posX, posY];
        return posArray;
    }

    function getRelativePosition(e, obj) {
        var x, y, pos;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        if(e.touches && e.touches[0]){
            if(e.touches.length==1){
                var touch = e.touches[0];
                x = touch.pageX;
                y = touch.pageY;
            }else {
                var t1 = e.touches[0];
                var t2 = e.touches[1];
                x = (t1.pageX + t2.pageX) /2;
                y = (t1.pageY + t2.pageY) /2;
            }
        }

        pos = findPos(obj);
        x -= pos[0];
        y -= pos[1];

        return { x: x, y: y };
    }

    var panZoomFunctions = {
        enable: function () {
            this.enabled = true;
        },

        disable: function () {
            this.enabled = false;
        },

        zoomIn: function (steps) {
            this.applyZoom(steps);
        },

        zoomOut: function (steps) {
            this.applyZoom(steps > 0 ? steps * -1 : steps);
        },

        pan: function (deltaX, deltaY) {
            this.applyPan(deltaX * -1, deltaY * -1);
        },

        isDragging: function () {
            return this.dragTime > this.dragThreshold;
        },

        getCurrentPosition: function () {
            return this.currPos;
        },

        getCurrentZoom: function () {
            return this.currZoom;
        },

            draggingByPoint:function(point){
                return this.draggingByPoint2(point);
            }

    },

        PanZoom = function (el, options) {
            var paper = el,
                container = paper.canvas.parentNode,
                me = this,
                settings = {},
                initialPos = { x: 0, y: 0 },
                deltaX = 0,
                deltaY = 0,
                touchStartX = 0,
                touchEndX = 0,
                mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

            this.enabled = false;
            this.dragThreshold = 5;
            this.dragTime = 0;

            options = options || {};

            settings.maxZoom = options.maxZoom || 9;
            settings.minZoom = options.minZoom || 1;
            settings.zoomStep = options.zoomStep || 0.1;
            settings.initialZoom = options.initialZoom || 0;
            settings.initialPosition = options.initialPosition || { x: 0, y: 0 };
            settings.repaintHook = options.repaintHook || function(){};

            this.currZoom = settings.initialZoom;
            this.currPos = settings.initialPosition;

            function repaint() {
                me.currPos.x = me.currPos.x + deltaX;
                me.currPos.y = me.currPos.y + deltaY;
                var currAbsolteZoom =(1 - (me.currZoom * settings.zoomStep)),
                    newWidth = paper.width * currAbsolteZoom,
                    newHeight = paper.height * currAbsolteZoom;
               
                paper.setViewBox(me.currPos.x, me.currPos.y, newWidth, newHeight);

                settings.repaintHook.call(this,currAbsolteZoom);
            }

            //todo support input a center pointer
            function dragging(e) {
                if (!me.enabled) {
                    return false;
                }
                var evt = window.event || e,
                    newWidth = paper.width * (1 - (me.currZoom * settings.zoomStep)),
                    newHeight = paper.height * (1 - (me.currZoom * settings.zoomStep)),
                    newPoint = getRelativePosition(evt, container);


                deltaX = (newWidth * (newPoint.x - initialPos.x) / paper.width) * -1;
                deltaY = (newHeight * (newPoint.y - initialPos.y) / paper.height) * -1;
                initialPos = newPoint;

                repaint();
                me.dragTime += 1;
                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
                return false;
            }

            function draggingByPoint2(newPoint) {
                if (!me.enabled) {
                    return false;
                }

                me.currPos.x = 0;
                me.currPos.y = 0;
                me.currZoom = 0;

                //
                deltaX = ( newPoint.x - document.documentElement.clientWidth/2) ;
                deltaY = ( newPoint.y - document.documentElement.clientHeight/2);//

                // deltaX = ( newPoint.x - paper.width/2) ;
                // deltaY = ( newPoint.y - paper.height/4);//

                repaint();

                me.dragTime += 1;
                return false;
            }
            this.draggingByPoint2 = draggingByPoint2;



            function applyZoom(val, centerPoint) {
                if (!me.enabled) {
                    return false;
                }
                me.currZoom += val;
                if (me.currZoom > settings.maxZoom) {
                    me.currZoom = settings.maxZoom;
                } else {
                    centerPoint = centerPoint || { x: paper.width / 2, y: paper.height / 2 };
                    deltaX = ((paper.width * settings.zoomStep) * (centerPoint.x / paper.width)) * val;
                    deltaY = (paper.height * settings.zoomStep) * (centerPoint.y / paper.height) * val;

                    repaint();
                }
                // if (me.currZoom < settings.minZoom) {
                //     me.currZoom = settings.minZoom;
                // } else if (me.currZoom > settings.maxZoom) {
                //     me.currZoom = settings.maxZoom;
                // } else {
                //     centerPoint = centerPoint || { x: paper.width / 2, y: paper.height / 2 };

                //     deltaX = ((paper.width * settings.zoomStep) * (centerPoint.x / paper.width)) * val;
                //     deltaY = (paper.height * settings.zoomStep) * (centerPoint.y / paper.height) * val;

                //     repaint();
                // }
            }

            this.applyZoom = applyZoom;

            function handleScroll(e) {
                if (!me.enabled) {
                    return false;
                }
                var evt = window.event || e;
                var delta = evt.detail || evt.wheelDelta * -1;
                if(!delta && delta!=0){
                    delta = 0.1;
                    if(e.touches){
                        if(e.touches.length>1){
                            var t1 = e.touches[0];
                            var t2 = e.touches[1];
                            touchEndX = Math.abs(t1.pageX - t2.pageX);
                            delta = (touchEndX>touchStartX?0.1:-0.1) ;
                        }
                    }
                }else {
                    if (delta > 0) {
                        delta = -1;
                    } else if (delta < 0) {
                        delta = 1;
                    }
                }

                var zoomCenter = getRelativePosition(evt, container);

                applyZoom(delta, zoomCenter);
                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
                return false;
            }

            repaint();

            container.addEventListener("touchstart", function(e){
                var evt = window.event || e;
                if (!me.enabled || !e.touches) {
                    return false;
                }

                //判断有几个touch
                if(e.touches.length==1 ){
                    //drag

                    me.dragTime = 0;
                    initialPos = getRelativePosition(evt, container);
                    container.className += " grabbing";
                    container.addEventListener("touchmove", dragging, false);
                    // container.touchmove = dragging;
                    // document.touchmove = function () { return false; };

                }else {
                    //zoom
                    var t1 = e.touches[0];
                    var t2 = e.touches[1];
                    touchStartX = Math.abs(t1.pageX - t2.pageX);
                    container.addEventListener("touchmove", handleScroll, false);
                }

                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
                return false;
            }, false);

            container.addEventListener("touchend", function(e){
                //Remove class framework independent
                document.removeEventListener("touchmove", dragging, false);
                document.removeEventListener("touchmove", handleScroll, false);
                document.addEventListener("touchmove", null, false);

                container.className = container.className.replace(/(?:^|\s)grabbing(?!\S)/g, '');
                container.removeEventListener("touchmove", dragging, false);
                container.removeEventListener("touchmove", handleScroll, false);
                container.addEventListener("touchmove", null, false);

            }, false);


            container.onmousedown = function (e) {
                var evt = window.event || e;
                if (!me.enabled) {
                    return false;
                }
                me.dragTime = 0;
                initialPos = getRelativePosition(evt, container);
                container.className += " grabbing";
                container.onmousemove = dragging;
                document.onmousemove = function () { return false; };
                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
                return false;
            };
            container.onmouseup = function (e) {
                //Remove class framework independent
                document.onmousemove = null;
                container.className = container.className.replace(/(?:^|\s)grabbing(?!\S)/g, '');
                container.onmousemove = null;
            };

            if (container.attachEvent) {//if IE (and Opera depending on user setting)
                container.attachEvent("on" + mousewheelevt, handleScroll);
            } else if (container.addEventListener) {//WC3 browsers
                container.addEventListener(mousewheelevt, handleScroll, false);
            }

            function applyPan(dX, dY) {
                deltaX = dX;
                deltaY = dY;
                repaint();
            }

            this.applyPan = applyPan;
        };

    PanZoom.prototype = panZoomFunctions;

    Raphael.fn.panzoom = {};

    Raphael.fn.panzoom = function (options) {
        var paper = this;
        return new PanZoom(paper, options);
    };

}());
