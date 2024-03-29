import axios from 'axios';
import config from '@/config';
import { UserOperation } from '@soulwallet/sdk';

const axio = axios.create({
  baseURL: config.backendURL,
});

axio.interceptors.response.use((res: any) => {
  if (res.data.code !== 200) {
    // TODO, wrap API and useToast
    console.error(res.data.msg);
    // toast.error(res.data.msg);
  }
  return res.data;
});

const recovery = {
  create: (params: any) => axio.post(`/recovery-record`, params),
  get: (opHash: string) => axio.get(`/recovery-record/${opHash}`),
  getOp: (opHash: string) => axio.get(`/recovery-record/guardian/${opHash}`),
  sig: (params: any) => axio.post(`/recovery-record/guardian/${params.opHash}`),
};

const notification = {
  backup: (params: any) => axio.post('/notification/backup-guardians', params),
};

const account = {
  add: (params: any) => axio.post('/add-account', params),
  update: (params: any) => axio.post('/update-account', params),
  verifyEmail: (params: any) => axio.post('/verify-email', params),
  recover: (params: any) => axio.post('/add-recovery-record', params),
  isWalletOwner: (params: any) => axio.post('/is-wallet-owner', params),
  getWalletAddress: (params: any) => axio.post('/get-wallet-address', params),
  finishRecoveryRecord: (params: any) => axio.post('/finish-recovery-record', params),
};

const guardian = {
  backupSlot: (params: any) => axio.post('/backup/public-backup-slot-info', params),
  backupGuardians: (params: any) => axio.post('/backup/public-backup-guardians', params),
  emailBackupGuardians: (params: any) => axio.post('/backup/email-backup-guardians', params),
  getSlotInfo: (params: any) => axio.get('/backup/slot-info', { params }),
  getGuardianDetails: (params: any) => axio.get('/social-recovery/guardian-details', { params }),
  createRecoverRecord: (params: any) => axio.post('/social-recovery/create-recovery-record', params),
  guardianSign: (params: any) => axio.post('/social-recovery/sign-recovery-record', params),
  getRecoverRecord: (params: any) => axio.get('/social-recovery/recovery-record', { params }),
  createTask: (params: any) => axio.post('/keystore-execute-helper/create-task', params),
  getTask: (params: any) => axio.get('/keystore-execute-helper/task', { params }),
};

const balance = {
  nft: (params: any) => axio.get('/nft-balance', { params }),
  token: (params: any) => axio.post('/token/ft', params),
};

const price = {
  token: (params: any) => axio.get('/token/ft-price', { params }),
}

const backup = {
  publicBackupCredentialId: (params: any) => axio.post('/backup/public-backup-credential-id', params),
  credential: (params: any) => axio.get('/backup/credential', { params }),
};

const sponsor = {
  check: (chainId: string, entryPoint: string, op: UserOperation) =>
    axio.post('/sponsor/sponsor-op', {
      chainId,
      entryPoint,
      op,
    }),
};

const operation = {
  feedback: (params: any) => axio.post('/operation/feedback', params),
  fileUploadUrl: (params: any) => axio.get('/operation/file-upload-url', { params }),
  requestTestToken: (params: any) => axio.post('/operation/request-test-token', params),
  finishStep: (params: any) =>
    axio.post('/operation/finish-step', {
      taskID: 0,
      ...params,
    }),
};

export default {
  balance,
  recovery,
  account,
  notification,
  guardian,
  sponsor,
  operation,
  backup,
  price,
};
