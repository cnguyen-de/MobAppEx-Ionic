import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from './api';


@Injectable()
export class User {
    _user: any;

    constructor(public api: Api) { }

    login(accountInfo: any) {
        let seq = this.api.post('SnoozeUser', accountInfo).share();
        seq.subscribe((res : any) => {
            // If the API returned a successful response, mark the user as logged in
            if (res.status === "success") {
                this._loggedIn(res);
            } else {
            }
        }, err => {
            console.error('ERROR in user.ts', err);
        });

        return seq;
    }

    signup(accountInfo: any) {
        let seq = this.api.post('SnoozeUsers', accountInfo).share();

        seq.subscribe((res: any) => {
            if (res.status === "success") {
                this._loggedIn(res);
            }
        }, err => {
            console.error('ERROR', err);
        });

        return seq;
    }

    contact(accountInfo: any) {
        let seq = this.api.post('contact', accountInfo).share();

        seq.subscribe((res: any) => {
            // If the API returned a successful response, mark the user as logged in

        }, err => {
            console.error('ERROR', err);
        });

        return seq;
    }

    /**
     * Log the user out, which forgets the session
     */
    logout() {
        this._user = null;
    }

    /**
     * Process a login/signup response to store user data
     */
    _loggedIn(resp) {
        this._user = resp.user;
    }
}
