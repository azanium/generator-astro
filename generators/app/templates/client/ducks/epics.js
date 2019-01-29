import { combineEpics } from 'redux-observable/lib/cjs/combineEpics';
import Home from '@components/home/home.epic';


export default combineEpics(Home);
