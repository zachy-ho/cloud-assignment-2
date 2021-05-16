import axios from 'axios';
import { baseUrl, dbName } from '../config/couchdb';

export default axios.create({
  baseURL: `${baseUrl}/${dbName}/`,
  headers: { Authorization: `Basic ${btoa('admin:admin')}` },
});
