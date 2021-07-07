import './App.css';
import Axios from 'axios';
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import ReactLoading from "react-loading";
import ScatterPlot from './ScatterPlot.js';
import Collapsible from 'react-collapsible';
var url ="http://ec2-52-26-194-76.us-west-2.compute.amazonaws.com:8080"
// var url ="https://cors-everywhere.herokuapp.com/http://ec2-52-26-194-76.us-west-2.compute.amazonaws.com:8080"
// var url = "http://localhost:3001"

function App() {
  
  const [prospectData, setProspectData] = useState([]);

  const allStar = "All.Star";
  const goodStarter = "Good.Starter";
  const sixthMan = "Starter.6th.Man";
  const rolePlayer = "Role.Player";
  const endBench = "End.Of.Bench";

  useEffect(() => {
    Axios.get(url+`/players`).then((response)=>{
      setProspectData(response.data)
    })
  }, []);

  var i;
  for (i = 0; i < prospectData.length; i++){
    prospectData[i].PPG = (prospectData[i].PTS/prospectData[i].G);
    prospectData[i].APG = (prospectData[i].AST/prospectData[i].G);
    prospectData[i].RPG = (prospectData[i].TRB/prospectData[i].G);
  }

  const PlayersPage = () => {
    const useSortableData = (items, config = null) => {
      const [sortConfig, setSortConfig] = useState(config);
    
      const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
          sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
          });
        }
        return sortableItems;
      }, [items, sortConfig]);
    
      const requestSort = (key) => {
        let direction = 'ascending';
        if (
          sortConfig &&
          sortConfig.key === key &&
          sortConfig.direction === 'ascending'
        ) {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
      };
    
      return { items: sortedItems, requestSort, sortConfig };
    };
    
    const ProductTable = (props) => {
      const { items, requestSort, sortConfig } = useSortableData(props.products);
      const getClassNamesFor = (name) => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
      };
      return (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Image</th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('PPG')}
                  className={getClassNamesFor('PPG')}
                >
                  Points
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('RPG')}
                  className={getClassNamesFor('RPG')}
                >
                  Rebounds
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('APG')}
                  className={getClassNamesFor('APG')}
                >
                  Assists
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('All.Star')}
                  className={getClassNamesFor('All.Star')}
                >
                  All Star
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('Good.Starter')}
                  className={getClassNamesFor('Good.Starter')}
                >
                  Good Starter
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('Starter.6th.Man')}
                  className={getClassNamesFor('Starter.6th.Man')}
                >
                  Starter-6th Man
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('Role.Player')}
                  className={getClassNamesFor('Role.Player')}
                >
                  Role Player
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('End.Of.Bench')}
                  className={getClassNamesFor('End.Of.Bench')}
                >
                  End of Bench
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('BPM_Prediction')}
                  className={getClassNamesFor('BPM_Prediction')}
                >
                  Projected BPM
                </button>
              </th>
              <th>
                  Player Page Link
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((season, index) => (
              <tr key={[season.PLAYER, season.SEASON, season.TEAM].join()}>
                <td>{index+1}</td>
                <td><img src={`/player_img/${season.ID}.jpg`} alt={season.PLAYER}/></td>
                <td>{(season.PPG).toFixed(1)}</td>
                <td>{(season.RPG).toFixed(1)}</td>
                <td>{(season.APG).toFixed(1)}</td>
                <td>{(season[allStar]*100).toFixed(0)}%</td>
                <td>{(season[goodStarter]*100).toFixed(0)}%</td>
                <td>{(season[sixthMan]*100).toFixed(0)}%</td>
                <td>{(season[rolePlayer]*100).toFixed(0)}%</td>
                <td>{(season[endBench]*100).toFixed(0)}%</td>
                <td>{(season.BPM_Prediction).toFixed(2)}</td>
                <td><Link to={`/player/${season.ID}/overview`}>{season.PLAYER}'s Page</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    return (
      <div className="App">
        <h1>2021 NBA Draft Top Prospects</h1>
        <ProductTable
          products={prospectData}
        />
      </div>
    );
  };

  const ScatterPlotPage = () => {
    const [player2021Data, setPlayer2021Data] = useState([]);
    const [done, setDone] = useState(undefined);
    const [xVar, setXVar] = useState("");
    const [yVar, setYVar] = useState("");

    useEffect(() => {
      Axios.get(url+`/scatterplot`).then((response)=>{
      setPlayer2021Data(response.data)
      setDone(true)
      setXVar("PER");
      setYVar("PTS");
      })
    }, []);

    var i;
    for (i = 0; i < player2021Data.length; i++){
      player2021Data[i].PPG = (player2021Data[i].PTS/player2021Data[i].G);
      player2021Data[i].APG = (player2021Data[i].AST/player2021Data[i].G);
      player2021Data[i].RPG = (player2021Data[i].TRB/player2021Data[i].G);
      player2021Data[i].PCT_2P = (player2021Data[i].FG_2P_PCT*100).toFixed(1);
      player2021Data[i].PCT_3P = (player2021Data[i].FG_3P_PCT*100).toFixed(1);
      player2021Data[i].PCT_FG = (player2021Data[i].FG_PCT*100).toFixed(1);
      player2021Data[i].PCT_FT = (player2021Data[i].FT_PCT*100).toFixed(1);
      player2021Data[i].PCT_TS = (player2021Data[i].TS_PCT*100).toFixed(1);
      player2021Data[i].PCT_EFG = (player2021Data[i].E_FG_PCT*100).toFixed(1);
      player2021Data[i].RATE_ATT_3P= (player2021Data[i].ATT_RATE_3P*100).toFixed(1);
    }

    var state = {
      data: player2021Data,
      xVar: xVar,
      yVar: yVar
    };
    
    let options = state.data.length === 0 ? [] : Object.keys(state.data[0]);
    options = options.filter((d) => d !== "ID" && d !== "PLAYER" && d !== "SCHOOL" && d !== "POS" && d !== "TEAM" && d !== "SEASON" && d !== "RK" && d !== "STAT_SUMMARY" && d !== "RSCI_TOP_100"
    && d !== "HIGH_SCHOOL" && d !== "HOMETOWN" && d !== "CLASS" && d !== "JERSEY" && d !== "TEAM_ID" && d !== "FG_2P_PCT" && d !== "FG_3P_PCT" && d !== "FT_PCT" && d !== "TS_PCT"
    && d !== "E_FG_PCT" && d !== "ATT_RATE_3P" && d !== "FG_PCT");

    let allData = state.data.map((d) => {
      return {
        x: d[state.xVar],
        y: d[state.yVar],
        xlabel: state.xVar,
        ylabel: state.yVar,
        label: d.PLAYER
      };
    });

    let axisLabels = {
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

    return (
      <>
        <h1>2021 NCAA Season Scatter Plot</h1>
        {!done ? (
          <ReactLoading
            type={"bars"}
            color={"#236192"}
            height={100}
            width={100}
          />
        ) : (
          <>
            <body>
              {/* X Variable Select Menu */}
              <div class="select">
                <label htmlFor="xVar">Select X-Axis:</label>
                <select id="xVar" value={state.xVar} className="custom-select" onChange={(d) => setXVar(d.target.value)}>
                  {options.map((d) => {
                    return <option key={d}>{d}</option>
                  })}
                </select>
              </div>

              {/* Y Variable Select Menu */}
              <div class="select">
                <label htmlFor="yVar">Select Y-Axis:</label>
                <select id="yVar" value={state.yVar} className="custom-select" onChange={(d) => setYVar(d.target.value)}>
                  {options.map((d) => {
                    return <option key={d}>{d}</option>
                  })}
                </select>
              </div>
              <ScatterPlot
                xTitle={state.xVar}
                yTitle={state.yVar}
                data={allData}
                />
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Class</th>
                    <th>College</th>
                    <th>Position</th>
                    <th>{axisLabels[state.xVar]}</th>
                    <th>{axisLabels[state.yVar]}</th>
                  </tr>
                </thead>
                <tbody>
                  {player2021Data.map((season) => (
                    <tr key={[season.PLAYER, season.SEASON, season.TEAM].join()}>
                      <td>{season.PLAYER}</td>
                      <td>{season.CLASS}</td>
                      <td>{season.TEAM}</td>
                      <td>{season.POS}</td>
                      <td>{(season[state.xVar])}</td>
                      <td>{(season[state.yVar])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </body>
          </>
        )}
      </>
    );
  };


  const PlayerPage = ({ match, location }) => {
    const { params: { playerID } } = match;
  
    const loc = location.pathname.split("/")[2];
    const[playerBio, setPlayerBio] = useState([]);
    const[done, setDone] = useState(undefined);

    useEffect(() => {
      Axios.get(url+`/player/${loc}`).then((response)=>{
      setPlayerBio(response.data)
      setDone(true)
      })
    }, []);

    const mystyle = {
      position: "scrolling",
      width: "120%"
    };

    return (
      <>
        {!done ? (
          <ReactLoading
            type={"bars"}
            color={"#236192"}
            height={100}
            width={100}
          />
        ) : (
          <>  
            <div class="row">
              <div class ="column1">
                <img src={`/player_img/${playerID}.jpg`} alt={playerBio[0].PLAYER}/> 
              </div>
              <div class ="column2">
                <h1>
                  <strong>{playerBio[0].PLAYER} </strong>
                </h1>
                <p>
                  {playerBio[0].CLASS} | {playerBio[0].TEAM} #{playerBio[0].JERSEY} | {playerBio[0].POS}
                </p>
              </div>
              <div class ="column3">
                <p>
                  <strong> HT/WT </strong>
                  {Math.trunc(playerBio[0].HEIGHT/12)}' {playerBio[0].HEIGHT%12}'', {playerBio[0].WEIGHT} lbs
                </p>
                <p>
                  <strong>HOMETOWN </strong>
                  {playerBio[0].HOMETOWN}
                </p>
                <p>
                  <strong>HIGH SCHOOL </strong>
                  {playerBio[0].HIGH_SCHOOL}
                </p>
                <p>
                  <strong>COLLEGE </strong>
                  {playerBio[0].TEAM}
                </p>
              </div>
            </div>
              
            <ul style ={mystyle}>
              <li><Link to={`/player/${playerBio[0].ID}/overview`}>Overview</Link></li>
              <li><Link to={`/player/${playerBio[0].ID}/stats`}>NCAA Stats</Link></li>
              <li><Link to={`/player/${playerBio[0].ID}/comparisons`}>Similar Players</Link></li>
            </ul>
          </>
        )}
      </>
    );
  };
  const OverviewPage = ({ match, location }) => {
    const { params: { playerID } } = match;

    const [predictionList, setPredictionList] = useState([]);
    const [done, setDone] = useState(undefined);

    useEffect(() => {
      Axios.get(url +`/predictions/${playerID}`).then((response)=>{
        setPredictionList(response.data[0])
        setDone(true)
      })
    }, []);

    return (
      <>
        {!done ? (
          <ReactLoading
            type={"bars"}
            color={"#236192"}
            height={100}
            width={100}
          />
        ) : (
          <>
            <body>
              <h2>Predictions</h2>
            </body>
            <div class="row">
              <div class ="col1">
                <h3>All Star Probability</h3>
                <p>{predictionList[allStar]*100}%</p>
              </div>
              <div class ="col2">
                <h3>Good Starter Probability</h3>
                <p>{predictionList[goodStarter]*100}%</p>
              </div>
              <div class ="col3">
                <h3>Starter/Sixth Man Probability</h3>
                <p>{predictionList[sixthMan]*100}%</p>
              </div>
              <div class ="col4">
                <h3>Role Player Probability</h3>
                <p>{(predictionList[rolePlayer]*100).toFixed(0)}%</p>
              </div>
              <div class ="col5">
                <h3>End of Bench Player Probability</h3>
                <p>{predictionList[endBench]*100}%</p>
              </div>
              <div class ="col6">
                <h3>Projected BPM</h3>
                <p>{(predictionList.BPM_Prediction).toFixed(2)}</p>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const StatsPage = ({ match, location }) => {
    const { params: { playerID } } = match;
    
    const [nbaStatList, setNbaStatList] = useState([]);

    useEffect(() => {
      Axios.get(url+`/NCAAstats/${playerID}`).then((response)=>{
        setNbaStatList(response.data)
      })
    }, []);

    for (i = 0; i < nbaStatList.length; i++){
      nbaStatList[i].PPG = (nbaStatList[i].PTS/nbaStatList[i].G);
      nbaStatList[i].APG = (nbaStatList[i].AST/nbaStatList[i].G);
      nbaStatList[i].RPG = (nbaStatList[i].TRB/nbaStatList[i].G);
      nbaStatList[i].SPG = (nbaStatList[i].STL/nbaStatList[i].G);
      nbaStatList[i].BPG = (nbaStatList[i].BLK/nbaStatList[i].G);
      nbaStatList[i].TPG = (nbaStatList[i].TOV/nbaStatList[i].G);
      nbaStatList[i].FPG = (nbaStatList[i].PF/nbaStatList[i].G);
      nbaStatList[i].ORG = (nbaStatList[i].ORB/nbaStatList[i].G);
      nbaStatList[i].DRG = (nbaStatList[i].DRB/nbaStatList[i].G);
      nbaStatList[i].MPG = (nbaStatList[i].MP/nbaStatList[i].G);
    }

    const useSortableData = (items, config = null) => {
      const [sortConfig, setSortConfig] = useState(config);
    
      const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
          sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
          });
        }
        return sortableItems;
      }, [items, sortConfig]);
    
      const requestSort = (key) => {
        let direction = 'ascending';
        if (
          sortConfig &&
          sortConfig.key === key &&
          sortConfig.direction === 'ascending'
        ) {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
      };
    
      return { items: sortedItems, requestSort, sortConfig };
    };
    
    const ProductTable = (props) => {
      const { items, requestSort, sortConfig } = useSortableData(props.products);
      const getClassNamesFor = (name) => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
      };
      return (
        <table>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('SEASON')}
                  className={getClassNamesFor('SEASON')}
                >
                  Season
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TEAM')}
                  className={getClassNamesFor('TEAM')}
                >
                  Team
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('G')}
                  className={getClassNamesFor('G')}
                >
                  GP
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('GS')}
                  className={getClassNamesFor('GS')}
                >
                  GS
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('MPG')}
                  className={getClassNamesFor('MPG')}
                >
                  MIN
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FG')}
                  className={getClassNamesFor('FG')}
                >
                  FG
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FG_PCT')}
                  className={getClassNamesFor('FG_PCT')}
                >
                  FG%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FG_3PM')}
                  className={getClassNamesFor('FG_3PM')}
                >
                  3PT
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FG_3P_PCT')}
                  className={getClassNamesFor('FG_3P_PCT')}
                >
                  3P%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FT')}
                  className={getClassNamesFor('FT')}
                >
                  FT
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FT_PCT')}
                  className={getClassNamesFor('FT_PCT')}
                >
                  FT%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('ORG')}
                  className={getClassNamesFor('ORG')}
                >
                  ORB
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('DRG')}
                  className={getClassNamesFor('DRG')}
                >
                  DRB
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('RPG')}
                  className={getClassNamesFor('RPG')}
                >
                  REB
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('APG')}
                  className={getClassNamesFor('APG')}
                >
                  AST
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('BPG')}
                  className={getClassNamesFor('BPG')}
                >
                  BLK
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('SPG')}
                  className={getClassNamesFor('SPG')}
                >
                  STL
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FPG')}
                  className={getClassNamesFor('FPG')}
                >
                  PF
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TPG')}
                  className={getClassNamesFor('TPG')}
                >
                  TOV
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('PPG')}
                  className={getClassNamesFor('PPG')}
                >
                  PTS
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((season, index) => (
              <tr key={[season.ID, season.SEASON, season.TEAM].join()}>
                <td>{season.SEASON}</td>
                <td>{season.TEAM}</td>
                <td>{season.G}</td>
                <td>{season.GS}</td>
                <td>{(season.MPG).toFixed(1)}</td>
                <td>{(season.FG/season.G).toFixed(1)}-{(season.FGA/season.G).toFixed(1)}</td>
                <td>{(season.FG_PCT*100).toFixed(1)}</td>
                <td>{(season.FG_3PM/season.G).toFixed(1)}-{(season.FG_3PA/season.G).toFixed(1)}</td>
                <td>{(season.FG_3P_PCT*100).toFixed(1)}</td>
                <td>{(season.FT/season.G).toFixed(1)}-{(season.FTA/season.G).toFixed(1)}</td>
                <td>{(season.FT_PCT*100).toFixed(1)}</td>
                <td>{(season.ORG).toFixed(1)}</td>  
                <td>{(season.DRG).toFixed(1)}</td>
                <td>{(season.RPG).toFixed(1)}</td>
                <td>{(season.APG).toFixed(1)}</td>
                <td>{(season.BPG).toFixed(1)}</td>
                <td>{(season.SPG).toFixed(1)}</td>
                <td>{(season.FPG).toFixed(1)}</td>
                <td>{(season.TPG).toFixed(1)}</td>
                <td>{(season.PPG).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };
    
    const ProductTable1 = (props) => {
      const { items, requestSort, sortConfig } = useSortableData(props.products);
      const getClassNamesFor = (name) => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
      };
      return (
        <table>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('SEASON')}
                  className={getClassNamesFor('SEASON')}
                >
                  Season
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TEAM')}
                  className={getClassNamesFor('TEAM')}
                >
                  Team
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('G')}
                  className={getClassNamesFor('G')}
                >
                  GP
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('GS')}
                  className={getClassNamesFor('GS')}
                >
                  GS
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('MP')}
                  className={getClassNamesFor('MP')}
                >
                  MIN
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FG')}
                  className={getClassNamesFor('FG')}
                >
                  FG-FGA
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FG_PCT')}
                  className={getClassNamesFor('FG_PCT')}
                >
                  FG%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FG_3PM')}
                  className={getClassNamesFor('FG_3PM')}
                >
                  3P-3PA
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FG_3P_PCT')}
                  className={getClassNamesFor('FG_3P_PCT')}
                >
                  3P%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FT')}
                  className={getClassNamesFor('FT')}
                >
                  FT-FTA
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FT_PCT')}
                  className={getClassNamesFor('FT_PCT')}
                >
                  FT%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('ORB')}
                  className={getClassNamesFor('ORB')}
                >
                  ORB
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('DRB')}
                  className={getClassNamesFor('DRB')}
                >
                  DRB
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TRB')}
                  className={getClassNamesFor('TRB')}
                >
                  REB
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('AST')}
                  className={getClassNamesFor('AST')}
                >
                  AST
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('BLK')}
                  className={getClassNamesFor('BLK')}
                >
                  BLK
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('STL')}
                  className={getClassNamesFor('STL')}
                >
                  STL
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('PF')}
                  className={getClassNamesFor('PF')}
                >
                  PF
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TOV')}
                  className={getClassNamesFor('TOV')}
                >
                  TOV
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('PTS')}
                  className={getClassNamesFor('PTS')}
                >
                  PTS
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((season, index) => (
              <tr key={[season.ID, season.SEASON, season.TEAM].join()}>
                <td>{season.SEASON}</td>
                <td>{season.TEAM}</td>
                <td>{season.G}</td>
                <td>{season.GS}</td>
                <td>{(season.MP).toFixed(0)}</td>
                <td>{(season.FG).toFixed(0)}-{(season.FGA).toFixed(0)}</td>
                <td>{(season.FG_PCT*100).toFixed(1)}</td>
                <td>{(season.FG_3PM).toFixed(0)}-{(season.FG_3PA).toFixed(0)}</td>
                <td>{(season.FG_3P_PCT*100).toFixed(1)}</td>
                <td>{(season.FT).toFixed(0)}-{(season.FTA).toFixed(0)}</td>
                <td>{(season.FT_PCT*100).toFixed(1)}</td>
                <td>{(season.ORB)}</td>  
                <td>{(season.DRB)}</td>
                <td>{(season.TRB)}</td>
                <td>{(season.AST)}</td>
                <td>{(season.BLK)}</td>
                <td>{(season.STL)}</td>
                <td>{(season.PF)}</td>
                <td>{(season.TOV)}</td>
                <td>{(season.PTS)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

                // <td>{season.TEAM}</td>
                // <td>{season.G}</td>
                // <td>{season.GS}</td>
                // <td>{season.MP}</td>
                // <td>{season.PER}</td>
                // <td>{season.TS_PCT}</td>
                // <td>{season.E_FG_PCT}</td>
                // <td>{season.ATT_RATE_3P}</td>
                // <td>{season.FT_RATE}</td>
                // <td>{season.PProd}</td>
                // <td>{season.ORB_PCT}</td>
                // <td>{season.DRB_PCT}</td>
                // <td>{season.TRB_PCT}</td>
                // <td>{season.AST_PCT}</td>
                // <td>{season.STL_PCT}</td>
                // <td>{season.BLK_PCT}</td>
                // <td>{season.TOV_PCT}</td>
                // <td>{season.USG_PCT}</td>
                // <td>{season.OWS}</td>
                // <td>{season.DWS}</td>
                // <td>{season.WS}</td>
                // <td>{season.WS_40}</td>
                // <td>{season.OBPM}</td>
                // <td>{season.DBPM}</td>
                // <td>{season.BPM}</td>
    const ProductTable2 = (props) => {
      const { items, requestSort, sortConfig } = useSortableData(props.products);
      const getClassNamesFor = (name) => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
      };
      return (
        <table>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('SEASON')}
                  className={getClassNamesFor('SEASON')}
                >
                  Season
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TEAM')}
                  className={getClassNamesFor('TEAM')}
                >
                  Team
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('G')}
                  className={getClassNamesFor('G')}
                >
                  GP
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('GS')}
                  className={getClassNamesFor('GS')}
                >
                  GS
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('MP')}
                  className={getClassNamesFor('MP')}
                >
                  MIN
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('PER')}
                  className={getClassNamesFor('PER')}
                >
                  PER
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TS_PCT')}
                  className={getClassNamesFor('TS_PCT')}
                >
                  TS%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('E_FG_PCT')}
                  className={getClassNamesFor('E_FG_PCT')}
                >
                  eFG%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('ATT_RATE_3P')}
                  className={getClassNamesFor('ATT_RATE_3P')}
                >
                  3PAr
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('FT_RATE')}
                  className={getClassNamesFor('FT_RATE')}
                >
                  FTr
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('PProd')}
                  className={getClassNamesFor('PProd')}
                >
                  PProd
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('ORB_PCT')}
                  className={getClassNamesFor('ORB_PCT')}
                >
                  ORB%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('DRB_PCT')}
                  className={getClassNamesFor('DRB_PCT')}
                >
                  DRB%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TRB_PCT')}
                  className={getClassNamesFor('TRB_PCT')}
                >
                  TRB%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('AST_PCT')}
                  className={getClassNamesFor('AST_PCT')}
                >
                  AST%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('STL_PCT')}
                  className={getClassNamesFor('STL_PCT')}
                >
                  STL%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('BLK_PCT')}
                  className={getClassNamesFor('BLK_PCT')}
                >
                  BLK%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('TOV_PCT')}
                  className={getClassNamesFor('TOV_PCT')}
                >
                  TOV%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('USG_PCT')}
                  className={getClassNamesFor('USG_PCT')}
                >
                  USG%
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('OWS')}
                  className={getClassNamesFor('OWS')}
                >
                  OWS
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('DWS')}
                  className={getClassNamesFor('DWS')}
                >
                  DWS
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('WS')}
                  className={getClassNamesFor('WS')}
                >
                  WS
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('WS_40')}
                  className={getClassNamesFor('WS_40')}
                >
                  WS/40
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('OBPM')}
                  className={getClassNamesFor('OBPM')}
                >
                  OBPM
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('DBPM')}
                  className={getClassNamesFor('DBPM')}
                >
                  DBPM
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('BPM')}
                  className={getClassNamesFor('BPM')}
                >
                  BPM
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((season, index) => (
              <tr key={[season.ID, season.SEASON, season.TEAM].join()}>
                <td>{season.SEASON}</td>
                <td>{season.TEAM}</td>
                <td>{season.G}</td>
                <td>{season.GS}</td>
                <td>{season.MP}</td>
                <td>{season.PER}</td>
                <td>{season.TS_PCT}</td>
                <td>{season.E_FG_PCT}</td>
                <td>{season.ATT_RATE_3P}</td>
                <td>{season.FT_RATE}</td>
                <td>{season.PProd}</td>
                <td>{season.ORB_PCT.toFixed(1)}</td>
                <td>{season.DRB_PCT.toFixed(1)}</td>
                <td>{season.TRB_PCT.toFixed(1)}</td>
                <td>{season.AST_PCT.toFixed(1)}</td>
                <td>{season.STL_PCT.toFixed(1)}</td>
                <td>{season.BLK_PCT.toFixed(1)}</td>
                <td>{season.TOV_PCT.toFixed(1)}</td>
                <td>{season.USG_PCT.toFixed(1)}</td>
                <td>{season.OWS.toFixed(1)}</td>
                <td>{season.DWS.toFixed(1)}</td>
                <td>{season.WS.toFixed(1)}</td>
                <td>{season.WS_40}</td>
                <td>{season.OBPM.toFixed(1)}</td>
                <td>{season.DBPM.toFixed(1)}</td>
                <td>{season.BPM.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    return (
      <div className="App">
        <h2>Per Game</h2>
        <ProductTable
          products={nbaStatList}
        />
        <h2>Totals</h2>
        <ProductTable1
          products={nbaStatList}
        />
        <h2>Advanced</h2>
        <ProductTable2
          products={nbaStatList}
        />
      </div>
    );
  };

  const ComparisonPage = ({ match, location }) => {
    const { params: { playerID } } = match;
    const[playerData, setPlayerData] = useState([]);
    const[player1NBAData, setPlayer1NBAData] = useState([]);
    const[player2NBAData, setPlayer2NBAData] = useState([]);
    const[player3NBAData, setPlayer3NBAData] = useState([]);
    const[player4NBAData, setPlayer4NBAData] = useState([]);
    const[player5NBAData, setPlayer5NBAData] = useState([]);
    const[player1NCAAbio, setPlayer1NCAAbio] = useState([]);
    const[player2NCAAbio, setPlayer2NCAAbio] = useState([]);
    const[player3NCAAbio, setPlayer3NCAAbio] = useState([]);
    const[player4NCAAbio, setPlayer4NCAAbio] = useState([]);
    const[player5NCAAbio, setPlayer5NCAAbio] = useState([]);
    const[done, setDone] = useState(undefined);

    useEffect(() => {
      Axios.get(url+`/graphs/${playerID}`).then((response)=>{
        setPlayerData(response.data[0])
      })
      Axios.get(url+`/NBAstats1/${playerID}`).then((response)=>{
        setPlayer1NBAData(response.data)
      })
      Axios.get(url+`/NBAstats2/${playerID}`).then((response)=>{
        setPlayer2NBAData(response.data)
      })
      Axios.get(url+`/NBAstats3/${playerID}`).then((response)=>{
        setPlayer3NBAData(response.data)
      })
      Axios.get(url+`/NBAstats4/${playerID}`).then((response)=>{
        setPlayer4NBAData(response.data)
      })
      Axios.get(url+`/NBAstats5/${playerID}`).then((response)=>{
        setPlayer5NBAData(response.data)
      })
      Axios.get(url+`/NCAAbio1/${playerID}`).then((response)=>{
        setPlayer1NCAAbio(response.data[0])
      })
      Axios.get(url+`/NCAAbio2/${playerID}`).then((response)=>{
        setPlayer2NCAAbio(response.data[0])
      })
      Axios.get(url+`/NCAAbio3/${playerID}`).then((response)=>{
        setPlayer3NCAAbio(response.data[0])
      })
      Axios.get(url+`/NCAAbio4/${playerID}`).then((response)=>{
        setPlayer4NCAAbio(response.data[0])
      })
      Axios.get(url+`/NCAAbio5/${playerID}`).then((response)=>{
        setPlayer5NCAAbio(response.data[0])
        setDone(true);
      })
    }, []);

    return (
      <>
        {!done ? (
          <ReactLoading
            type={"bars"}
            color={"#236192"}
            height={100}
            width={100}
          />
        ) : (
          <>
            <body>
              <h2>1 - {playerData.Player1} - {playerData.Similarity1*100}%</h2>
              <p>{Math.trunc(player1NCAAbio.HEIGHT/12)}' {player1NCAAbio.HEIGHT%12}'', {player1NCAAbio.WEIGHT} lbs</p>
              <Collapsible trigger="NCAA Stats" open="true">
                <table>
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Team</th>
                      <th>G</th>
                      <th>GS</th>
                      <th>MP</th>
                      <th>FG - FGA</th>
                      <th>FG%</th>
                      <th>3P - 3PA</th>
                      <th>3P%</th>
                      <th>FT - FTA</th>
                      <th>FT%</th>
                      <th>ORB</th>
                      <th>DRB</th>
                      <th>TRB</th>
                      <th>AST</th>
                      <th>BLK</th>
                      <th>STL</th>
                      <th>PF</th>
                      <th>TOV</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player1NBAData.map((season) => (
                      
                      <tr key={[season.ID, season.SEASON, season.TEAM].join()}>
                        <td>{season.SEASON}</td>
                        <td>{season.TEAM}</td>
                        <td>{season.G}</td>
                        <td>{season.GS}</td>
                        <td>{(season.MP/season.G).toFixed(1)}</td>
                        <td>{(season.FG/season.G).toFixed(1)}-{(season.FGA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_PCT*100).toFixed(1)}</td>
                        <td>{(season.FG_3PM/season.G).toFixed(1)}-{(season.FG_3PA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_3P_PCT*100).toFixed(1)}</td>
                        <td>{(season.FT/season.G).toFixed(1)}-{(season.FTA/season.G).toFixed(1)}</td>
                        <td>{(season.FT_PCT*100).toFixed(1)}</td>
                        <td>{(season.ORB/season.G).toFixed(1)}</td>  
                        <td>{(season.DRB/season.G).toFixed(1)}</td>
                        <td>{(season.TRB/season.G).toFixed(1)}</td>
                        <td>{(season.AST/season.G).toFixed(1)}</td>
                        <td>{(season.BLK/season.G).toFixed(1)}</td>
                        <td>{(season.STL/season.G).toFixed(1)}</td>
                        <td>{(season.PF/season.G).toFixed(1)}</td>
                        <td>{(season.TOV/season.G).toFixed(1)}</td>
                        <td>{(season.PTS/season.G).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Collapsible>
            </body>
            <body>
              <h2>2 - {playerData.Player2} - {playerData.Similarity2*100}%</h2>
              <p>{Math.trunc(player2NCAAbio.HEIGHT/12)}' {player2NCAAbio.HEIGHT%12}'', {player2NCAAbio.WEIGHT} lbs</p>
              <Collapsible trigger="NCAA Stats" open="true">
                <table>
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Team</th>
                      <th>G</th>
                      <th>GS</th>
                      <th>MP</th>
                      <th>FG - FGA</th>
                      <th>FG%</th>
                      <th>3P - 3PA</th>
                      <th>3P%</th>
                      <th>FT - FTA</th>
                      <th>FT%</th>
                      <th>ORB</th>
                      <th>DRB</th>
                      <th>TRB</th>
                      <th>AST</th>
                      <th>BLK</th>
                      <th>STL</th>
                      <th>PF</th>
                      <th>TOV</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player2NBAData.map((season) => (
                      <tr key={[season.ID, season.SEASON, season.TEAM].join()}>
                        <td>{season.SEASON}</td>
                        <td>{season.TEAM}</td>
                        <td>{season.G}</td>
                        <td>{season.GS}</td>
                        <td>{(season.MP/season.G).toFixed(1)}</td>
                        <td>{(season.FG/season.G).toFixed(1)}-{(season.FGA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_PCT*100).toFixed(1)}</td>
                        <td>{(season.FG_3PM/season.G).toFixed(1)}-{(season.FG_3PA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_3P_PCT*100).toFixed(1)}</td>
                        <td>{(season.FT/season.G).toFixed(1)}-{(season.FTA/season.G).toFixed(1)}</td>
                        <td>{(season.FT_PCT*100).toFixed(1)}</td>
                        <td>{(season.ORB/season.G).toFixed(1)}</td>  
                        <td>{(season.DRB/season.G).toFixed(1)}</td>
                        <td>{(season.TRB/season.G).toFixed(1)}</td>
                        <td>{(season.AST/season.G).toFixed(1)}</td>
                        <td>{(season.BLK/season.G).toFixed(1)}</td>
                        <td>{(season.STL/season.G).toFixed(1)}</td>
                        <td>{(season.PF/season.G).toFixed(1)}</td>
                        <td>{(season.TOV/season.G).toFixed(1)}</td>
                        <td>{(season.PTS/season.G).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Collapsible>
            </body>
            <body>
              <h2>3 - {playerData.Player3} - {playerData.Similarity3*100}%</h2>
              <p>{Math.trunc(player3NCAAbio.HEIGHT/12)}' {player3NCAAbio.HEIGHT%12}'', {player3NCAAbio.WEIGHT} lbs</p>
              <Collapsible trigger="NCAA Stats" open="true">
                <table>
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Team</th>
                      <th>G</th>
                      <th>GS</th>
                      <th>MP</th>
                      <th>FG - FGA</th>
                      <th>FG%</th>
                      <th>3P - 3PA</th>
                      <th>3P%</th>
                      <th>FT - FTA</th>
                      <th>FT%</th>
                      <th>ORB</th>
                      <th>DRB</th>
                      <th>TRB</th>
                      <th>AST</th>
                      <th>BLK</th>
                      <th>STL</th>
                      <th>PF</th>
                      <th>TOV</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player3NBAData.map((season) => (
                      <tr key={[season.ID, season.SEASON, season.TEAM].join()}>
                        <td>{season.SEASON}</td>
                        <td>{season.TEAM}</td>
                        <td>{season.G}</td>
                        <td>{season.GS}</td>
                        <td>{(season.MP/season.G).toFixed(1)}</td>
                        <td>{(season.FG/season.G).toFixed(1)}-{(season.FGA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_PCT*100).toFixed(1)}</td>
                        <td>{(season.FG_3PM/season.G).toFixed(1)}-{(season.FG_3PA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_3P_PCT*100).toFixed(1)}</td>
                        <td>{(season.FT/season.G).toFixed(1)}-{(season.FTA/season.G).toFixed(1)}</td>
                        <td>{(season.FT_PCT*100).toFixed(1)}</td>
                        <td>{(season.ORB/season.G).toFixed(1)}</td>  
                        <td>{(season.DRB/season.G).toFixed(1)}</td>
                        <td>{(season.TRB/season.G).toFixed(1)}</td>
                        <td>{(season.AST/season.G).toFixed(1)}</td>
                        <td>{(season.BLK/season.G).toFixed(1)}</td>
                        <td>{(season.STL/season.G).toFixed(1)}</td>
                        <td>{(season.PF/season.G).toFixed(1)}</td>
                        <td>{(season.TOV/season.G).toFixed(1)}</td>
                        <td>{(season.PTS/season.G).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Collapsible>
            </body>
            <body>
              <h2>4 - {playerData.Player4} - {playerData.Similarity4*100}%</h2>
              <p>{Math.trunc(player4NCAAbio.HEIGHT/12)}' {player4NCAAbio.HEIGHT%12}'', {player4NCAAbio.WEIGHT} lbs</p>
              <Collapsible trigger="NCAA Stats" open="true">
                <table>
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Team</th>
                      <th>G</th>
                      <th>GS</th>
                      <th>MP</th>
                      <th>FG - FGA</th>
                      <th>FG%</th>
                      <th>3P - 3PA</th>
                      <th>3P%</th>
                      <th>FT - FTA</th>
                      <th>FT%</th>
                      <th>ORB</th>
                      <th>DRB</th>
                      <th>TRB</th>
                      <th>AST</th>
                      <th>BLK</th>
                      <th>STL</th>
                      <th>PF</th>
                      <th>TOV</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player4NBAData.map((season) => (
                      <tr key={[season.ID, season.SEASON, season.TEAM].join()}>
                        <td>{season.SEASON}</td>
                        <td>{season.TEAM}</td>
                        <td>{season.G}</td>
                        <td>{season.GS}</td>
                        <td>{(season.MP/season.G).toFixed(1)}</td>
                        <td>{(season.FG/season.G).toFixed(1)}-{(season.FGA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_PCT*100).toFixed(1)}</td>
                        <td>{(season.FG_3PM/season.G).toFixed(1)}-{(season.FG_3PA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_3P_PCT*100).toFixed(1)}</td>
                        <td>{(season.FT/season.G).toFixed(1)}-{(season.FTA/season.G).toFixed(1)}</td>
                        <td>{(season.FT_PCT*100).toFixed(1)}</td>
                        <td>{(season.ORB/season.G).toFixed(1)}</td>  
                        <td>{(season.DRB/season.G).toFixed(1)}</td>
                        <td>{(season.TRB/season.G).toFixed(1)}</td>
                        <td>{(season.AST/season.G).toFixed(1)}</td>
                        <td>{(season.BLK/season.G).toFixed(1)}</td>
                        <td>{(season.STL/season.G).toFixed(1)}</td>
                        <td>{(season.PF/season.G).toFixed(1)}</td>
                        <td>{(season.TOV/season.G).toFixed(1)}</td>
                        <td>{(season.PTS/season.G).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Collapsible>
            </body>
            <body>
              <h2>5 - {playerData.Player5} - {playerData.Similarity5*100}%</h2>
              <p>{Math.trunc(player5NCAAbio.HEIGHT/12)}' {player5NCAAbio.HEIGHT%12}'', {player5NCAAbio.WEIGHT} lbs</p>
              <Collapsible trigger="NCAA Stats" open="true">
                <table>
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Team</th>
                      <th>G</th>
                      <th>GS</th>
                      <th>MP</th>
                      <th>FG - FGA</th>
                      <th>FG%</th>
                      <th>3P - 3PA</th>
                      <th>3P%</th>
                      <th>FT - FTA</th>
                      <th>FT%</th>
                      <th>ORB</th>
                      <th>DRB</th>
                      <th>TRB</th>
                      <th>AST</th>
                      <th>BLK</th>
                      <th>STL</th>
                      <th>PF</th>
                      <th>TOV</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player5NBAData.map((season) => (
                      <tr key={[season.ID, season.SEASON, season.TEAM].join()}>
                        <td>{season.SEASON}</td>
                        <td>{season.TEAM}</td>
                        <td>{season.G}</td>
                        <td>{season.GS}</td>
                        <td>{(season.MP/season.G).toFixed(1)}</td>
                        <td>{(season.FG/season.G).toFixed(1)}-{(season.FGA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_PCT*100).toFixed(1)}</td>
                        <td>{(season.FG_3PM/season.G).toFixed(1)}-{(season.FG_3PA/season.G).toFixed(1)}</td>
                        <td>{(season.FG_3P_PCT*100).toFixed(1)}</td>
                        <td>{(season.FT/season.G).toFixed(1)}-{(season.FTA/season.G).toFixed(1)}</td>
                        <td>{(season.FT_PCT*100).toFixed(1)}</td>
                        <td>{(season.ORB/season.G).toFixed(1)}</td>  
                        <td>{(season.DRB/season.G).toFixed(1)}</td>
                        <td>{(season.TRB/season.G).toFixed(1)}</td>
                        <td>{(season.AST/season.G).toFixed(1)}</td>
                        <td>{(season.BLK/season.G).toFixed(1)}</td>
                        <td>{(season.STL/season.G).toFixed(1)}</td>
                        <td>{(season.PF/season.G).toFixed(1)}</td>
                        <td>{(season.TOV/season.G).toFixed(1)}</td>
                        <td>{(season.PTS/season.G).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Collapsible>
            </body>
          </>
        )}
      </>
    );
  };

  const firststyle = {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100%"
  };

  return (
    <div className="App">
      <section className="App">
      <Router>
        <ul style={firststyle}>
          <li><Link to="/players">Players</Link></li>
          <li><Link to="/scatterplot">Scatter Plot</Link></li>
        </ul>
        <Route exact path="/" component={PlayersPage} />
        <Route exact path="/players" component={PlayersPage} />
        <Route path="/player/:playerID" component={PlayerPage} />
        <Route path="/player/:playerID/stats" component={StatsPage} />
        <Route path="/player/:playerID/comparisons" component={ComparisonPage} />
        <Route path="/player/:playerID/overview" component={OverviewPage} />
        <Route exact path="/scatterplot" component={ScatterPlotPage} />
      </Router>
    </section>
      
    </div>
  );
}

export default App;
