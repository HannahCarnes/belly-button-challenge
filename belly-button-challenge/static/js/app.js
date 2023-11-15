// d3 to read in data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
  
  let samples = data.samples;
  let metadata = data.metadata; 

  //dropdown
  let dropdown = d3.select("#selDataset");

  samples.forEach(sample => {
    dropdown.append("option").attr("value", sample.id).text(sample.id);
  });

  // updating based on selection
  function optionChanged(selectedSample) {
    let selectedData = samples.find(sample => sample.id == selectedSample);
    let selectedMetadata = metadata.find(item => item.id == selectedSample);

    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); 

    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });

    // plotting charts
    let barTrace = {
      x: selectedData.sample_values.slice(0, 10).reverse(),
      y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: selectedData.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let barLayout = {};

    let barData = [barTrace];

    Plotly.newPlot("bar", barData, barLayout);

    let bubbleTrace = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      text: selectedData.otu_labels,
      mode: 'markers',
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: 'Earth'
      }
    };

    let bubbleLayout = {
      xaxis: { title: 'OTU ID' },
    };

    let bubbleData = [bubbleTrace];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  }

  
  optionChanged(samples[0].id);
});