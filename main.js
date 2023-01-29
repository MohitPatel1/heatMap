const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const getData = async (url) => {
    const dataPromise = await fetch(url);
    const dataSet = await dataPromise.json();
    plottGraph(dataSet)
    
}

getData(url);

const plottGraph = (dataSet) => {
    const data = dataSet.monthlyVariance
    const width = 1200
    const height = 700
    const padding = 40
    // console.log((width - padding) / (data.length / 12))
    console.log(data)
    
    const barHeight = (height - padding) / 12;
    const barWidth = ((width - padding) / (data.length / 12))
    
    const minX = d3.min(data,d=>data.year)
    const maxX = d3.max(data,d=>data.year)
    // const minY = 0
    // const maxY = 11

    
    // const xScale = d3.scaleTime().range([padding,width-padding]).domain([minX-1,maxX+1])
    const xScale = d3.scaleBand().domain(data.map((d)=>d.year)).range([0,width-padding])


    // const yScale = d3.scaleLinear().range([padding,height]).domain([minY,maxY])
    // const yScale = d3.scaleLinear().range([padding,height]).domain([0,1,2,3,4,5,6,7,8,9,10,11])
    
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickValues(xScale.domain().filter((d)=>d%10===0))
    
    // const yAxis = d3.axisLeft(yScale)
    
    const graph = d3.select("#heatmap")
    .attr('height',height)
    .attr('width',width)
    .attr('transform','translate(50,0)')

    graph.append('g')
    .call(xAxis)
    .attr('transform',`translate(0,${height - padding})`)
    .attr('id','x-axis')
    
    // graph.append('g')
    // .call(yAxis)
    // .attr('transform',`translate(${padding},0)`)
    // .attr('id','y-axis')

    // graph.append("g")
    // .attr("transform",`translate(0,${height-padding})`)
    // .call(xAxis)
    // .attr("id","x-axis")
    // .append("text")
    // .text("Years")
    // .style("text-anchor","middle")
    // .attr("transform",`translate(${xScale(width/2)},30)`);

    


    const bar = graph.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width',barWidth)
    .attr('height',barHeight)
    .attr('class','cell')
    .attr('x',(d,i)=>(Math.floor(i/12))*barWidth)
    .attr('y',(d,i)=>(i%12)*barHeight)
    .attr('fill','green')
    .attr('data-year',d=>d.year)
    .attr('data-month',d=>d.month-1)
    .attr('data-temp',d=>d.variance)




}