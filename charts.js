// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app')

.directive('barChart', function () {
  return {
    scope: {
      data: "=",
      options: "=",
    },
    template: "<svg></svg>",
    link: function (scope, element, attrs) {
      scope.$watch('data', watchData);
      scope.$watch('options', watchOther, true);

      function watchData(data, prevData) {
        createChart();
      }

      function watchOther() {
        console.log('other change');
        createChart();
      }

      function createChart() {
        if (!scope.data) return;
	  
	// NEW 
	// Set-up the export button
	d3.select('#saveButton').on('click', function(){
	    var svgString = getSVGString(svg.node());
	    svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback
	    
	    function save( dataBlob, filesize ){
		saveAs( dataBlob, 'chart.png' ); // FileSaver.js function
	    }
	});
	// END NEW 
	  
        var labelAccessor = getLabelAccessor();
        var groupAccessor = getGroupAccessor();

        var groups = d3.nest()
          .key(groupAccessor)
          .entries(scope.data)
          .sort(function (a, b) {
            return a.key < b.key ? -1 : 1;
          });

        var labels = d3.nest()
          .key(labelAccessor)
          .entries(scope.data)
          .map(d => d.key);

        var svg = element.children()[0];

        var width = element[0].offsetWidth;
        var height = 300;

        // chart view options
        var top = 50;
        var bottom = height - 30;
        var left = 100;
        var right = width - 140;
        var chartWidth = right - left;
        var chartHeight = bottom - top;

        // legend
        var legendWidth = 160; // initially was 120
        var legendHeight = groups.length * 16 + 15;
        var legendLeft = width - legendWidth - 20;
        var legendTop = 20;

        var svg = d3.select(svg).attr('width', width).attr('height', height);
        svg.selectAll('*').remove();

        var color = d3.scale.category10();
        var yscale = d3.scale.linear()
//        var yscale = d3.scale.log()
//          .domain(d3.extent(scope.data, d => d.result.value))
          .domain([0,Math.max(1, d3.max(scope.data, d => d.result.value))])
          .range([bottom, top]).nice();

        function orZero(f) {
          try {
            return f();
          } catch (e) {
            return 0;
          }
        }

        var barHeight = (d, i, j) =>
          orZero(
            () => chartHeight - (yscale(groups[j].values.find(v => labelAccessor(v) === d).result.value) - top)
          );
        var barCenter = labelIndex => left + (labelIndex + 0.5) * (chartWidth / labels.length);
        var barOffset = groupIndex => (groupIndex - groups.length / 2) *
          ((chartWidth / labels.length) * 0.8 / groups.length);
        var barWidth = ((chartWidth / labels.length) * 0.8 / groups.length);
        var barColor = (d, i, j) => color(j);

        // bars
        var gGroups = svg.selectAll('g').data(groups).enter().append('g');
        gGroups.selectAll('rect').data(function (d) { return labels; }).enter().append('rect')
          .attr('x', (d, i, j) => barCenter(i) + barOffset(j))
          .attr('y', (d, i, j) => bottom - barHeight(d, i, j))
          .attr('width', barWidth)
          .attr('height', (d, i, j) => barHeight(d, i, j))
          .attr('fill', barColor);

        // label ticks
        svg.selectAll('line.label-tick').data(labels).enter().append('line')
          .attr('class', 'label-tick')
          .attr('x1', (d, i) => barCenter(i))
          .attr('x2', (d, i) => barCenter(i))
          .attr('y1', bottom)
          .attr('y2', bottom + 8)
          .attr('stroke', '#000');

        // label labels
        svg.append('g').selectAll('text').data(labels).enter().append('text')
          .text(d => d)
          .attr('y', bottom)
          .attr('dy', 20)
          .attr('x', (d, i) => barCenter(i))
          .attr('text-anchor', 'middle')
          .attr('stroke', '#000');
          
          
        // xaxis bottom
        svg.append('line')
          .attr('x1', left).attr('x2', right)
          .attr('y1', bottom).attr('y2', bottom)
          .attr('stroke', '#000');
    
        var legendG = svg.append('g');
        legendG.append('rect')
          .attr('x', legendLeft)
          .attr('y', legendTop)
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          //.attr('fill', '#fff')
          .attr('fill', 'none')
          .attr('stroke', '#e7e7e7');

        legendG.selectAll('text').data(groups).enter().append('text')
          .text(d => d.key)
          .attr('y', (d, i) => legendTop + 20 + i * 16)
          .attr('x', legendLeft + 20)
          .attr('stroke', '#000');

        legendG.selectAll('rect.icon').data(groups).enter().append('rect')
          .attr('class', 'icon')
          .attr('x', (d, i) => legendLeft + 5)
          .attr('y', (d, i) => legendTop + 10 + i * 16)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', (d, i) => color(i));

        // yaxis
        var yaxis = d3.svg.axis().scale(yscale).orient('left');
        var yG = svg.append('g').attr('transform', 'translate(' + left + ',0)');
        yG.call(yaxis);
        yG.selectAll('line, path').style('fill', 'none').style('stroke', '#000');

        // title
        svg.append('text')
          .text(getTitle())
          .attr('x', width/2)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .attr('stroke', '#444');
      }

      function getTitle() {
        return scope.options.title || 'Reachability Probability';
      }

      function getLabelAccessor() {
        var accessor = d => d.pctl.name;
        accessor = (scope.options.labelAccessor && scope.options.labelAccessor.f) || accessor;

        return accessor;
      }

      function getGroupAccessor() {
        var accessor = d => `(${d.timecut.start}, ${d.timecut.end}](${d.timecut.mindays})`;
        accessor = (scope.options.groupAccessor && scope.options.groupAccessor.f) || accessor;
        
        return accessor;
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
     // END NEW TEXT      
 
    },
  };
});
