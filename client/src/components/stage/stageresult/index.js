import React, { Component } from 'react';

class PouleTableRow extends Component {
    render() {
        return (
            <tr>
                <td className="pouleUser">
                    {this.props.username}
                    {/* <div className="selectionInfo"><Table data={this.props.riders} title={"renners #: "+ this.props.riderCount} /></div> */}
                </td>
                <td>{this.props.stagescore}</td>
                {/* <td>{this.props.gcscore}</td> */}
                {/* <td>{this.props.pointscore}</td> */}
                {/* <td>{this.props.komscore}</td> */}
                {/* <td>{this.props.youngscore}</td> */}
                <td>{this.props.totalscore}</td>
            </tr>
        )
    }
}

class PouleTable extends Component {
    render() {
        const rows = [];
        const userScores = this.props.userScores
        userScores.forEach(user => {
            var riders = []
            if (user.riderCount>0) riders = user.riders;
            rows.push(
                <PouleTableRow
                    username={user.username}
                    // riderCount={user.riderCount}
                    // riders={riders}
                    stagescore={user.stagescore}
                    // gcscore={user.gcscore}
                    // pointscore={user.pointscore}
                    // komscore={user.komscore}
                    // youngscore={user.youngscore}
                    totalscore={user.totalscore}
                />
            )
        });

        return (
            <table className="pouleTable">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Stage</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
}

export default PouleTable