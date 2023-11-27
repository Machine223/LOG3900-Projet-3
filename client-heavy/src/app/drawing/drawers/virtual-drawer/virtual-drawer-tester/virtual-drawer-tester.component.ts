import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { AlertService } from 'src/app/pop-up/alert/alert.service';
import { INetworkWordImagePair } from 'src/app/word-image-pair/word-image-pair-network-interface/network-word-image-pair';
import { INetworkWordImagePairList } from 'src/app/word-image-pair/word-image-pair-network-interface/network-word-image-pair-list';
import { VirtualDrawerService } from '../virtual-drawer.service';

@Component({
    selector: 'app-virtual-drawer-tester',
    templateUrl: './virtual-drawer-tester.component.html',
    styleUrls: ['./virtual-drawer-tester.component.scss'],
})
export class VirtualDrawerTesterComponent {
    @Output() newNavigation: EventEmitter<string>;
    pairToSearch: string;
    delay: number;
    foundPairs: INetworkWordImagePair[];

    constructor(
        private constants: ConstantsRepositoryService,
        private http: HttpClient,
        private alertService: AlertService,
        private virtualDrawer: VirtualDrawerService,
    ) {
        this.newNavigation = new EventEmitter();
        this.pairToSearch = '';
        this.foundPairs = [];
        this.delay = 10;
    }

    backToMainMenu(): void {
        this.newNavigation.emit(this.constants.MAIN_MENU);
    }

    searchPair(): void {
        if (this.pairToSearch.trim().length > 0) {
            this.http.get(`${this.constants.URI}/pair/${this.pairToSearch}`).subscribe((pairList: INetworkWordImagePairList) => {
                if (pairList.pairs.length > 0) {
                    this.foundPairs = pairList.pairs;
                } else {
                    const TITLE = 'No such pair';
                    const CONTENT = 'No pair with such word exists';
                    this.alertService.alertError(TITLE, CONTENT);
                }
            });
            this.pairToSearch = '';
        }
    }

    previewPair(pair: INetworkWordImagePair): void {
        this.virtualDrawer.stopDrawing();
        this.virtualDrawer.setDrawing(pair);
        this.virtualDrawer.startDrawing(this.delay);
    }
}
