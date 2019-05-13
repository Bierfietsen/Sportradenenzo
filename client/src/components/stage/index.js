import React, { Component } from 'react';
import axios from 'axios';
import './index.css';
import Table from '../table'

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

class Selectionbutton extends Component{
    selectRider=()=> {
        if(this.props.selected==='unselected'){
            this.props.selectRider(this.props.riderID);
        }
    }
    render(){
        return(
            <button className={this.props.selected} onClick={() => this.selectRider(this.props.riderID)}>{this.props.selected}</button>
        )
    }
}

class SelecTableRow extends Component{
    removeRider=()=> {
        this.props.removeRider(this.props.riderID);
    }
    setKopman=()=> {
        this.props.setKopman(this.props.riderID);
    }
    render(){
        let removeButton
        let setKopmanButton
        if(this.props.selected==='selected'){
            if(this.props.kopman===this.props.riderID){
                setKopmanButton = <button onClick={() => this.setKopman(this.props.riderID)}>IS DE KOPMAN</button>
                removeButton = <button onClick={() => this.removeRider(this.props.riderID)}>Remove rider</button>
            }else{
                setKopmanButton = <button onClick={() => this.setKopman(this.props.riderID)}>Maak kopman</button>
                removeButton = <button onClick={() => this.removeRider(this.props.riderID)}>Remove rider</button>
            }
        }else{
            removeButton = ''
            setKopmanButton = ''
        }
        return(
            <tr >
                <td>{setKopmanButton}</td>
                <td className={this.props.selected}>{this.props.name}</td>
                <td className={this.props.selected}>{this.props.team}</td>
                <td><Selectionbutton selected={this.props.selected} selectRider={this.props.selectRider} riderID={this.props.riderID}/></td>
                <td>{removeButton}</td>
            </tr>
        )
    }
}

class SelecTable extends Component {
    render() {
        const rows = [];
        const selectionIDs = this.props.selectionIDs;
        const selectionLength = selectionIDs.length;
        this.props.userTeam.map(({lastname,team,rider_participation_id})=>{
            var selected = 'unselected';
            if(selectionIDs.includes(rider_participation_id)){
                selected = 'selected'
            }
            if( selectionLength>=9 && selected!=='selected'){
                rows.push(<SelecTableRow name={lastname} team={team} selected='unselectable' key={rider_participation_id} riderID={rider_participation_id} kopman={this.props.kopman} selectRider={this.props.selectRider}/>)
            }else{
                if(selected === 'selected'){
                    rows.push(<SelecTableRow name={lastname} team={team} selected={selected} key={rider_participation_id} riderID={rider_participation_id} kopman={this.props.kopman} selectRider={this.props.selectRider} removeRider={this.props.removeRider} setKopman={this.props.setKopman}/>)
                }else{
                    rows.push(<SelecTableRow name={lastname} team={team} selected={selected} key={rider_participation_id} riderID={rider_participation_id} kopman={this.props.kopman} selectRider={this.props.selectRider}/>)
                }
            }
        })
        return(
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Team</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
}

class Stage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            mode: 'loading',
            race: 'giro',
            year: '2019',
            budget: false,
            stage: parseInt(this.props.match.params.stagenumber), //Haal het nummer uit de link
            stageSelectionGewoon: [],
            stageSelectionBudget: [],
            userTeamGewoon: [],
            userTeamBudget: [],
            kopmanGewoon: '',
            kopmanBudget: '',
            userTeamResult: [],
            userScoresGewoon: [],
            userScoresBudget: [],
            stageresults: [],
            lastStage: false,
            raceStarted: false,
            starttime: '',
        }
        this.selectRider = this.selectRider.bind(this)
        this.removeRider = this.removeRider.bind(this)
        this.setKopman = this.setKopman.bind(this)
        this.budgetSwitch = this.budgetSwitch.bind(this)
        this.previousStage = this.previousStage.bind(this);
        this.nextStage = this.nextStage.bind(this);
    }
    updateData(stage) {
        const race = this.state.race
        const year = this.state.year
        var start = new Date();
        axios.post('/api/getstage', { race, year, stage, token: localStorage.getItem('authToken') }) //to: stageresults.js
            .then((res) => {
                if (res.data.mode === '404') {
                    this.setState({
                        mode: '404'
                    })
                } else if (res.data.mode === 'selection') {
                    console.log("time to get selection",new Date()-start)

                    this.setState({
                        mode: 'selection',
                        userTeamGewoon: res.data.userTeamGewoon,
                        userTeamBudget: res.data.userTeamBudget,
                        stageSelectionGewoon: res.data.stageSelectionGewoon,
                        stageSelectionBudget: res.data.stageSelectionBudget,
                        kopmanGewoon: res.data.kopmanGewoon.kopman_id,
                        kopmanBudget: res.data.kopmanBudget.kopman_id,
                        currText: "Stage " + this.state.stage,
                        starttime: res.data.starttime
                    })
                } else if (res.data.mode === 'results') {
                    console.log("time to get results",new Date()-start)
                    this.setState({
                        mode: 'results',
                        userTeamResultGewoon: res.data.teamresultGewoon,
                        userTeamResultBudget: res.data.teamresultBudget,
                        userScoresGewoon: res.data.userscoresGewoon,
                        userScoresBudget: res.data.userscoresBudget,
                        userScoresColtype: res.userScoresColtype,
                        stageresultsGewoon: res.data.stageresultsGewoon,
                        stageresultsBudget: res.data.stageresultsBudget,
                        prevText: res.data.prevText,
                        currText: "Stage " + this.state.stage,
                        nextText: res.data.nextText,
                        lastStage: res.data.lastStage,
                        raceStarted: res.data.raceStarted
                    })
                }
            })
    }
    previousStage() {
        const currentstage = parseInt(this.state.stage)
        if(currentstage>1){
            this.props.history.push('/stage/' + (currentstage - 1).toString())
            this.setState({
                stage: (currentstage - 1).toString()
            })
            this.updateData((currentstage - 1).toString())
        }else{
            this.props.history.push('/teamselection')
        }
    }
    nextStage() {
        if(!this.state.lastStage){
            const currentstage = parseInt(this.state.stage)
            this.props.history.push('/stage/' + (currentstage + 1).toString())
            this.setState({
                stage: (currentstage + 1).toString()
            })
            this.updateData((currentstage + 1).toString())
        }else{
            this.props.history.push('/finalstandings')
        }
    }

    budgetSwitch() {
        if(this.state.budget){
            this.setState({budget: false})
        }else{
            this.setState({budget: true})
        }
    }

    setKopman(rider_participation_id) {
        const stage = this.state.stage
        const race = this.state.race
        const year = this.state.year
        const budget = this.state.budget
        axios.post('/api/setkopman', { race, year, stage, rider_participation_id, budgetParticipation: budget, token: localStorage.getItem('authToken') })
            .then((res) => {
                if(budget){
                    this.setState({kopmanBudget:res.data.kopman})
                }else{
                    this.setState({kopmanGewoon:res.data.kopman})
                }
            })
    }

    removeRider(rider_participation_id) {
        const stage = this.state.stage
        const race = this.state.race
        const year = this.state.year
        const budget = this.state.budget
        axios.post('/api/removeriderfromstage', { race, year, stage, rider_participation_id, budgetParticipation: budget, token: localStorage.getItem('authToken') })
            .then((res) => {
                if(budget){
                    this.setState({stageSelectionBudget:res.data})
                }else{
                    this.setState({stageSelectionGewoon:res.data})
                }
            })
    }

    selectRider(rider_participation_id) {
        const stage = this.state.stage
        const race = this.state.race
        const year = this.state.year
        const budget = this.state.budget
        axios.post('/api/addridertostage', { race, year, stage, rider_participation_id, budgetParticipation: budget, token: localStorage.getItem('authToken') })
            .then((res) => {
                if(budget){
                    this.setState({stageSelectionBudget:res.data})
                }else{
                    this.setState({stageSelectionGewoon:res.data})
                }
            })
    }

    componentDidMount() {
        this.updateData(parseInt(this.state.stage));
    }

    render() {
        const mode = this.state.mode
        let loadingGif
        let message
        let resTable
        let pTable
        let stResTable
        let selecTable
        let selectionTable
        let stageSelection
        let userTeam
        let kopman
        let starttimeString
        let userTeamResult
        let userScores
        let stageresults

        //selection
        if (this.state.budget){
            stageSelection = this.state.stageSelectionBudget
            userTeam = this.state.userTeamBudget
            kopman = this.state.kopmanBudget

        }else{
            stageSelection = this.state.stageSelectionGewoon
            userTeam = this.state.userTeamGewoon
            kopman = this.state.kopmanGewoon
        }
        //results
        if (this.state.budget){
            console.log("bg",this.state.userscoresBudget)
            userTeamResult = this.state.userTeamResultBudget
            userScores = this.state.userScoresBudget
            stageresults = this.state.stageresultsBudget
        }else{
            console.log("gw",this.state.userscoresBudget)
            userTeamResult = this.state.userTeamResultGewoon
            userScores = this.state.userScoresGewoon
            stageresults = this.state.stageresultsGewoon
        }
        console.log("us",userScores)
        if (mode === 'loading'){
            loadingGif = <img className="loadingGif" src="/images/bicycleWheel.gif" alt="bicycleWheel.gif"></img>
            message = <h3>Fetching data..</h3>
        }else if (mode === '404') {
            message = <h3>404: Data not found</h3>
            resTable = ''
            pTable = ''
            stResTable = ''
        } else if (mode === 'selection') {
            var starttime = new Date(this.state.starttime);
            console.log("st",starttime);
            console.log(typeof starttime)
            starttimeString = " Starttijd: " + starttime.getHours() + ":" + starttime.getMinutes();
            selecTable = <SelecTable userTeam={userTeam} selectionIDs={stageSelection.map(rider=> rider.rider_participation_id)} kopman={kopman} selectRider={this.selectRider} removeRider={this.removeRider} setKopman={this.setKopman}/>
            //selectionTable = <TeamTable stageTeam={stageSelection}/>
        } else if (mode === 'results') {

            resTable = <Table data={userTeamResult} title={"Selectie"} />
            pTable = <PouleTable userScores={userScores}/>
            stResTable = <Table data={stageresults} title={"Uitslag"} />
        }
        return (
            <div className="stageContainer">
                <div id="titlebuttons">
                <div id="prevStageButton">
                        <button onClick={this.previousStage}>To previous stage </button>
                </div> 
                <div id='title'>{this.state.currText}{this.state.budget ? ' Budget' : ' Gewoon'}{starttimeString}</div>
                <div id="nextStageButton">
                    <button onClick={this.nextStage}>To next stage </button>
                </div>
            </div>
            <button onClick={this.budgetSwitch}>Switch mode normaal/budget</button>
            {selectionTable}
            {selecTable}
            {loadingGif}
            {message}
            <div className="res">{resTable}</div>
            <div className="poule">{pTable}</div>
            <div className="stage">{stResTable}</div>
            </div>
        )
    }
}

export default Stage