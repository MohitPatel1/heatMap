const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const getData = async (url) => {
    const dataPromise = await fetch(url);
    const dataSet = await dataPromise.json();
    plottGraph(dataSet)
    
}

getData(url);

const plottGraph = (dataSet) => {
    const data = data.monthlyVariance
    const width = 1200
    const height = 700
    const padding = 40
    console.log((width - padding) / (data.length / 12))

    const barHeight = (height - padding) / 12;
    const barWidth = ((width - padding) / (data.length / 12))

    const graph = d3.select("#heatmap")
    .attr('height',height)
    .attr('width',width)

    const bar = graph.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width',barWidth)
    .attr('height',barHeight)
    .attr('class','cell')
    .attr('fill','green')
    // .attr('x',(d,i)=>)

}