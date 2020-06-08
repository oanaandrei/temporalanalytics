// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app')

.directive('dtmcGraph', function () {
    return {
	scope: {
	    dtmc: '=',
	    name: '@',
	},
	template: '',
	link: function (scope, element, attrs) {
	    var width = 240,
            height = 240,
            c = { x: width / 2, y: height / 2 },
            radius = width / 3,
            center = Math.min(width, height) / 2,
            radius = center * 0.8,
            cr = 10,
            fontSize = 10,
            arrowHeadSize = 8;
	    
	    var svg = d3.select(element[0]).append('svg').attr('width', width).attr('height', height + 30).attr('id', 'graph_' + scope.name);
	    
	    scope.$watch('dtmc', function (dtmc) {
		if (dtmc) render();
	    });
	    
	    function round(m) {
    		return m.map(function(r) {
        	    var row = r.map(function(v) { return (Number(v)).toFixed(2); });
	            var sum = d3.sum(row);
   	            return row.map(function(v) { return v/sum; }); 
		});
	    }  
	    
	    function render() {
		var dtmc = scope.dtmc;
		
		var nodes = getNodes(dtmc);
		
		drawDTMC(svg, nodes, dtmc, 0, scope.name);
	    }

	    
	    function drawDTMC(svg, nodes, dtmc, translateX, label) {
		var g = svg.append("g").attr("transform", "translate(" + translateX + ",0)");
		var edges = getEdges(dtmc);
		
		function dir(a, b) { // directional vector from b to a
		    var v = { x: a.x - b.x, y: a.y - b.y };
		    var l = Math.sqrt(v.x * v.x + v.y * v.y);
		    v.x /= l; v.y /= l;
		    return v;
		}
		
		function arc(edge) {
		    var a = nodes[edge.source];
		    var b = nodes[edge.target];
		    var c = { x: center, y: center };
		    var ad = dir(c, a),
		    bd = dir(c, b);
		    
		    var A = a === b ? 1 : (edge.source > edge.target ? 0.5 : 0.2),
		    B = 1 - A;
		    
		    var c1 = { x: c.x * A + a.x * B, y: c.y * A + a.y * B},
		    c2 = { x: c.x * A + b.x * B, y: c.y * A + b.y * B};
		    
		    if (a === b) {
			c1.x = a.x + ad.x * cr * 5 + -ad.y * cr * 2;
			c1.y = a.y + ad.y * cr * 5 +  ad.x * cr * 2;
			c2.x = a.x + ad.x * cr * 5 +  ad.y * cr * 2;
			c2.y = a.y + ad.y * cr * 5 -  ad.x * cr * 2;
		    }
		    
		    a = { x: a.x + ad.x * cr, y: a.y + ad.y * cr };
		    b = { x: b.x + bd.x * cr, y: b.y + bd.y * cr };
		    
		    var endDirection = dir(c, b);
		    
		    // cos(90) = 0
		    // sin(90) = 1
		    // x = x*cos - y*sin  // -y
		    // y = y*cos + x*sin  // x
		    var oosrt = 1 / Math.sqrt(2);
		    var leftAH = { x: b.x + oosrt * endDirection.x*arrowHeadSize - oosrt*endDirection.y*arrowHeadSize, y: b.y + oosrt*endDirection.x*arrowHeadSize + oosrt*endDirection.y*arrowHeadSize};
		    var rightAH = { x: b.x + oosrt * endDirection.x*arrowHeadSize + oosrt*endDirection.y*arrowHeadSize, y: b.y + oosrt*endDirection.y*arrowHeadSize - oosrt*endDirection.x*arrowHeadSize};
		    
		    return "M " + a.x + ", " + a.y + " " +
			"C " + c1.x + " " + c1.y + " " + c2.x + " " + c2.y + " " + b.x + " " + b.y + " " +
			"L " + leftAH.x + " " + leftAH.y + " " +
			"M " + b.x + " " + b.y + " " +
			"L " + rightAH.x + " " + rightAH.y + " ";
		}
		
		var arcs = g.selectAll("path").data(edges).enter().append("path")
		    .attr("d", arc)
		    .attr('fill', 'none')
		    .attr('stroke-width', function (d) { return d.thickness; })
		    .attr('stroke', '#000');
		
		var circles = g.selectAll("circle").data(nodes).enter().append("circle")
		    .attr('cx', function (d) { return d.x; })
		    .attr('cy', function (d) { return d.y; })
		    .attr('r', cr)
		    .attr('fill', '#fff')
		    .attr('stroke', '#000');
		
		var drag = d3.behavior.drag()
		    .on('dragstart', function(d) {
			console.log('start', d3.event);
		    })
		    .on('drag', function(d) {
			console.log('drag', d3.event);
			d.x += d3.event.dx;
			d.y += d3.event.dy;
		    })
		    .on('dragend', function(d) {
			console.log('start', d3.event);
		    });

		var labels = g.selectAll("text").data(nodes).enter().append("text")
		    .attr('x', function (d) { return d.x; })
		    .attr('y', function (d) { return d.y; })
		    .attr('text-anchor', 'middle')
		    .attr('dy', fontSize / 2 - 2)
		    .attr('fill', '#000')
		    .attr('stroke', 'none')
		    .attr('font-size', fontSize)
		    .text(function (d) { return d.label; });
		
		g.append('text')
		    .text(label)
		    .attr('y', height + 5)
		    .attr('x', height / 2)
		    .attr('text-anchor', 'middle')
		    .attr('fill', "#000")
		    .attr('stroke', 'none');
		
	
		circles.call(drag);
		labels.call(drag);
	    }
	    
	    function getNodes(dtmc) {
		var nodes = [];
		dtmc.forEach(function(d,i) {
		    nodes.push({
			i: i,
			x: center - radius*Math.cos(i*Math.PI*2/dtmc.length),
			y: center - radius*Math.sin(i*Math.PI*2/dtmc.length),
			label: '' + i,
		    });
		});
		return nodes;
	    }
	    
	    function getEdges(dtmc) {
		var edges = [];
		dtmc.forEach(function(row, i) {
		    row.forEach(function(t, j) {
			if (t>1e-4) {
			    edges.push({
				source: i,
				target: j,
				thickness: getThickness(t),
			    });
			}
		    });
		});
		return edges;
	    }
	    
	    function getThickness(t) {
		if (t>0.75) return 4;
		if (t<= 0.75 && t>0.25) return 2;
		if (t<=0.25 && t>0.09) return 0.5;
		if (t<=0.09 && t>0.001) return 0.1;
		//if (t<=0.01) return 0;
		return 0;
	    }	    

	          
	    // BEGIN NEW TEXT      
	    // Below are the functions that handle actual exporting:
	    // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
	    function getSVGString( svgNode ) {
		svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
		var cssStyleText = getCSSStyles( svgNode );
		appendCSS( cssStyleText, svgNode );
		
		var serializer = new XMLSerializer();
		var svgString = serializer.serializeToString(svgNode);
		svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
		svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix
		
		return svgString;
		
		function getCSSStyles( parentElement ) {
		    var selectorTextArr = [];
		    
		    // Add Parent element Id and Classes to the list
		    selectorTextArr.push( '#'+parentElement.id );
		    for (var c = 0; c < parentElement.classList.length; c++)
			if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
			    selectorTextArr.push( '.'+parentElement.classList[c] );
		    
		    // Add Children element Ids and Classes to the list
		    var nodes = parentElement.getElementsByTagName("*");
		    for (var i = 0; i < nodes.length; i++) {
			var id = nodes[i].id;
			if ( !contains('#'+id, selectorTextArr) )
			    selectorTextArr.push( '#'+id );
			
			var classes = nodes[i].classList;
			for (var c = 0; c < classes.length; c++)
			    if ( !contains('.'+classes[c], selectorTextArr) )
				selectorTextArr.push( '.'+classes[c] );
		    }
		    
		    // Extract CSS Rules
		    var extractedCSSText = "";
		    for (var i = 0; i < document.styleSheets.length; i++) {
			var s = document.styleSheets[i];
			
			try {
			    if(!s.cssRules) continue;
			} catch( e ) {
		    	    if(e.name !== 'SecurityError') throw e; // for Firefox
		    	    continue;
		    	}
			
			var cssRules = s.cssRules;
			for (var r = 0; r < cssRules.length; r++) {
			    if ( contains( cssRules[r].selectorText, selectorTextArr ) )
				extractedCSSText += cssRules[r].cssText;
			}
		    }
		    
		    
		    return extractedCSSText;
		    
		    function contains(str,arr) {
			return arr.indexOf( str ) === -1 ? false : true;
		    }
		    
		}
		
		function appendCSS( cssText, element ) {
		    var styleElement = document.createElement("style");
		    styleElement.setAttribute("type","text/css"); 
		    styleElement.innerHTML = cssText;
		    var refNode = element.hasChildNodes() ? element.children[0] : null;
		    element.insertBefore( styleElement, refNode );
		}
	    }
	    
	    
	    function svgString2Image( svgString, width, height, format, callback ) {
		var format = format ? format : 'png';
		
		var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL
		
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		
		canvas.width = width;
		canvas.height = height;
		
		var image = new Image();
		image.onload = function() {
		    context.clearRect ( 0, 0, width, height );
		    context.drawImage(image, 0, 0, width, height);
		    
		    canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
		    });
		    
		    
		};
		
		image.src = imgsrc;
	    }
	    // END NEW CODE      
	},
    };
});
