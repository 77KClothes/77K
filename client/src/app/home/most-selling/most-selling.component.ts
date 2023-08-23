  import { ShowcaseState } from './../../store/showcase/showcase.reducer';
  import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
  import * as fromApp from '../../store/app.reducers';
  import { Store } from '@ngrx/store';
  import { Observable } from 'rxjs';
  import * as ShowcaseActions from '../../store/showcase/showcase.actions';
  import { take } from 'rxjs/operators';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-most-selling',
    templateUrl: './most-selling.component.html',
    styleUrls: ['./most-selling.component.scss']
  })
  export class MostSellingComponent implements OnInit {

    @ViewChild('mostCards', { read: ElementRef }) mostCards: ElementRef<HTMLElement>;

    showcaseState: Observable<ShowcaseState>;
    startX: number;
    startScrollLeft: number; // Added to store initial scrollLeft position
    scrollSpeed: number = 20;
    scrollInterval: any;
    routeTo: string;
    canRoute: boolean = false;

    constructor(private store: Store<fromApp.AppState>,
      private router: Router) {}

    ngOnInit() {
      this.showcaseState = this.store.select('showcase');
      this.showcaseState.pipe(take(1)).subscribe(data => {
        if (data.mostSelling.length === 0) {
          this.store.dispatch(new ShowcaseActions.FetchMostSelling());
        }
      });
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
      this.startX = event.clientX
      this.startScrollLeft = this.mostCards.nativeElement.scrollLeft;
      console.log("mousedown")
      console.log(this.startX, this.startScrollLeft);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
      console.log("mouseup")
      console.log(this.startX, this.startScrollLeft);
      // imprime la posicion del mouse al soltar el click
      console.log(event.clientX, event.clientY);
      if (this.startX == event.clientX) {
        console.log("entre porque son iguales: " + this.startX + " - " + event.clientX)
        this.canRoute = true;
      }
      if(this.startX > event.clientX) {
        // scrolear hacia la derecha
        console.log("scrolear hacia la derecha")
        this.scrollRight();
      }
      if(this.startX < event.clientX) {
        // scrolear hacia la izquierda
        console.log("scrolear hacia la izquierda")
        this.scrollLeft();
      }
      this.startX = undefined;
      this.startScrollLeft = undefined;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
      if (this.startX !== undefined) {
        const x = event.clientX - this.mostCards.nativeElement.offsetLeft;
        const walk = (x - this.startX) * 1;
        this.mostCards.nativeElement.scrollLeft = this.startScrollLeft - walk;
      }
    }

    onCardClick(url: string, productVariantId: string) {
      console.log("onCardClick - canRoute: " + this.canRoute)
      if(this.canRoute) {
        console.log("ruteo hacia: " + url + " con el id: " + productVariantId)
        this.routeTo = `/detail/${url}/${productVariantId}`;
        this.router.navigate([this.routeTo]);
      }
    }

    justAMethod(){
      console.log("This make nothing, but if you want to use this method, you can do it")
      console.log("Another thing, if you delete this method, you will brake the code :)")
    }

    private findAncestor(element: any, selector: string): HTMLElement | null {
      while (element && element !== document) {
        if (element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
      }
      return null;
    }

    scrollLeft() {
      const scrollStep = 30; // Ajusta este valor para cambiar la suavidad del desplazamiento
      const scrollAmount = 1000; // Ajusta este valor para cambiar la cantidad de desplazamiento

      const start = this.mostCards.nativeElement.scrollLeft;
      const target = Math.max(start - scrollAmount, 0);
      const increment = Math.ceil((start - target) / (scrollAmount / scrollStep));

      const smoothScroll = () => {
        if (this.mostCards.nativeElement.scrollLeft > target) {
          this.mostCards.nativeElement.scrollLeft -= increment;
          requestAnimationFrame(smoothScroll);
        }
      };

      smoothScroll();
    }

    scrollRight() {
      const scrollStep = 30; // Ajusta este valor para cambiar la suavidad del desplazamiento
      const scrollAmount = 1000; // Ajusta este valor para cambiar la cantidad de desplazamiento
    
      const start = this.mostCards.nativeElement.scrollLeft;
      const target = start + scrollAmount;
      const increment = Math.ceil((target - start) / (scrollAmount / scrollStep));
    
      const smoothScroll = () => {
        if (this.mostCards.nativeElement.scrollLeft < target) {
          this.mostCards.nativeElement.scrollLeft += increment;
          requestAnimationFrame(smoothScroll);
        }
      };
    
      smoothScroll();
    }
    
  }
