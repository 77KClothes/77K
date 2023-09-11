import { CartState } from '../store/cart/cart.reducer';
import { ProductDetail, ProductVariantDetails } from '../store/model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as CartActions from '../store/cart/cart.actions';
import { Observable, Subscription, throwError } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, take } from 'rxjs/operators';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  paramSubscription: Subscription;

  product: ProductDetail;
  activeProductVariant: ProductVariantDetails;
  allImageVariants: string[];
  activeProductImage: string = '';

  cartState: Observable<CartState>;
  innerLoading = true;

  productUrl: string;
  variant: number;

  isPopState = false;
  fetchError: HttpErrorResponse = null;
  routerSubscription: Subscription;

  activeTab = 0;

  zoomActive = false;
  initialX = 0;
  initialY = 0;
  xOffset = 0;
  yOffset = 0;


  constructor(private router: Router, private route: ActivatedRoute,
              private locStrat: LocationStrategy,
              private productService: ProductService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.locStrat.onPopState(() => {
      this.isPopState = true;
    });

    this.routerSubscription = this.router.events.subscribe(event => {
      // Scroll to top if accessing a page, not via browser history stack
      if (event instanceof NavigationEnd && !this.isPopState) {
        window.scrollTo(0, 0);
        this.isPopState = false;
      }

      // Ensures that isPopState is reset
      if (event instanceof NavigationEnd) {
        this.isPopState = false;
      }
    });

    this.cartState = this.store.select('cart');
    this.paramSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.productUrl = params.productUrl;

        this.innerLoading = true;
        this.productService.getFullProduct(this.productUrl)
          .pipe(take(1), catchError(
            error => {
              this.fetchError = error;
              this.innerLoading = false;
              return throwError(error);
            }
          ))
          .subscribe(
            (data: ProductDetail) => {
              this.product = data;
              this.variant = params.variant ? params.variant : this.product.productVariantDetails[0].id;
              this.activeProductVariant = data.productVariantDetails.find(p => p.id === Number(this.variant));
              console.log(this.product.productVariantDetails);

              // Obtener todas las imagenes de productVariantDetailsconst 
              this.allImageVariants = this.product.productVariantDetails.map(variant => variant.image);


              console.log("Images" + this.allImageVariants);

              if (!this.activeProductVariant) {
                this.activeProductVariant = data.productVariantDetails[0];
              }
              this.innerLoading = false;
              this.activeProductImage = this.allImageVariants[0];
            }
          );
      }
    );

  }

  changeMainImage(newImage: string) {
    this.activeProductImage = newImage;
  }  

  handleZoom() {
    this.zoomActive = !this.zoomActive;
    if (!this.zoomActive) {
      this.xOffset = 0;
      this.yOffset = 0;
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (this.zoomActive) {
      if (!this.initialX || !this.initialY) {
        this.initialX = e.clientX;
        this.initialY = e.clientY;
      }
      this.xOffset = e.clientX - this.initialX;
      this.yOffset = e.clientY - this.initialY;
    }
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

  }

  setActiveTab(tab: number) {
    this.activeTab = tab;
  }

  setActiveVariant(variantId: number) {
    this.router.navigate(['/detail/', this.productUrl, variantId]);
  }

  addToCart(amountElement: HTMLInputElement) {
    const amount = amountElement.value;
    const reg = new RegExp('^[0-9]+$');
    if (!reg.test(amount) || parseInt(amount) === 0) {
      alert('Please enter a valid amount.');
      return;
    }

    this.store.select('auth')
      .pipe(take(1))
      .subscribe(data => {
        if (data.authenticated) {
          this.store.dispatch(new CartActions.AddToCart({ id: this.activeProductVariant.id, amount }));
        }
        else {
          this.router.navigate(['/login']);
        }
      });
  }
}
