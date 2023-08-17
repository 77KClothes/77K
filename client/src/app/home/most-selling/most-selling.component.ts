import { ShowcaseState } from './../../store/showcase/showcase.reducer';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as fromApp from '../../store/app.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ShowcaseActions from '../../store/showcase/showcase.actions';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-most-selling',
  templateUrl: './most-selling.component.html',
  styleUrls: ['./most-selling.component.scss']
})
export class MostSellingComponent implements OnInit {

  @ViewChild('mostCards', { read: ElementRef }) mostCards: ElementRef<HTMLElement>;

  showcaseState: Observable<ShowcaseState>;
  isDragging: boolean = false;
  startX: number;
  scrollLeft: number; // Declare scrollLeft here
  scrollSpeed: number = 20;
  scrollInterval: any;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.showcaseState = this.store.select('showcase');
    this.showcaseState
      .pipe(take(1))
      .subscribe(
        data => {
          if (data.mostSelling.length === 0) {
            this.store.dispatch(new ShowcaseActions.FetchMostSelling());
          }
        }
      );
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX - this.mostCards.nativeElement.offsetLeft;
    this.scrollLeft = this.mostCards.nativeElement.scrollLeft; // Assign the current scrollLeft value
    this.scrollInterval = setInterval(() => {
      this.mostCards.nativeElement.scrollLeft -= this.scrollSpeed;
    }, 100);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
    clearInterval(this.scrollInterval);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.clientX - this.mostCards.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1;
    this.mostCards.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onCardClick(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  scrollRight() {
    this.mostCards.nativeElement.scrollLeft += 250;
  }
}
