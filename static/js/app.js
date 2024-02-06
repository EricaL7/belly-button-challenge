// Get the url endpoint
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let data = {}
// Fetch the JSON data and console log it
d3.json(samples).then(function(result) {
  data = result
    console.log(data);
    updateDropdown()
  });

// Create functions
function updateDropdown() {
  const dropdownMenu = d3.select("#selDataset");

  let names = data.names;

  // Clear existing options
  dropdownMenu.html("");

  // Iterate over names to create options
  names.forEach(id => {
    dropdownMenu.append("option").text(id).property("value", id);
  });

  // Automatically populate with the first ID
  optionChanged(names[0]);
  populateBarChart(names[0]);

}

// Call updateDropdown() initially 
updateDropdown();

function populateMetadata(selectedID) {
  // Add data to panel
  d3.json(samples).then((data) => {
    let metadata = data.metadata;
    let value = metadata.find(result => result.id == selectedID);

    // Check if a matching value is found
    if (value) {
      // Clear existing content in the panel
      d3.select("#sample-metadata").html("");

      // Log the individual key/value pairs as they are being appended to the metadata panel
      for (const [key, val] of Object.entries(value)) {
        console.log(key, val);
        d3.select("#sample-metadata").append("h5").text(`${key}: ${val}`);
      }
      console.log(selectedID);
    } else {
      // Handle the case where no matching ID is found
      console.log(`No data found for ID: ${selectedID}`);
    }
  });
}

function populateBarChart(id) {
  // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
  d3.json(samples).then((data) => {
    let selecteddata = data.samples;
    let value = selecteddata.find(results => results.id === id);
    let valuedata = value;
    let otuLabels = valuedata.otu_labels;
    let otuIDs = valuedata.otu_ids;
    let sampleValues = valuedata.sample_values;
    let yticks = otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let xticks = sampleValues.slice(0, 10).reverse();
    let labels = otuLabels.slice(0, 10).reverse();

    // Trace for the microbial Data
    let trace1 = {
      x: xticks,
      y: yticks,
      type: "bar",
      text: labels,
      orientation: "h"
    };

    let layout = {
      title: `Top 10 OTUs for Individual ${id}`,
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' }
    };

    // Use Plotly to create the bar chart
    Plotly.newPlot("bar", [trace1], layout);
  });

  console.log(id);
}

function populateBubbleChart(id) {
  // Create a bubble chart with a dropdown menu to display the OTUs found in that individual
   d3.json(samples).then((data) => {
    let selecteddata = data.samples;
    let value = selecteddata.find(results => results.id === id);
    let valuedata = value;
    let otuLabels = valuedata.otu_labels;
    let otuIDs = valuedata.otu_ids;
    let sampleValues = valuedata.sample_values;

    // Trace for the microbial Data
    let trace1 = {
      x: otuIDs,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: 'Viridis',
        opacity: 0.7
      },
      text: otuLabels
    };

    let layout = {
      title: `Bubble Chart for Individual ${id}`,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };

    // Use Plotly to create the bubble chart
    Plotly.newPlot("bubble", [trace1], layout);
  });

  console.log(id);
}

 function optionChanged(id) {
  populateMetadata(id)
  populateBarChart(id)
  populateBubbleChart(id)
  console.log(id);
 };

