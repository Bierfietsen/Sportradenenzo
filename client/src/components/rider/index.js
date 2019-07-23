import React, { Component } from 'react';
import axios from 'axios';
import Table from '../shared/table'

class Rider extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      posData: [],
      pointsData: [],
      coltype: [],
      tableName: '',
      riderName: ''
    });
  }


  componentDidMount() {
    axios.post('/api/getriderresults', { rider_participation_id: this.props.match.params.rider_participation_id, token: localStorage.getItem('authToken')})
      .then((res) => {
        if (res) {
          console.log("Data",res.data)
          document.title = res.data.riderName;
          this.setState({
            posData: res.data.posData,
            pointsData: res.data.pointsData,
            riderName: res.data.riderName,
          })
        }
      })
  }

  render() {
    return (
      <div className="overzichtContainer">
        <div>{this.state.riderName}</div>
        <div className='tableDiv'><Table data={this.state.posData} title={"Uitslagen"} /></div>
        <div className='tableDiv'><Table data={this.state.pointsData} title={"Punten"} /></div>
      </div>

    )
  }

}

export default Rider