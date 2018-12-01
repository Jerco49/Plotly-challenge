function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var metadata_url = `/metadata/${sample}`;
  d3.json(metadata_url).then(function(response) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var data_selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    data_selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    table_base = data_selector.append("table")
      .classed("data_table",true);
    table_base;

    table_build = d3.select(".data_table").append("tbody");
    table_build;

    Object.entries(response).forEach(([key, value]) => {
      // console.log(`Key: ${key} and Value ${value}`);
      d3.select("tbody")
        .append("tr")
        .html(function(d) {
          return `<td><strong>${key}</strong>: ${value}</td>`
        });

    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var samples_url = `/samples/${sample}`;
  d3.json(samples_url).then(function(response) {
    console.log(response);
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      }
    };
    var bubble_data = [trace1];
    var layout1 = {
      title: "Bacteria Bubble Chart",
      showlegend: false
    };
    Plotly.plot("bubble",bubble_data,layout1);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var trace2 = {
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      hovertext: response.otu_labels.slice(0,10),
      type: 'pie'
    }
    var pie_data = [trace2];
    var layout2 = {
      title: "Bacteria Pie Chart",
    };
    Plotly.plot("pie",pie_data,layout2);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
