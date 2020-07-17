import { Component, OnInit } from '@angular/core'
import { SharedService } from '@app/services/shared.service'
import { trigger, state, style, transition, animate } from '@angular/animations'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [
        trigger('openClose', [
            // ...
            state(
                'open',
                style({
                    width: '15rem',
                })
            ),
            state(
                'closed',
                style({
                    width: 'auto',
                })
            ),
            transition('open => closed', [animate('0.01s')]),
            transition('closed => open', [animate('0.01s')]),
        ]),
    ],
})
export class DashboardComponent implements OnInit {
    menuStatus

    constructor(public sharedService: SharedService) {
        this.sharedService.getMenuStatus().subscribe((res) => {
            this.menuStatus = res
        })
    }

    ngOnInit(): void {}
}
