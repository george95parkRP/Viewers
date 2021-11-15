import sjcl from 'sjcl';
import os from 'os';
import axios from 'axios';

function hashToken(text) {
  const arr = sjcl.hash.sha256.hash(text);
  return sjcl.codec.hex.fromBits(arr).toString();
}

function studyPayload(user, study) {
  const osUsername = os.userInfo().username;
  const username = user.profile.preferred_username;
  const hostname = os.hostname();
  const accession = study.accession !== undefined ? study.accession : '';

  return {
    accession: accession,
    study_iuid: study.studyUid,
    username: username,
    os_username: osUsername,
    hostname: hostname,
  };
}

const defaultOptions = {
  host: 'http://localhost:8080',
};

const loginPath = '/l';
const apiPath = '/api/v2';
const eventPath = apiPath + '/external/events';
const studyOpenPath = eventPath + '/on-study-opened';
const studyClosedPath = eventPath + '/on-study-closed';

export default options => {
  if (options === undefined || options === null) {
    options = defaultOptions;
  }

  const api = axios.create({
    baseURL: options.host,
    timeout: 1000,
  });

  return {
    login: async user => {
      const username = os.userInfo().username;
      const token = user.profile['aidoc-token'];
      // const username = user.profile.preferred_username;
      const hash = hashToken(username + token);

      try {
        await api.get(loginPath, {
          params: { u: username, t: hash },
        });
      } catch (e) {
        throw new Error('login failed: ' + e.response.data.error);
      }
    },
    studyOpen: async (user, study) => {
      const payload = studyPayload(user, study);
      try {
        await api.post(studyOpenPath, payload);
      } catch (e) {
        throw new Error('study-open failed: ' + e.response.data.error);
      }
    },
    studyClose: async (user, study) => {
      const payload = studyPayload(user, study);
      try {
        await api.post(studyClosedPath, payload);
      } catch (e) {
        throw new Error('study-closed failed: ' + e.response.data.error);
      }
    },
  };
};
