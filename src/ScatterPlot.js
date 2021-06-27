import * as d3 from "d3";
import React from "react";
import d3Tip from "d3-tip";

export default class ScatterPlot extends React.Component {
    constructor(props) {
        super(props);   
        // Graph width and height - accounting for margins
        this.drawWidth = this.props.width - this.props.margin.left - this.props.margin.right;
        this.drawHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;
        this.axisLabels = {
            G: "Games Played",
            GS: "Games Started",
            MP: "Total Minutes Played",
            FG: "Total Field Goals Made",
            FGA: "Total Field Goals Attempted",
            FG_2PM: "Total 2 Point Field Goals Made",
            FG_2PA: "Total 2 Point Field Goals Attempted",
            FG_3PM: "Total 3 Point Field Goals Made",
            FG_3PA: "Total 3 Point Field Goals Attempted",
            FT: "Total Free Throws Made",
            FTA: "Total Free Throws Attempted",
            ORB: "Total Offensive Rebounds",
            DRB: "Total Defensive Rebounds",
            TRB: "Total Rebounds",
            AST: "Total Assists",
            STL: "Total Steals",
            BLK: "Total Blocks",
            TOV: "Total Turnovers",
            PF: "Total Personal Fouls",
            PTS: "Total Points Scored",
            PER: "Player Efficiency Rating (PER)",
            FT_RATE: "Free Throw Rate",
            PProd: "Points Produced",
            ORB_PCT: "Offensive Rebounds Percentage",
            DRB_PCT: "Defensive Rebounds Percentage",
            TRB_PCT: "Total Rebounds Percentage",
            AST_PCT: "Assist Percentage",
            STL_PCT: "Steal Percentage",
            BLK_PCT: "Block Percentage",
            TOV_PCT: "Turnover Percentage",
            USG_PCT: "Usage Percentage",
            OWS: "Offensive Win Share",
            DWS: "Defensive Win Share",
            WS: "Total Win Share",
            WS_40: "Win Share Per 40",
            OBPM: "Offensive Box Plus Minus",
            DBPM: "Defensive Box Plus Minus",
            BPM: "Total Box Plus Minus",
            HEIGHT: "Height (Inches)",
            WEIGHT: "Weight (Pounds)",
            PPG: "Points Per Game",
            APG: "Assists Per Game",
            RPG: "Rebounds Per Game",
            PCT_2P: "2 Point Percentage",
            PCT_3P: "3 Point Percentage",
            PCT_FG: "Field Goal Percentage",
            PCT_FT: "Free Throw Percentage",
            PCT_TS: "Total Shot Percentage",
            PCT_EFG: "Effective Field Goal Percentage",
            RATE_ATT_3P: "3 Point Attempt Rate"
        };
    }

    componentDidMount() {
        this.update();
    }
    // Whenever the component updates, select the <g> from the DOM, and use D3 to manipulte circles
    componentDidUpdate() {
        this.update();
    }
    updateScales() {
        // Calculate limits
        let xMin = d3.min(this.props.data, (d) => +d.x * .9);
        let xMax = d3.max(this.props.data, (d) => +d.x * 1.1);
        let yMin = d3.min(this.props.data, (d) => +d.y * .9);
        let yMax = d3.max(this.props.data, (d) => +d.y * 1.1);

        // Define scales
        this.xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, this.drawWidth])
        this.yScale = d3.scaleLinear().domain([yMax, yMin]).range([0, this.drawHeight])
    }
    updatePoints() {
        // Define hovers 
        // Add tip
        let tip = d3Tip().attr('class', 'd3-tip').html(function (d) {
            return d.label + " " + d.x + " " + d.xlabel + " " + d.y + " " + d.ylabel;
        });

        // Select all circles and bind data
        let circles = d3.select(this.chartArea).selectAll('circle').data(this.props.data);
        
        // Use the .enter() method to get your entering elements, and assign their positions
        circles.enter().append('circle')
            .merge(circles)
            .attr('r', (d) => this.props.radius)
            .attr('fill', (d) => this.props.color)
            .attr('label', (d) => d.label)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .style('fill-opacity', 0.3)
            .transition().duration(500)
            .attr('cx', (d) => this.xScale(d.x))
            .attr('cy', (d) => this.yScale(d.y))
            .style('stroke', "black")
            .style('stroke-width', (d) => d.selected === true ? "3px" : "0px")


        // Use the .exit() and .remove() methods to remove elements that are no longer in the data
        circles.exit().remove();

        // Add hovers using the d3-tip library        
        d3.select(this.chartArea).call(tip);
    }
    updateAxes() {
        let xAxisFunction = d3.axisBottom()
            .tickFormat(d => d)
            .scale(this.xScale)
            .ticks(5, 's');

        let yAxisFunction = d3.axisLeft()
            .tickFormat(d => d)
            .scale(this.yScale)
            .ticks(5, 's');

        let xAxisPctFunction = d3.axisBottom()
            .tickFormat(d => d + "%")
            .scale(this.xScale)
            .ticks(5, 's');

        let yAxisPctFunction = d3.axisLeft()
            .tickFormat(d => d + "%")
            .scale(this.yScale)
            .ticks(5, 's');

        if(["ORB_PCT","DRB_PCT", "TRB_PCT","AST_PCT","STL_PCT","BLK_PCT","TOV_PCT","USG_PCT", "PCT_2P", "PCT_3P", "PCT_FG", "PCT_FT", "PCT_TS", "PCT_EFG", "RATE_ATT_3P"].includes(this.props.xTitle)) {
            d3.select(this.xAxis)
            .call(xAxisPctFunction);
        }
        else {
            d3.select(this.xAxis)
            .call(xAxisFunction);
        }
        

        if(["ORB_PCT","DRB_PCT", "TRB_PCT","AST_PCT","STL_PCT","BLK_PCT","TOV_PCT","USG_PCT", "PCT_2P", "PCT_3P", "PCT_FG", "PCT_FT", "PCT_TS", "PCT_EFG", "RATE_ATT_3P"].includes(this.props.yTitle)) {
            d3.select(this.yAxis)
            .call(yAxisPctFunction);
        }
        else {
            d3.select(this.yAxis)
            .call(yAxisFunction);
        }
    }
    update() {
        this.updateScales();
        this.updateAxes();
        this.updatePoints();
    }
    render() {
        return (
            <div className="chart-wrapper">
                <svg className="chart" width={this.props.width} height={this.props.height}>
                    <text transform={`translate(${this.props.margin.left},15)`}>{this.props.title}</text>
                    <g ref={(node) => { this.chartArea = node; }}
                        transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`} />

                    {/* Axes */}
                    <g ref={(node) => { this.xAxis = node; }}
                        transform={`translate(${this.props.margin.left}, ${this.props.height - this.props.margin.bottom})`}></g>
                    <g ref={(node) => { this.yAxis = node; }}
                        transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}></g>

                    {/* Axis labels */}
                    <text className="axis-label" transform={`translate(${(this.props.margin.left + this.drawWidth) / 2}, 
                        ${this.props.height - this.props.margin.bottom + 30})`}>{this.axisLabels[this.props.xTitle]}</text>

                    <text className="axis-label" transform={`translate(${this.props.margin.left - 30}, 
                        ${this.drawHeight / 2 + this.props.margin.top}) rotate(-90)`}>{this.axisLabels[this.props.yTitle]}</text>
                </svg>
            </div>

        )
    }
}

ScatterPlot.defaultProps = {
    data: [{ x: 10, y: 20 }, { x: 15, y: 35 }],
    width: 800,
    height: 800,
    radius: 5,
    color: "#0C2340",
    margin: {
        left: 50,
        right: 10,
        top: 20,
        bottom: 50
    },
    xTitle: "X Title",
    yTitle: "Y Title",
};
