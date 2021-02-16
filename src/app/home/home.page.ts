import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {SpeakersService} from '../services/Speakers.Service';
import {UserModel} from '../models/user.model';
import {IonicAuth} from '@ionic-enterprise/auth';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    user: any;
    user2: UserModel = new UserModel();
    speakers: any;
    error: any;

    constructor(private authService: AuthenticationService,
                private speakersService: SpeakersService) {
    }

    async ngOnInit() {
        this.user = await this.authService.getUserInfo();
        this.authService.getIdToken().then(value => {
            this.user2 = value;
        }, reason => {
            console.log(reason);
        });

        console.log(this.user2);
        console.log('USER', JSON.stringify(this.user2));
    }

    async logout() {
        await this.authService.logout();
    }

    getSpeakers() {
        this.authService.getIdToken().then(value => {
            console.log('getIdToken', value);
            localStorage.setItem('getIdToken', JSON.stringify(value));
        }, reason => {
            console.log(reason);
        });
        this.authService.isAccessTokenAvailable().then(value => {
            console.log('isAccessTokenAvailable', value);
            localStorage.setItem('isAccessTokenAvailable', JSON.stringify(value));
        }, reason => {
            console.log('Reason', reason);
        });
        this.authService.isAccessTokenExpired().then(value => {
            console.log('isAccessTokenExpired', value);
            localStorage.setItem('isAccessTokenExpired', JSON.stringify(value));
        }, reason => {
            console.log('Reason isAccessTokenExpired', reason);
        });
        // this.authService.getAuthResponse().then(value => {
        //     console.log('AuthResponse', value);
        //     localStorage.setItem('AuthResponse', value.id_token);
        // }, reason => {
        //     console.log('Reason AuthResponse', reason);
        // });
        this.authService.getIdToken().then(value => {
            localStorage.setItem('ionicAuth.getIdToken()', JSON.stringify(value));
            this.authService.isAccessTokenExpired().then((expired) => {
                if (!expired) {
                    this.callSpeakers();
                } else {
                    this.authService.getAccessToken().then(refreshToken => {
                        console.log('refreshToken', refreshToken);
                        this.callSpeakers();
                    }, reason => {
                        console.log(reason);
                    });
                }
            }, reason => {
                console.log(reason);
            });
        });
    }

    callSpeakers() {
        this.authService.getAuthResponse().then(value => {
            console.log('AuthResponse', value);
            localStorage.setItem('AuthResponse', value.id_token);
            this.speakersService.getSpeakers(value.id_token).subscribe(value1 => {
                this.speakers = value1;
            }, error => {
                this.error = error;
            });
        }, reason => {
            console.log('Reason AuthResponse', reason);
        });
    }

}
