const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const getData = async (url) => {
    const dataPromise = await fetch(url);
    const dataSet = await dataPromise.json();
    plottGraph(dataSet)
    
}

getData(url);

const plottGraph = (dataSet) => {
    console.log(dataSet)
    const data = dataSet.monthlyVariance
    data.forEach(d=>d.month-=1); //new
    const width = 950
    const height = 500
    const paddingLess = 30
    const paddingMore = 100 //cool
    
    console.log(data)
    
    const barHeight = (height - paddingLess - paddingMore) / 12;
    const barWidth = ((width - paddingLess - paddingMore) / (data.length / 12)) // cool
    
    const minX = d3.min(data,d=>d.year)
    const maxX = d3.max(data,d=>d.year)

    const minY = 1;
  const maxY = 12;
  
    const graph = d3.select("#heatmap")
    .attr('height',height)
    .attr('width',width)

    // const xScale = d3.scaleBand().domain(data.map((d)=>d.year)).range([0,width-paddingMore])
    // const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickValues(xScale.domain().filter((d)=>d%10===0))
    const xScale=d3.scaleLinear().domain([minX-1,maxX+1]).range([paddingMore,width-paddingLess])
    const xAxis=d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSize(10,1);

    // graph.append('g')
    // .call(xAxis)
    // .attr('transform',`translate(${paddingMore},${height - paddingLess})`)
    // .attr('id','x-axis')

    // graph.append("g")
    // .attr("transform",`translate(0,${height-paddingMore})`)
    // .call(xAxis)
    // .attr("id","x-axis")
    // .append("text")
    // .text("Years")
    // .style("text-anchor","middle")
    // .attr("transform",`translate(${xScale(width/2)},30)`);

     graph.append("g")
      .attr("transform",`translate(0,${height-paddingMore})`)
      .call(xAxis)
      .attr("id","x-axis")
      .append("text")
      .text("Years")
      .style("text-anchor","middle")
      .attr("transform",`translate(${xScale(width/2)},30)`);

    // const yScale = d3.scaleBand().range([0,height]).domain([0,1,2,3,4,5,6,7,8,9,10,11]).padding(0)
    const yScale = d3.scaleBand().range([paddingLess,height-paddingMore]).domain([0,1,2,3,4,5,6,7,8,9,10,11]).padding(0)
    
    // const yAxis = d3.axisLeft(yScale).tickValues(yScale.domain()).tickFormat( (month)=> {
    //     var date = new Date(0);
    //     date.setUTCMonth(month);
    //     var format = d3.timeFormat('%B');
    //     return format(date);
    //   })
    //   .tickSize(10, 1);
    const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickValues(yScale.domain())
    .tickFormat(function (month) {
      var date = new Date(0);
      date.setUTCMonth(month);
      var format = d3.timeFormat('%B');
      return format(date);
    })
    .tickSize(10, 1);
        
    //graph.append('g')
    //.call(yAxis)
    //.attr('transform',`translate(${paddingMore},${-paddingLess})`)
    //.attr('id','y-axis')

      graph.append("g")
      .attr('transform',`translate(${paddingMore},0)`)
      .call(yAxis)
      .attr("id","y-axis")
      .append("text")
      .text("Months")
      .style("text-anchor", "middle");
   
    // colours

    // const minTemp = d3.min(data,d=>(d.variance))
    // const maxTemp = d3.max(data,d=>(d.variance))

     const minTemp=d3.min(data,d=>(d.variance+8.66));
  const maxTemp=d3.max(data,d=>(d.variance+8.66));
  console.log(minTemp,maxTemp)
  const diff=(maxTemp-minTemp)/11;

    // const colorsArray = ['#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026', '#000000'];

    // const color = d3.scaleThreshold().domain(d3.range(minTemp,maxTemp)).range(colorsArray)

    var colorBrewer = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026', '#000000'];
  var color=d3.scaleThreshold().domain(d3.range(minTemp,maxTemp,diff)).range(colorBrewer)

    // const bar = graph.selectAll('rect')
    // .data(data)
    // .enter()
    // .append('rect')
    // .attr('width',barWidth)
    // .attr('height',barHeight)
    // .attr('class','cell')
    // .attr("x",(d)=>xScale(d.year))
    // .attr("y",(d)=>yScale(d.month))
    // .attr('data-year',d=>d.year)
    // .attr('data-month',d=>d.month-1)
    // .attr('data-temp',d=>d.variance)
    // .attr('transform',`translate(${paddingMore},0)`)
    // .attr('fill',d=>color(d.variance))

      graph.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class","cell")
      .attr("data-year",d=>d.year)
      .attr("data-month",d=>d.month)
      .attr("data-temp",d=>d.variance+8.66)
      .attr("x",(d)=>xScale(d.year))
      .attr("y",(d)=>yScale(d.month))
      .attr("width", barWidth)
     .attr("height", barHeight)
     .style("fill", d => color(d.variance+8.66)
)




}