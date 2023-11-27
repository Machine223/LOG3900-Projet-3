import { TestBed } from '@angular/core/testing';

import { ChatIOService } from './chat-io.service';

describe('ChatIOService', () => {
    let service: ChatIOService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatIOService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
