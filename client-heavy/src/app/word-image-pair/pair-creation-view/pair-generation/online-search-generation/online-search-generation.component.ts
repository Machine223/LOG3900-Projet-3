import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { AlertService } from 'src/app/pop-up/alert/alert.service';
import { PairCreatorService } from 'src/app/word-image-pair/pair-creator.service';

@Component({
    selector: 'app-online-search-generation',
    templateUrl: './online-search-generation.component.html',
    styleUrls: ['./online-search-generation.component.scss'],
})
export class OnlineSearchGenerationComponent {
    private currentPage: number;
    private imageLinks: string[];
    private lastSearchedWord: string;
    isWaiting: boolean;
    wordToSearch: string;
    shownImageLinks: string[];
    selectedImageLink: string;

    constructor(
        private http: HttpClient,
        private constants: ConstantsRepositoryService,
        private pairCreator: PairCreatorService,
        private alertService: AlertService,
    ) {
        this.currentPage = 0;
        this.isWaiting = false;
        this.wordToSearch = '';
        this.imageLinks = [];
        this.shownImageLinks = [];
    }

    get hasPrevious(): boolean {
        return this.currentPage > 0;
    }

    get hasNext(): boolean {
        return this.currentPage < this.constants.MAX_AVAILABLE_IMAGE / this.constants.IMAGE_PER_PAGE;
    }

    previousAsked(): void {
        this.currentPage--;
        this.updateLinks();
    }

    nextAsked(): void {
        this.currentPage++;
        this.updateLinks();
    }

    launchSearch(): void {
        if (this.wordToSearch === this.lastSearchedWord) {
            this.currentPage = 0;
            this.changeShownImages();
        } else if (this.wordToSearch.trim() !== '') {
            this.lastSearchedWord = this.wordToSearch;
            this.currentPage = 0;
            this.imageLinks = [];
            this.shownImageLinks = [];
            this.selectedImageLink = '';
            this.pairCreator.resetSavedBase64Images();
            this.updateLinks();
        } else {
            this.wordToSearch = '';
        }
    }

    imageSelected(selectedLink: string): void {
        if (selectedLink !== this.selectedImageLink) {
            this.pairCreator.resetSavedBase64Images();
            this.selectedImageLink = selectedLink;
            const options = { headers: { path: this.selectedImageLink } };
            this.http.get(`${this.constants.URI}/pair/online-image`, options).subscribe(
                (response: string) => {
                    this.pairCreator.base64Image = 'data:image/png;base64,' + response;
                    this.pairCreator.onlineSelectedWord = this.lastSearchedWord;
                },
                (error) => {
                    const TITLE = `Error ${error.status}`;
                    const CONTENT = `Cannot find the desired image, please choose another one`;
                    this.alertService.alertError(TITLE, CONTENT);
                },
            );
        }
    }

    private updateLinks(): void {
        const alreadyHasImages = this.currentPage * this.constants.IMAGE_PER_PAGE < this.imageLinks.length;
        if (!alreadyHasImages) {
            this.isWaiting = true;
            this.http.get(`${this.constants.URI}/pair/online-search/${this.wordToSearch}/${this.currentPage}`).subscribe(
                (imageLinks: string[]) => {
                    imageLinks.forEach((imageLink: string) => this.imageLinks.push(imageLink));

                    this.changeShownImages();
                    this.isWaiting = false;
                },
                (error) => {
                    const TITLE = `Error ${error.status}`;
                    const CONTENT = `Cannot find images, try again later`;
                    this.alertService.alertError(TITLE, CONTENT);
                    this.isWaiting = false;
                },
            );
        } else {
            this.changeShownImages();
        }
    }

    private changeShownImages(): void {
        this.shownImageLinks = [];

        for (let i = 0; i < this.constants.IMAGE_PER_PAGE; i++) {
            const imageIndex = this.currentPage * this.constants.IMAGE_PER_PAGE + i;
            this.shownImageLinks.push(this.imageLinks[imageIndex]);
        }
    }
}
