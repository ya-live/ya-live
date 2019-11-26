import debug from 'debug';
import * as admin from 'firebase-admin';

const log = debug('tjl:models:firebaseadmin');

interface Config {
  databaseurl: string;
  credential: {
    privateKey: string;
    clientEmail: string;
    projectId: string;
  };
}

export default class FirebaseAdmin {
  public static instance: FirebaseAdmin;

  private init: boolean = false;

  public static getInstance() {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
      FirebaseAdmin.instance.bootstrap();
    }
    return FirebaseAdmin.instance;
  }

  public bootstrap(): void {
    if (!!admin.apps.length === true) {
      this.init = true;
      return;
    }
    log('bootstrap start');
    const config: Config = {
      databaseurl: process.env.databaseurl || '',
      credential: {
        privateKey: (process.env.privateKey || '').replace(/\\n/g, '\n'),
        clientEmail: process.env.clientEmail || '',
        projectId: process.env.projectId || '',
      },
    };

    admin.initializeApp({
      databaseURL: config.databaseurl,
      credential: admin.credential.cert(config.credential),
    });
    log('bootstrap end');
    this.init = true;
  }

  /** firestore */
  public get Firestore() {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.firestore();
  }

  public get Auth() {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.auth();
  }
}
