import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
  selector: 'hero-search',
  templateUrl: 'app/hero-search.component.html',
  styleUrls: ['app/hero-search.component.html'],
  providers: [HeroSearchService]
})

export class HeroSearchComponent implements OnInit {

  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router
  ) {}

  // Push a serch term into the observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }
  
  ngOnInit(): void {
    this.heroes = this.searchTerms
                    .debounceTime(300) // wait for 300ms pause in events
                    .distinctUntilChanged() // ignore if next search term is same as previoues
                    .switchMap( term => term // switch to new observable each time
                                ? this.heroSearchService.search(term) // return the http search observable
                                : Observable.of<Hero[]>([])) // or the observable of empty heroes if no search term
                    .catch( error => {
                      console.log(error); // TODO real error handling
                      return Observable.of<Hero[]>([]));
                    });
  }
}
