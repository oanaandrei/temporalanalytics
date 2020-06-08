// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app')

.directive('stackChart', function () {
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

        var testData = "[ 0.26, 0.02, 0.72 ], [ 0.686868686868687, 0.07070707070707072, 0.24242424242424243 ], [ 0.32, 0.34, 0.34 ], [ 0.54, 0.25, 0.21 ], [ 0.17, 0.45, 0.38 ], [ 0.22, 0.43, 0.35 ], [ 0.03, 0.26, 0.71 ], [ 0.37, 0.23, 0.4 ], [ 0.494949494949495, 0.05050505050505051, 0.4545454545454546 ], [ 0.5900000000000001, 0.30000000000000004, 0.11000000000000001 ], [ 0.51, 0.23, 0.26 ], [ 0.51, 0.35, 0.14 ], [ 0.22000000000000003, 0.6900000000000001, 0.09000000000000001 ], [ 0.38, 0.1, 0.52 ], [ 0.5544554455445545, 0.1485148514851485, 0.297029702970297 ], [ 0.34, 0.36, 0.3 ], [ 0.38, 0.28, 0.34 ], [ 0.87, 0.07, 0.06 ], [ 0.45, 0.48, 0.07 ], [ 0.4646464646464647, 0.10101010101010102, 0.43434343434343436 ]";
		var dummy = " (demo data)";
		var chartData = [], K = 0, png_file = "";

        if (!scope.data) {
            console.log("Using demo data: " + testData);
            chartData = JSON.parse("[" + testData + "]");  
	    K = chartData[0].length;
	    png_file = "theta-K" + K + "-chart.png";
		} else {
            chartData = scope.data.emmodel.theta;
	    	console.log("Using theta:" + chartData);
		    dummy = ""; 
            // Encode timecut and k in PNG file name
		    K = scope.data.emmodel.phi.length;
	    	var tc = scope.data.timecut.start + '-'
              + scope.data.timecut.end + '-'
              + scope.data.timecut.mindays;
            png_file = "theta-" + tc + '-K' + K + "-chart.png";
		}

		var traces = chartData.length;
		console.log("Found " + traces + " user traces");
		var colIndex = 0, ranking = -1;
		chartData.sort(function(a,b) {
        return ranking * (a[colIndex] - b[colIndex]);
	});

        var svg = element.children()[0];
        var width = element[0].offsetWidth;
        var height = 300;

        // chart view options
        var top = 50;
        var bottom = height - 30;
        var left = 100;
        var right = width - 100;// was 140
        var chartWidth = right - left;
        var chartHeight = bottom - top;

        var svg = d3.select(svg).attr('width', width).attr('height', height);
        svg.selectAll('*').remove();
	  

	console.log("SCHEME---------------------------");
	var scheme = [];
        for (var i = 0; i < K; i++) {
              scheme[i] = 'c' + i;
        }
        console.log(scheme);

	console.log("REMAPPED-------------------------");
        var remapped = scheme.map(function(dat,i){
            return chartData.map(function(d,j){
                return {x: j, y: d[i]};
            })
        });
        console.log(remapped);

        console.log("LAYOUT---------------------------");
        var stacked = d3.layout.stack()(remapped);
        console.log(stacked);

    	var xDomain = d3.scale.ordinal().rangeBands([0, chartWidth]);
	    var yDomain = d3.scale.linear().range([chartHeight, 0]);
        var color = d3.scale.ordinal().range(["green", "pink", "blue", "purple"]);

        xDomain.domain(stacked[0].map(function(d) { return d.x; }));
	    yDomain.domain([0, d3.max(stacked[stacked.length-1], function(d) { return d.y0 + d.y; })]);

        // show the domains of the scales              
        console.log("xDomain: " + xDomain.domain());
        console.log("yDomain: " + yDomain.domain());
        console.log("----------------------------------");

        // Add a group for each column.
        var valgroup = svg.selectAll("g.valgroup")
              .data(stacked)
              .enter().append("svg:g")
              .attr("class", "valgroup")
    	   // .style("stroke", function(d, i) { return d3.rgb(color(i)).darker(); })
	          .style("fill", function(d, i) { return color(i); });

        // Add a rect for each j
        var rect = valgroup.selectAll("rect")
		    .data(function(d){return d;})
		    .enter().append("svg:rect")
	    	.attr("x", function(d) { return xDomain(d.x) + left })
	   		.attr("y", function(d) { return bottom - yDomain(1 - d.y0) - yDomain(1 - d.y); }) 
	   		//.style("opacity", 0.5)
	   		.attr("height", function(d) { return yDomain(1 - d.y); })
	    	.attr("width", 0.9*xDomain.rangeBand());
      
		// x-axis tick values
		var nt = 10, tickValues = [];
        	for (var i = 0; i < nt; i++) {
	    		tickValues[i] = i*Math.ceil(traces/nt);
		}
		console.log('tickValues='+tickValues);
	
		// xaxis
        var xaxis = d3.svg.axis().scale(xDomain).orient('bottom').tickFormat(function(d) { return d + 1; });
        var xG = svg.append('g').attr('transform', 'translate('+ left +','+ bottom + ')');
        xG.call(xaxis.tickValues(tickValues));
        xG.selectAll('line, path').style('fill', 'none').style('stroke', '#000');

        // yaxis
        var yaxis = d3.svg.axis().scale(yDomain).orient('left');
        var yG = svg.append('g').attr('transform', 'translate(' + left + ',' + top + ')');
        var yTickValues = [0, 0.5, 1];
        yG.call(yaxis);//.tickValues(yTickValues));
        yG.selectAll('line, path').style('fill', 'none').style('stroke', '#000');

		// now add titles to the axes
        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (left/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Probability");

        svg.append("text")
            .attr("text-anchor", "middle")  
		    .attr("transform", "translate("+ (width-left+25) +"," + (height-11) + ")")
            .text("Traces");

        // title
        svg.append('text')
          .text("Probability distributions of each user trace over " + K + " activity patterns" + dummy)
          .attr('x', width/2)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .attr('stroke', '#444');

        // legend
        var legendWidth = 56; 
        var legendHeight = scheme.length * 16 + 15;
        var legendLeft = width - legendWidth - 32;
        var legendTop = top;
        
        var legendG = svg.append('g');
        legendG.append('rect')
          .attr('x', legendLeft)
          .attr('y', legendTop)
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .attr('fill', '#bbb')
          .attr('fill', 'none')
          .attr('stroke', '#e7e7e7');

        legendG.selectAll('text').data(scheme).enter().append('text')
          .text((d, i) => 'AP' + (i + 1))
          .attr('y', (d, i) => legendTop + 20 + i * 16)
          .attr('x', legendLeft + 23)
          .attr('stroke', '#000');

        legendG.selectAll('rect.icon').data(scheme).enter().append('rect')
          .attr('class', 'icon')
          .attr('x', (d, i) => legendLeft + 8)
          .attr('y', (d, i) => legendTop + 10 + i * 16)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', (d, i) => color(i));


		// Save PNG button
        d3.select('#saveStack').on('click', function(){
	 	   var svgString = getSVGString(svg.node());
	   	svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback
	   
	   function save( dataBlob, filesize ){
	       saveAs( dataBlob, png_file ); // FileSaver.js function
	   }
	 });
	
      }

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
    },
  };
});
