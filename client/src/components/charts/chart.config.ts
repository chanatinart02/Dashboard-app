import { ApexOptions } from "apexcharts";

// mock data for Total Revenue
export const TotalRevenueSeries = [
  {
    name: "Last Month",
    data: [183, 124, 115, 85, 143, 143, 96],
  },
  {
    name: "Running Month",
    data: [95, 84, 72, 44, 108, 108, 47],
  },
];

// Configuration options for the chart
export const TotalRevenueOptions: ApexOptions = {
  chart: {
    type: "bar", // Set the chart type to a bar chart
    toolbar: {
      show: false, // Hide the toolbar
    },
  },
  colors: ["#475BE8", "#CFC8FF"], // Define the colors for the bars
  plotOptions: {
    bar: {
      borderRadius: 4, // Set the corner radius of the bars
      horizontal: false, // Set the bars to be vertical
      columnWidth: "55%", // Set the width of the bars
    },
  },
  dataLabels: {
    enabled: false, // Disable data labels (labels on the bars)
  },
  grid: {
    show: false, // Hide the grid lines
  },
  stroke: {
    colors: ["transparent"], // Set the stroke color of the bars
    width: 4, // Set the stroke width of the bars
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], // Define the categories on the x-axis
  },
  yaxis: {
    title: {
      text: "$ (thousands)", // Set the title of the y-axis
    },
  },
  fill: {
    opacity: 1, // Set the fill opacity of the bars
  },
  legend: {
    position: "top", // Set the position of the legend
    horizontalAlign: "right", // Set the horizontal alignment of the legend
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return `$ ${val} thousands`; // Customize the tooltip format
      },
    },
  },
};
