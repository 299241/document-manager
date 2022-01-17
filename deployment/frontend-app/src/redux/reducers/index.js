import { combineReducers } from 'redux';

import authStore from './auth.reducer';
import documentsStore from './documents.reducer';
import filesStore from './files.reducer';

const rootReducer = combineReducers({ authStore, documentsStore, filesStore });

export default rootReducer;
