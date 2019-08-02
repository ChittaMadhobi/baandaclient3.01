import axios from 'axios';

// import { loginUser } from '../../../actions/authActions';
// import { personaUpdate } from '../../actions/personaAction';

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const personaapi = '/routes/users/postUserPersonaScore'

export async function personaCalc(baandaid, inputScores) {
  // console.log("Inside personaCalc - input param: ", inputScores);
  // Comment to check git
  let scoringDone = true;
  let leftToAns = 0;
  let calcState = {};
  let updateScore = [];
  let data;
  inputScores.forEach(function(element) {
    // console.log('element.v:', element.v);
    data = {
        seq_no: element.seq_no,
        score: element.v
    }
    updateScore.push(data);
    if (element.v === 0) {
      scoringDone = false;
      leftToAns++;
    }
  });
  // console.log("scoringDone: ", scoringDone, " leftToAns:", leftToAns);

  if (scoringDone) {
    // if true then send the assessment back after storing in DB
    let calcPersona = calculatePersona(inputScores);
    calcState = {
      status: true,
      noLeft: leftToAns,
      persona: calcPersona,
    };
  } else {
    // Store work in progress scores in DB.
    // let calcPersona = calculatePersona(inputScores);
    calcState = {
      status: false,
      noLeft: leftToAns,
      persona: {},
    };
  }

  let toUpdateData = {
      baandaid: baandaid,
      personalList: updateScore,
      ocean: calcState.persona,
      initDone: scoringDone
  }

  await saveInDB(toUpdateData);
  
  // console.log('saveInDB ret: ', ret);
//   console.log("calcState:", calcState);
  return calcState;
}

// Calculaete  the persona
function calculatePersona(theList) {
  // Persona OCEAN - big five
  //   console.log("calculatePersona:", theList);
  let switchvar, adjustedScore;
  let o = 0,
    c = 0,
    e = 0,
    a = 0,
    n = 0;
  theList.forEach(function(row) {
    // console.log('row: ', row, );
    switchvar = row.persona_category.trim();
    adjustedScore = parseInt(row.v);
    if (row.inversion_flag === "minus") {
      if (adjustedScore !== 0) {
        adjustedScore = 10 - adjustedScore + 1; // Inverse the value between 1 to 10
      }
    }
    switch (switchvar) {
      case "O":
        o = o + adjustedScore;
        break;
      case "C":
        c = c + adjustedScore;
        break;
      case "E":
        e = e + adjustedScore;
        break;
      case "A":
        a = a + adjustedScore;
        break;
      case "N":
        n = n + adjustedScore;
        break;
      default:
        console.log(
          "Fatal Error: Such persona category <" +
            switchvar +
            "> should not exist"
        );
        break;
    }
  });
  let persona = {
    O: o,
    C: c,
    E: e,
    A: a,
    N: n
  };
  // console.log("xx: ", persona);
  return persona;
}

async function saveInDB(toUpdatePersonaData) {
  // console.log("saveInDB: ", toUpdatePersonaData);
  let response = true;
  try {
    let url = baandaServer + personaapi;  
    let dbresponse = await axios.post(url, toUpdatePersonaData);
    if (!dbresponse) {
        throw new Error('No syntax error but did not update DB properly.');
    }  
    
    // console.log('Got dbresponse... for  debugging only.:', dbresponse);
  } catch(err) {
    console.log('Error (personaCalc SaveInDB:', err);
    response = false;
  }
 
  return response;
}
