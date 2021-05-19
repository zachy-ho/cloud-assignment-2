import axios from 'axios';
import { baseUrl } from '../config/couchdb';

export default axios.create({
  baseURL: `${baseUrl}/`,
  headers: { Authorization: `Basic ${btoa('admin:admin')}` },
});
