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

    const graph = d3.select("#heatmap")
    .attr('height',height)
    .attr('width',width)

    const xScale = d3.scaleBand().domain(data.map((d)=>d.year)).range([paddingMore,width-paddingLess])
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickValues(xScale.domain().filter((d)=>d%20===0))

    graph.append('g')
    .call(xAxis)
    .attr('transform',`translate(0,${height - paddingMore})`)
    .attr('id','x-axis')

    const yScale = d3.scaleBand().range([paddingLess,height-paddingMore]).domain([0,1,2,3,4,5,6,7,8,9,10,11])
    
    const yAxis = d3.axisLeft(yScale).tickValues(yScale.domain()).tickFormat( (month)=> {
        var date = new Date(0);
        date.setUTCMonth(month);
        var format = d3.timeFormat('%B');
        return format(date);
      })
        
    graph.append('g')
    .call(yAxis)
    .attr('transform',`translate(${paddingMore},0)`)
    .attr('id','y-axis')
   
    // colours

    const minTemp = d3.min(data,d=>(d.variance))
    const maxTemp = d3.max(data,d=>(d.variance))
  const diff=(maxTemp-minTemp)/11;
  
  const colorsArray = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026', '#000000'];
  
  const color = d3.scaleThreshold().domain(d3.range(minTemp,maxTemp,diff)).range(colorsArray)
  
  const tooltip = document.getElementById('tooltip')

      graph.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class","cell")
      .attr("data-year",d=>d.year)
      .attr("data-month",d=>d.month)
      .attr("data-temp",d=>d.variance)
      .attr("x",(d)=>xScale(d.year))
      .attr("y",(d)=>yScale(d.month))
      .attr("width", barWidth)
     .attr("height", barHeight)
     .style("fill", d => color(d.variance))
    .on('mouseover',(i,d)=>{
        tooltip.classList.add('show')
        tooltip.setAttribute('data-year',d.year)
        tooltip.style.left=(i.x+15+"px")
        tooltip.style.top=(i.y+15+"px")
        tooltip.innerHTML=(`${d.year} ${d.month}<br>${d.variance}`)
    })
    .on('mouseout',()=> {
        tooltip.classList.remove('show')
    })

    const legend = graph.append('g')
                    .attr('class','legend')
                    .attr('id','legend')
                    .attr('transform',`translate(${paddingMore},${height-paddingMore})`)

    const legendRect = legend.selectAll('rect').data(colorsArray)
    .enter()
    .append('rect')
    .attr('width',15)
    .attr('height',15)
    .attr('x',(d,i)=>i*20+20)
    .attr('y',25)
    .attr('fill',(d,i)=>colorsArray[i])

    legend.append('text').text('low to high')
    .attr('x',60)
    .attr('y',60)

}