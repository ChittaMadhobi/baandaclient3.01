import React, { Component } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import '../dccs.css';
charts(fusioncharts);
const dataSource = {
  chart: {
    caption: 'Your Summary Work-DCCS Analytics',
    subcaption: 'Scale: 1 (low) to 10 (high)',
    theme: 'fusion',
    showlegend: '0',
    showdivlinevalues: '0',
    showlimits: '0',
    showvalues: '1',
    plotfillalpha: '40',
    plottooltext: 'Your <b>$label</b> skill is rated as <b>$value</b>'
  },
  categories: [
    {
      category: [
        {
          label: 'Communication'
        },
        {
          label: 'Punctuality'
        },
        {
          label: 'Problem Solving'
        },
        {
          label: 'Meeting Deadlines'
        },
        {
          label: 'Team Player'
        },
        {
          label: 'Domain Knowledge'
        }
      ]
    }
  ],
  dataset: [
    {
      seriesname: 'User Ratings',
      data: [
        {
          value: '6'
        },
        {
          value: '6'
        },
        {
          value: '8'
        },
        {
          value: '6'
        },
        {
          value: '4'
        },
        {
          value: '9'
        }
      ]
    }
  ]
};

class SummaryWorkDCCS extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="chart-sizeX">
              <ReactFusioncharts
                type="radar"
                width="100%"
                height="100%"
                dataFormat="JSON"
                dataSource={dataSource}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SummaryWorkDCCS;
