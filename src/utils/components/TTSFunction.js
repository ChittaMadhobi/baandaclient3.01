// const speaks = [
//     {
//       name: "Alex",
//       lang: "en-US"
//     },
//     {
//       name: "Daniel",
//       lang: "en-GB"
//     },
//     {
//       name: "Samantha",
//       lang: "en-US"
//     },
//     {
//       name: "Amelie",
//       lang: "fr-CA"
//     }
//   ];
  
  const msg = new SpeechSynthesisUtterance();
  
  // function TTSFunction (props)  {
  const TTSFunction = (props) => {    
    speechSynthesis.cancel();
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 1; // 0 to 2
  
    msg.text = props.value;
  
    // const voice = speaks[1]; //47
    // console.log(`Voice: ${voice.name} and Lang: ${voice.lang}`);
    // msg.voiceURI = voice.name;
    // msg.lang = voice.lang;
  
    speechSynthesis.speak(msg);
  
    return null;
  }
  
  export default TTSFunction;