import firebase from 'firebase'

/**
 * config
 *
 * Firebase config
 *
 * This object contains all the configuration information required to initialize the firebase library.
 * I know this is an API key, and I know that it's public. That's fine.
 * This one gets published publicly for communication with the app.
 * Access control is maintained by Firebase rules.
 */
const config = {
  apiKey: "AIzaSyBZq9e31zx1SujkjheC1ynjXVuP_QRh1NA",
  authDomain: "howmanybedsdotcom-3de41.firebaseapp.com",
  databaseURL: "https://howmanybedsdotcom-3de41.firebaseio.com",
  projectId: "howmanybedsdotcom-3de41",
};

//Initialize firebase then export it
firebase.initializeApp(config);

export default firebase;
