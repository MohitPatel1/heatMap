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
    const width = 1300
    const height = 700
    const padding = 20
    const baseTemprature = dataSet.baseTemprature
    console.log(data)
    
    const barHeight = (height - padding) / 12;
    const barWidth = ((width - padding) / (data.length / 12))
    
    const minX = d3.min(data,d=>data.year)
    const maxX = d3.max(data,d=>data.year)
  
    const graph = d3.select("#heatmap")
    .attr('height',height)
    .attr('width',width)
    .attr('transform','translate(0,0)')

    const xScale = d3.scaleBand().domain(data.map((d)=>d.year)).range([0,width-4*padding])
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickValues(xScale.domain().filter((d)=>d%10===0))

    graph.append('g')
    .call(xAxis)
    .attr('transform',`translate(${5*padding},${height - padding})`)
    .attr('id','x-axis')

    const yScale = d3.scaleBand().range([0,height]).domain([0,1,2,3,4,5,6,7,8,9,10,11]).padding(0)
    const yAxis = d3.axisLeft(yScale).tickValues(yScale.domain()).tickFormat( (month)=> {
        var date = new Date(0);
        date.setUTCMonth(month);
        var format = d3.timeFormat('%B');
        return format(date);
      })
      .tickSize(10, 1);
        
    graph.append('g')
    .call(yAxis)
    .attr('transform',`translate(${5*padding},${-padding})`)
    .attr('id','y-axis')
   
    // colours

    const minTemp = d3.min(data,d=>(d.variance))
    const maxTemp = d3.max(data,d=>(d.variance))

    const colorsArray = ['#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026', '#000000'];

    const color = d3.scaleThreshold().domain(d3.range(minTemp,maxTemp)).range(colorsArray)

    const bar = graph.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width',barWidth)
    .attr('height',barHeight)
    .attr('class','cell')
    .attr('x',(d,i)=>(Math.floor(i/12))*barWidth)
    .attr('y',(d,i)=>(i%12)*barHeight)
    .attr('data-year',d=>d.year)
    .attr('data-month',d=>d.month-1)
    .attr('data-temp',d=>d.variance)
    .attr('transform',`translate(${5*padding},0)`)
    .attr('fill',d=>color(d.variance))




}