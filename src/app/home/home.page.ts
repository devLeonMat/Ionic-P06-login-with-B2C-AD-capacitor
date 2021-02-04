import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {SpeakersService} from "../services/Speakers.Service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    user: any;
    speakers: any;
    error: any;

    constructor(private authService: AuthenticationService,
                private speakersService: SpeakersService) {
    }

    async ngOnInit() {
        this.user = await this.authService.getUserInfo();
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
            console.log('Reason', reason)
        });
        this.authService.isAccessTokenExpired().then(value => {
            console.log('isAccessTokenExpired', value);
            localStorage.setItem('isAccessTokenExpired', JSON.stringify(value));
        }, reason => {
            console.log('Reason isAccessTokenExpired', reason)
        });
        this.authService.getAccessToken().then(value => {
            console.log('getAccessToken', value);
            localStorage.setItem('getAccessToken', JSON.stringify(value));
            this.speakersService.getSpeakers(value).subscribe(value1 => {
                this.speakers = value1;
            }, error => {
                this.error = error
            })
        }, reason => {
            console.log(reason);
        })

    }

}


















